import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import SelectField from "@/app/components/common/SelectField";
import { detail, getCamera, getModelVersion } from "@/app/lib/services/detection-model";
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { SelectOption } from "@/app/types/select-option";

type Props = {
  prev: () => void;
  next: (data: any) => void;
  formData: FormData;
  modelId: string;
};

export const step4Schema = z.object({
  modelId: z.string(),
  cameraId: z.string().min(1, "Camera ID is required"),
  version: z.string().min(1, "Model Version is required"),
  isComplete: z.boolean(),
});

type Step4Data = z.infer<typeof step4Schema>;

export default function DetectionModelStep4Page({ prev, next, modelId, formData }: Props) {
  console.log("formData:", formData);
  const [cameraOptions, setCameraOptions] = useState<SelectOption[]>([]);
  const [versionOptions, setVersionOptions] = useState<SelectOption[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [isTraining, setIsTraining] = useState(false);
  
  const defaultValues: Step4Data = {
    modelId: modelId,
    cameraId: '',
    version: '',
    isComplete: false,
  };

  const {
    register, 
    getValues, 
    setValue, 
    reset,
    handleSubmit, 
    clearErrors,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
  });

  useEffect(() => {
    const simulateTraining = async () => {
      // if(!formData?.isComplete) {
        setIsTraining(true);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setIsTraining(false);
      // }
    };
    simulateTraining();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cameraResult, versionResult] = await Promise.all([
          getCamera(),
          getModelVersion(),
        ]);
        setCameraOptions(cameraResult);
        setVersionOptions(versionResult);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await detail(formData.modelId ?? "");
        if (result) {
          reset({
            modelId: modelId,
            version: selectedVersion,
            cameraId: selectedCamera,
            isComplete: false,
          });
        } else {
          reset(defaultValues);
        }
  
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    fetchData();
  }, [reset]);
  
  useEffect(() => {
    setValue("cameraId", selectedCamera);
  }, [selectedCamera, setValue]);
  
  useEffect(() => {
    setValue("version", selectedVersion);
  }, [selectedVersion, setValue]);

  const onSubmitHandler = (data: Step4Data) => {
    if (!data.cameraId || !data.version) {
      showError("Please complete all required fields.");
      return;
    }

    const updatedFormData: FormData = {
      ...formData,
      cameraId: data.cameraId,
      version: data.version,
      isComplete: true
    };
    
    next(updatedFormData);
    console.log("Step4Data:", formData);

    showSuccess("Saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="w-full">
        <div className="h-80 bg-white border border-gray-300 flex items-center justify-center mb-6">
          {isTraining ? (
            <span className="text-2xl font-medium">PLEASE WAIT....</span>
          ) : (
            <span className="text-3xl font-medium leading-relaxed text-center">
              TRAIN<br />COMPLETED
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <input type="hidden" {...register("modelId")} />
          <input type="hidden" {...register("isComplete")} />

          {/* Camera No. */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Camera ID :</label>
            <div className="w-64">
              <SelectField
                value={selectedCamera}
                onChange={(value) => {
                  setSelectedCamera(value);
                  clearErrors("cameraId");
                }}
                options={cameraOptions}
                disabled={isTraining}
              />
            </div>
          </div>
          {errors.cameraId && (<p className="text-red-500 ml-260">{errors.cameraId.message}</p>)}

          {/* Model Version */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Model Version :</label>
            <div className="w-64">
              <SelectField
                value={selectedVersion}
                onChange={(value) => {
                  setSelectedVersion(value);
                  clearErrors("version");
                }}
                options={versionOptions}
                disabled={isTraining}
              />
            </div>
          </div>
          {errors.version && (<p className="text-red-500 ml-260">{errors.version.message}</p>)}
        </div>
        
        <div
            className="fixed bottom-0 right-0 p-7 flex justify-between"
            style={{ zIndex: 1000, left: "250px" }}
          >
          <button
            className={`ml-1 px-4 py-2 rounded-md transition w-32 ${isTraining ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-400 hover:bg-gray-600 text-white" }`}
            onClick={prev}
            disabled={isTraining}
          >
            Previous
          </button>
          <button 
            type="submit"
            className={`px-4 py-2 rounded gap-2 w-32 ${isTraining ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-primary-dark text-white"}`}
            disabled={isTraining}
          >
            Finish
          </button>
        </div>
      </div>
    </form>
  );
}
