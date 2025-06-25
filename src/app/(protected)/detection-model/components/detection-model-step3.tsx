import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import Konva from 'konva';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, SquarePen, Trash2, Plus } from "lucide-react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { SelectOption } from "@/app/types/select-option";
import { ShapeType } from "@/app/constants/shape-type";
import { FormData, DetectionModel, ModelPicture, Annotation } from "@/app/types/detection-model";
import { getPicture } from "@/app/libs/services/detection-model";
import { useSession } from "next-auth/react";
import ImageLoading from "@/app/components/loading/ImageLoading";
import SpinnerLoading from "@/app/components/loading/SpinnerLoading";
import AnnotationModal from "./annotation-modal";
import { detail, updateStep3 } from "@/app/libs/services/detection-model";
import { nanoid } from 'nanoid';
import { usePopupTraining } from '@/app/contexts/popup-training-context';
import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 

type Props = {
  next: (data: any) => void;
  prev: () => void;
  modelVersionId: number;
  formData: FormData;
  isEditMode: boolean;
};

// export const step3Schema = z.object({
//   modelVersionId: z.number(),
// });

// type Step3Data = z.infer<typeof step2Schema>;

export default function DetectionModelStep3Page({ next, prev, modelVersionId, formData, isEditMode }: Props) {
  // console.log("formData:", formData);
  const { data: session } = useSession();
  const { hasPermission } = usePermission();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [pictureList, setPictureList] = useState<ModelPicture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<ModelPicture | null>(null);
  const [editPicture, setEditPicture] = useState<ModelPicture | null>(null);
  const [isOpenAnnotation, setIsOpenAnnotation] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const { isTraining } = useTrainingSocketStore();

  // const defaultValues: Step2Data = {
  //   modelVersionId: modelVersionId,
  // };

  const {
    register, 
    getValues, 
    setValue, 
    reset,
    handleSubmit, 
    clearErrors,
    formState: { errors },
  } = useForm ({
    // resolver: zodResolver(step2Schema),
    // defaultValues
  });

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const result = await getPicture();
        setPictureList(result);
        setSelectedPicture(result[0]);
        handlePreview(result[0]);
        // reset({
        //   modelVersionId: modelVersionId,
        // });
      } catch (error) {
        console.error("Failed to load picture:", error);
      }
    };
    fetchPicture();
  }, []);
  
  useEffect(() => {
    stageRef.current?.batchDraw();
  }, [annotations, imageObj]);

  const renderAnnotation = (ann) => {
    // Calculate label position
    let labelX = ann.startX;
    let labelY = ann.startY - 15;

    if (ann.type === 'rectangle') {
      labelX = ann.startX + ann.width / 2;
      labelY = ann.startY - 15;
    } else if (ann.type === 'circle') {
      labelX = ann.startX;
      labelY = ann.startY - ann.radius - 15;
    }

    return (
      <Group key={ann.id}>
        {/* Annotation shape */}
        {ann.type === 'rectangle' && (
          <Rect
            id={ann.id}
            x={ann.startX}
            y={ann.startY}
            width={ann.width}
            height={ann.height}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={2}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn = {
                ...ann,
                startX: node.x(),
                startY: node.y(),
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {ann.type === 'circle' && (
          <Circle
            id={ann.id}
            x={ann.startX}
            y={ann.startY}
            radius={ann.radius}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={2}
            onDragEnd={(e) => {
              const node = e.target;
              const updatedAnn = {
                ...ann,
                startX: node.x(),
                startY: node.y(),
              };
              setAnnotations(annotations?.map(a => a.id === ann.id ? updatedAnn : a));
            }}
          />
        )}

        {ann.type === 'polygon' && ann.points.length > 2 && (
          <Line
            id={ann.id}
            points={ann.points}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={2}
            closed
          />
        )}

        {/* Label */}
        {ann.label && (
          <Text
            x={labelX}
            y={labelY}
            text={ann.label?.name}
            fontSize={14}
            fontStyle="bold"
            fill={ann.color}
            align="center"
            verticalAlign="top"
            offsetX={(ann.label?.name.length || 0) * 3.5}
          />
        )}
      </Group>
    );
  };

  const handleAdd = async () => {
    fileRef.current?.click();
  };
    
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
  
    if (files.length === 0) {
      showError("No files selected.");
      return;
    }
  
    const allowedExtensions = ["png", "jpg", "jpeg"];
    const maxSizeMB = 10;
  
    const newImages: ModelPicture[] = [];
  
    for (const file of files) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      const fileSizeInMB = (file.size / 1024 / 1024).toFixed(2);
  
      if (!allowedExtensions.includes(fileExtension)) {
        showError(`Invalid file type for ${file.name}. Only PNG, JPG, and JPEG are allowed.`);
        continue;
      }
  
      if (parseFloat(fileSizeInMB) > maxSizeMB) {
        showError(`File ${file.name} is too large. Max size is ${maxSizeMB} MB.`);
        continue;
      }
  
      const imageUrl = URL.createObjectURL(file);
      newImages.push({ 
        id: null,
        name: file.name, 
        url: imageUrl,
        file: file,
        refId: nanoid(),
      });
    }
  
    setPictureList((prev) => [...prev, ...newImages]);
  
    // if (newImages.length > 0) {
    //   showSuccess(`${newImages.length} image(s) added successfully.`);
    // }
  
    e.target.value = "";
  };
  
  const handleDelete = async (index: number) => {
    const result = await showConfirm('Are you sure you want to delete this image?');
    if (result.isConfirmed) {
      // Call API

      setPictureList((prev) => {
        const toDelete = prev[index];
        const newList = prev.filter((_, i) => i !== index);

        if (imageObj?.src === toDelete.url) {
          setImageObj(null);
          setSelectedPicture(null);
        }

        return newList;
      });
    }
  };

  const handlePreview = (image: ModelPicture) => {
    setSelectedPicture(image);
    setIsImageLoading(true);

    const img = new Image();
    img.onload = () => {
      setImageObj(img);
    };

    if (!image.url) return;
    img.src = image.url;
    
    setIsImageLoading(false);

    setAnnotations(image.annotations ?? []);
    
  };

  const handleSaveAnnotation = (editData: ModelPicture[]) => {
    const updateAnnotations = editData.map((pic) => {
      return {
        ...pic,
        annotations: [...(pic.annotations ?? [])],
      };
    });
    setPictureList(updateAnnotations);

    if (selectedPicture?.refId) {
      const updatedSelected = updateAnnotations.find(c => c.refId === selectedPicture.refId);
      if (!updatedSelected) return;

      handlePreview(updatedSelected);
    }

    const jsonData = editData?.flatMap((img) =>
      img.annotations?.map((ann) => {
        const base = {
          id: ann.id,
          type: ann.type,
          color: ann.color,
          class: {
            id: ann.label?.id || "",
            name: ann.label?.name || "",
          },
        };

        const arrayPoints: [number, number][] = Array.isArray(ann.points)
          ? ann.points.reduce<[number, number][]>((acc, val, i) => {
              if (i % 2 === 0 && ann.points[i + 1] !== undefined) {
                acc.push([val, ann.points[i + 1]]);
              }
              return acc;
            }, [])
          : [];

        switch (ann.type) {
          case 'rectangle':
            return {
              ...base,
              bbox: [
                ann.startX,                     // x_min
                ann.startY,                     // y_min
                ann.startX + ann.width,         // x_max
                ann.startY + ann.height         // y_max
              ],
              // bbox: [
              //   ann.startX - ann.height,          // x_min
              //   ann.startY - ann.width,           // y_min
              //   ann.startX + ann.width,           // x_max
              //   ann.startY + ann.height           // y_max
              // ],
            };
          case 'circle':
            return {
              ...base,
              center: [ann.startX, ann.startY],
              radius: ann.radius,
            };
          case 'polygon':
            return {
              ...base,
              points: arrayPoints,
            };
          case 'point':
            return {
              ...base,
              position: [ann.startX, ann.startY],
            };
          default:
            return base;
        }
      }) || []
    );
    exportJson(jsonData);

    setIsOpenAnnotation(false);
  };

  const exportJson = async (exportDate: any) => {
    const dataStr = JSON.stringify(exportDate, null, 2);
    console.log("dataStr:", dataStr);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotations_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  
  const handleStartTraining = async () => {
    try {
      const updatedFormData: FormData = {
        ...formData,
        currentStep: 3,
        updatedBy: session?.user?.userid,
      };

      if (isEditMode) {
        console.log("Submit data3:", updatedFormData);
        // await updateStep2(modelVersionId, updatedFormData);
        // await showSuccess(`Saved successfully`)
      }
      next(updatedFormData);
    } catch (error) {
      console.error('Save step3 failed:', error);
      showError('Save failed')
    }
  }

  const onNext = async () => {
    const updatedFormData: FormData = {
      ...formData,
      currentStep: 3,
      updatedBy: session?.user?.userid,
    };
    next(updatedFormData);
  }
  
  const stageWidth = 760;
  const stageHeight = 500;

  return (
    <div className="w-full">
      <div className="flex flex-col h-[63vh]">
        <div className="flex flex-1 gap-4">

          {/* Picture List Panel */}
          <div className="w-1/2 bg-white rounded shadow">
            <div className="flex items-center justify-between bg-blue-200 p-2 rounded-t">
              <h2 className="font-semibold text-blue-900">Picture List</h2>
              {isEditMode && (
                <>
                <button 
                  onClick={handleAdd}
                  className="bg-blue-600 text-xs text-white px-2 py-1 rounded flex items-center gap-1 mr-2">
                  Add <Plus size={16} /> 
                </button>
                <input
                  multiple
                  ref={fileRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
              )}
            </div>
          
            {/* Table for Image List */}
            <table className="min-w-full table-auto">
              <tbody>
                {pictureList.map((img, index) => (
                  <tr
                    key={index}
                    className={`border-b transition-colors duration-150 cursor-pointer ${
                      img.refId === selectedPicture?.refId ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-2 text-sm w-6">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{img.name}</td>
                    <td className="px-4 py-2 text-sm w-1/5">
                      <div className="flex gap-2 justify-start">
                        <button
                          onClick={() => handlePreview(img)}
                          className="bg-blue-600 text-xs text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          Preview <Eye size={16} /> 
                        </button>
                        {isEditMode && (
                          <>
                            <button 
                              onClick={() => {
                                setEditPicture(img);
                                setIsOpenAnnotation(true);
                              }}
                              className="bg-cyan-500 text-xs text-white px-2 py-1 rounded flex items-center gap-1"
                            >
                              Edit <SquarePen size={14} /> 
                            </button>
                            <button 
                              onClick={() => handleDelete(index)}
                              className="bg-red-500 text-xs text-white px-2 py-1 rounded flex items-center gap-1">
                              Delete <Trash2 size={14} /> 
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-white rounded shadow">
            <div className="bg-blue-200 p-2 rounded-t">
              <h2 className="font-semibold text-blue-900">Preview</h2>
            </div>
            <div className="p-4 flex justify-center items-center">
              <div className="flex justify-center items-center min-h-[300px] relative">
                {isImageLoading && ( 
                  <ImageLoading/>
                )}
                {imageObj && (
                  <Stage
                    key={imageObj?.src}
                    width={stageWidth}
                    height={stageHeight}
                    ref={stageRef}
                    className="bg-gray-100"
                  >
                    <Layer>
                      {imageObj && (
                        <Rect
                          name="background"
                          width={stageWidth}
                          height={stageHeight}
                          fillPatternImage={imageObj}
                          fillPatternScaleX={stageWidth / imageObj.width}
                          fillPatternScaleY={stageHeight / imageObj.height}
                        />
                      )}
                      {annotations.map(ann => renderAnnotation(ann))}
                    </Layer>
                  </Stage>
                  // <img
                  //   src={selectedPicture.url ?? ""}
                  //   alt="preview"
                  //   className="w-full max-w-[680px] object-contain"
                  //   onLoad={() => setIsImageLoading(false)}
                  //   onError={() => setIsImageLoading(false)}
                  // />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          className="fixed bottom-0 right-0 p-7 flex justify-between"
          style={{ zIndex: 1000, left: "250px" }}
        >
          <button 
            className="ml-1 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 transition w-32"
            onClick={prev}
          >
            Previous
          </button>
          
          {isEditMode ? (
            <button
              className={`px-4 py-2 rounded gap-2 w-32 ${isTraining ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-primary-dark text-white"}`}
              disabled={isTraining}
              onClick={handleStartTraining}
            >
              Start Training
            </button>
          ) : (
            <button 
              className="px-4 py-2 btn-primary-dark rounded gap-2 w-32"
              onClick={onNext}
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Annotation Modal */}
      {isOpenAnnotation && (
        <AnnotationModal
          canEdit={hasPermission(Menu.Planning, Action.Edit)}
          onClose={() => setIsOpenAnnotation(false)}
          onSave={handleSaveAnnotation}
          data={pictureList}
          editPicture={editPicture ?? pictureList?.[0]}
        />
      )}

    </div>
  );
}
