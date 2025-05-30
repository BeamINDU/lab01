import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, SquarePen, Trash2, Plus } from "lucide-react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { SelectOption } from "@/app/types/select-option";
import { FormData, DetectionModel, ModelPicture } from "@/app/types/detection-model";
import { getPicture } from "@/app/libs/services/detection-model";
import ImageLoading from "@/app/components/loading/ImageLoading";
import SpinnerLoading from "@/app/components/loading/SpinnerLoading";
import AnnotationModal from "./annotation-modal";
import { detail, updateStep2 } from "@/app/libs/services/detection-model";

type Props = {
  next: (data: any) => void;
  prev: () => void;
  modelId: number;
  formData: FormData;
};

export const step2Schema = z.object({
  // modelId: z.number(),
});

type Step2Data = z.infer<typeof step2Schema>;

export default function DetectionModelStep2Page({ next, prev, modelId, formData }: Props) {
  // console.log("formData:", formData);
  
  const { hasPermission } = usePermission();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [pictureList, setPictureList] = useState<ModelPicture[]>([]);
  const [selectedPicture, setSelectedPicture] = useState<string>("");
  const [isOpenAnnotation, setIsOpenAnnotation] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const defaultValues: Step2Data = {
    // modelId: modelId,
  };

  const {
    register, 
    getValues, 
    setValue, 
    reset,
    handleSubmit, 
    clearErrors,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues
  });

  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const result = await getPicture();
        setPictureList(result);
        setSelectedPicture(result[0]?.url);
        // reset({
        //   modelId: modelId,
        // });
      } catch (error) {
        console.error("Failed to load picture:", error);
      }
    };
    fetchPicture();
  }, []);
  

  const handleDelete = async (index: number) => {
    const result = await showConfirm('Are you sure you want to delete this image?')
    if (result.isConfirmed) {
      setPictureList((prev) => prev.filter((_, i) => i !== index));
      setSelectedPicture("");
    }
  };
  
  const handlePreview = (image: string) => {
    setIsImageLoading(true);
    setSelectedPicture(image);
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
      newImages.push({ id: 0, name: file.name, url: imageUrl });
    }
  
    setPictureList((prev) => [...prev, ...newImages]);
  
    // if (newImages.length > 0) {
    //   showSuccess(`${newImages.length} image(s) added successfully.`);
    // }
  
    e.target.value = "";
  };
  
  const handleSaveAnnotation = () => {
    console.log("Saved Annotation:");
    setIsOpenAnnotation(false);
  };
  
  const onSubmitHandler = async (data: Step2Data) => {
    console.log("Submit data2:", data);
    await updateStep2(data);
    
    const updatedFormData: FormData = {
      ...formData,
      currentStep: 2,
    };
    next(updatedFormData);
  }

  return (
    <div className="w-full">
      <div className="flex flex-col h-[63vh]">
        <div className="flex flex-1 gap-4">

          {/* <input type="hidden" {...register('modelId')} /> */}

          {/* Picture List Panel */}
          <div className="w-1/2 bg-white rounded shadow">
            <div className="flex items-center justify-between bg-blue-200 p-2 rounded-t">
              <h2 className="font-semibold text-blue-900">Picture List</h2>
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
            </div>
          
            {/* Table for Image List */}
            <table className="min-w-full table-auto">
              <tbody>
                {pictureList.map((img, index) => (
                  <tr
                    key={index}
                    className={`border-b transition-colors duration-150 cursor-pointer ${
                      img.url === selectedPicture ? "bg-blue-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* <td className="px-4 py-2 text-sm">{index + 1}</td> */}
                    <td className="px-4 py-2 text-sm">{img.name}</td>
                    <td className="px-4 py-2 text-sm w-1/5">
                      <div className="flex gap-2 justify-start">
                        <button
                          onClick={() => handlePreview(img.url)}
                          className="bg-blue-600 text-xs text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          Preview <Eye size={16} /> 
                        </button>
                        <button 
                          onClick={() => setIsOpenAnnotation(true)}
                          className="bg-cyan-500 text-xs text-white px-2 py-1 rounded flex items-center gap-1">
                          Edit <SquarePen size={14} /> 
                        </button>
                        <button 
                          onClick={() => handleDelete(index)}
                          className="bg-red-500 text-xs text-white px-2 py-1 rounded flex items-center gap-1">
                          Delete <Trash2 size={14} /> 
                        </button>
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
              <div className="p-4 flex justify-center items-center min-h-[300px] relative">
                {isImageLoading && ( 
                  <ImageLoading/>
                )}
                {selectedPicture && (
                  <img
                    src={selectedPicture}
                    alt="preview"
                    className="w-full max-w-[680px] object-contain"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
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
          <button 
            className="px-4 py-2 btn-primary-dark rounded gap-2 w-32"
            onClick={onSubmitHandler}
          >
            Next
          </button>
        </div>
      </div>

      {/* Annotation Modal */}
      {isOpenAnnotation && (
        <AnnotationModal
          canEdit={hasPermission(Menu.Planning, Action.Edit)}
          onClose={() => setIsOpenAnnotation(false)}
          onSave={handleSaveAnnotation}
        />
      )}

    </div>
  );
}
