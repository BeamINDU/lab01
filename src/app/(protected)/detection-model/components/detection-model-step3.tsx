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
import { FormData, DetectionModel, ModelPicture } from "@/app/types/detection-model";
import type { Annotation, RectangleAnnotation, CircleAnnotation, PolygonAnnotation, PointAnnotation } from "@/app/types/annotation";
import { updateStep3, removeImage, getImage, annotateImage } from "@/app/libs/services/detection-model";
import { useSession } from "next-auth/react";
import ImageLoading from "@/app/components/loading/ImageLoading";
import SpinnerLoading from "@/app/components/loading/SpinnerLoading";
import AnnotationModal from "./annotation-modal";
import { nanoid } from 'nanoid';
import { usePopupTraining } from '@/app/contexts/popup-training-context';
import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 

type Props = {
  modelVersionId: number;
  formData: FormData;
  isEditMode: boolean;
  next: (data: any) => void;
  prev: () => void;
};

export default function DetectionModelStep3Page({ next, prev, modelVersionId, formData, isEditMode }: Props) {
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
  // const { register, getValues, setValue, reset, handleSubmit, clearErrors, formState: { errors } } = useForm ();

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const result = await getImage(modelVersionId);
        setPictureList(result);
        setSelectedPicture(result[0]);
        handlePreview(result[0]);
      } catch (error) {
        console.error("Failed to load picture:", error);
      }
    };
    fetchPicture();
  }, []);
  
  useEffect(() => {
    stageRef.current?.batchDraw();
  }, [annotations, imageObj]);

  const renderAnnotation = (ann: Annotation) => {
    let labelX = 0;
    let labelY = 0;

    switch (ann.type) {
      case 'rectangle':
        labelX = (ann.bbox[0] + ann.bbox[2]) / 2;
        labelY = ann.bbox[1] - 15;
        break;
      case 'circle':
        labelX = ann.center[0];
        labelY = ann.center[1] - ann.radius - 15;
        break;
      case 'polygon':
        [labelX, labelY] = ann.points[0] ?? [0, 0];
        labelY -= 15;
        break;
      case 'point':
        [labelX, labelY] = ann.position;
        labelY -= 15;
        break;
    }

    return (
      <Group key={ann.id}>
        {/* Rectangle */}
        {ann.type === 'rectangle' && (
          <Rect
            id={ann.id}
            x={ann.bbox[0]}
            y={ann.bbox[1]}
            width={ann.bbox[2] - ann.bbox[0]}
            height={ann.bbox[3] - ann.bbox[1]}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={2}
          />
        )}

        {/* Circle */}
        {ann.type === 'circle' && (
          <Circle
            id={ann.id}
            x={ann.center[0]}
            y={ann.center[1]}
            radius={ann.radius}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={2}
          />
        )}

        {/* Polygon */}
        {ann.type === 'polygon' && ann.points.length > 2 && (
          <Line
            id={ann.id}
            points={ann.points.flat()}
            fill={ann.color + '33'}
            stroke={ann.color}
            strokeWidth={2}
            closed
          />
        )}

        {/* Point */}
        {ann.type === 'point' && (
          <Circle
            id={ann.id}
            x={ann.position[0]}
            y={ann.position[1]}
            radius={5}
            fill={ann.color}
            stroke={ann.color}
          />
        )}

        {/* Label for all types */}
        {ann.class && (
          <Text
            x={labelX}
            y={labelY}
            text={ann.class.name}
            fontSize={14}
            fontStyle="bold"
            fill={ann.color}
            align="center"
            verticalAlign="top"
            offsetX={(ann.class.name.length || 0) * 3.5}
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
        file: file,
        url: imageUrl,
        refId: nanoid(),
      });
    }
  
    setPictureList((prev) => [...prev, ...newImages]);
  
    // if (newImages.length > 0) {
    //   showSuccess(`${newImages.length} image(s) added successfully.`);
    // }
  
    e.target.value = "";
  };
  
  const handleDelete = async (imageid: number, index: number) => {
    const result = await showConfirm('Are you sure you want to delete this image?');
    if (result.isConfirmed) {
      if(imageid !== null)
        await removeImage(imageid);

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

    if (!image?.url) return;
    img.src = image.url;
    
    setIsImageLoading(false);

    setAnnotations(image.annotate ?? []);
    
  };

  const handleSaveAnnotation = (editData: ModelPicture[]) => {
    const updateAnnotations = editData.map((pic) => {
      return {
        ...pic,
        annotations: [...(pic.annotate ?? [])],
      };
    });

    setPictureList(updateAnnotations);

    if (selectedPicture?.refId) {
      const updatedSelected = updateAnnotations.find(c => c.refId === selectedPicture.refId);

      if (!updatedSelected) return;

      handlePreview(updatedSelected);
    }

    console.log("editData", editData);
    // exportJson(editData);
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
        // console.log("Submit data3:", updatedFormData);
        await updateStep3(modelVersionId, updatedFormData);
        await showSuccess(`Saved successfully`)
      }
      next(updatedFormData);
    } catch (error) {
      console.error('Save step3 failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  }

  const handleNext = async () => {
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
                              onClick={() => handleDelete(img.id ?? 0, index)}
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
                      {annotations?.map(ann => renderAnnotation(ann))}
                    </Layer>
                  </Stage>
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
              className="px-4 py-2 btn-primary-dark rounded gap-2 w-32 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={(!isEditMode && (formData.currentStep ?? 0) == 3)}
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
          modelVersionId={modelVersionId}
          productId={formData?.productId}
          cameraId={formData?.cameraId ?? ''}
          modelId={formData?.modelId ?? 0}
          data={pictureList}
          editPicture={editPicture ?? pictureList?.[0]}
        />
      )}

    </div>
  );
}
