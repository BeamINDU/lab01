import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
// import SearchField from '@/app/components/common/SearchField';
import SelectField from '@/app/components/common/SelectField';
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { SelectOption } from "@/app/types/select-option";
import { ModelStatus } from "@/app/constants/status"
import { getCameraIdOptions } from "@/app/libs/services/camera";
import { getCamera, detail, updateStep4 } from "@/app/libs/services/detection-model";
import { usePopupTraining } from '@/app/contexts/popup-training-context';
import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 

type Props = {
  prev: () => void;
  next: (data: any) => void;
  startTraining: () => Promise<boolean>;
  formData: FormData;
  modelId: number;
};

export const step4Schema = z.object({
  modelId: z.number(),
  cameraId: z.string().min(1, "Camera ID is required"),
  version: z.number().min(1, "Model Version is required"),
});

type Step4Data = z.infer<typeof step4Schema>;

export default function DetectionModelStep4Page({ prev, next, modelId, formData, startTraining }: Props) {
  // console.log("formData3:", formData);
  const { isTraining, cancelConnection } = useTrainingSocketStore();
  const { displayProcessing, displaySuccess, displayError, hidePopup } = usePopupTraining();
  const [cameraOptions, setCameraOptions] = useState<SelectOption[]>([]);
  const [versionOptions, setVersionOptions] = useState<SelectOption[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<number>(0);

  //--------------------------------------------------------------------------------------------
  
  useEffect(() => {
    if(!isTraining) {
      handleStartTraining();
    }
  }, []);

  const handleStartTraining = async () => {
    // const result = await showConfirm('Are you sure you want to begin the training process?')
    // if (result.isConfirmed) {
        // setIsTraining(true);
        
        try {
          console.info("isTraining", isTraining)
          displayProcessing(`Detection model ${formData.modelName} training...`);

          await startTraining();

          // if(success) {
          //   setIsTraining(false);
          // }
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          // showSuccess(`Model training completed.`)
          // setIsTraining(false);
        } catch (error) {
          console.error('Model training failed:', error);
          // showError('Model training failed.')
        } 
    // }
  };

  //-------------------------------------------------------------------------------------------

  const defaultValues: Step4Data = {
    modelId: modelId,
    cameraId: '',
    version: 0,
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
    defaultValues
  });

  const getModelVersion = async () => {
    const baseVersion = (formData.statusId === ModelStatus.Processing && formData.currentVersion != null) 
      ? 0 
      : formData.currentVersion ?? 0;
  
    const maxVersion = baseVersion + 1;
  
    const versions = Array.from({ length: maxVersion }, (_, i) => {
      const version = maxVersion - i;
      return { label: `${version}`, value: `${version}` };
    });
  
    return versions as SelectOption[];
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await detail(modelId);
        if (result) {
          reset({
            modelId: modelId,
            version: selectedVersion,
            cameraId: selectedCamera,
          });
        } 
        reset({
          modelId: modelId,
        });
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    fetchData();
  }, [reset]);

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
    setValue("cameraId", selectedCamera);
  }, [selectedCamera, setValue]);

  useEffect(() => {
    setValue("version", selectedVersion);
  }, [selectedVersion, setValue]);

  const onPrevious = async () => {
    if (!isTraining) {
      prev();
      return;
    }

    const result = await showConfirm('Are you sure you want to cancel this training model?');

    if (result?.isConfirmed) {
      const cancelled = await cancelConnection();
      if (cancelled) {
        displayError('Training cancelled by user.');
        await showError('Training cancelled by user.');
        prev();
      }
    }
  };

  
  const onSubmitHandler = async () => {
    const data = getValues();

    if (!data.cameraId || !data.version) {
      showError("Please complete all required fields.");
      return;
    }

    console.log("Submit data4:", data);
    await updateStep4(data);

    const updatedFormData: FormData = {
      ...formData,
      currentStep: 4,
      cameraId: data.cameraId,
      version: data.version,
    };
    next(updatedFormData);

    showSuccess("Saved successfully!");
  };

  // console.log("Form Errors:", errors);
  
  return (
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

        {/* Camera ID */}
        <div className="flex items-center">
          {/* <div className="w-[20%]">
            <SearchField
              register={register}
              setValue={setValue}
              fieldName="cameraId"
              label="Camera ID"
              placeholder="Search or enter camera ID..."
              dataLoader={getCameraIdOptions}
              labelField="label"
              valueField="value"
              allowFreeText={true}
            />
          </div> */}
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
          {/* <div className="w-[20%]">
            <SearchField
              register={register}
              setValue={setValue}
              fieldName="version"
              label="Version"
              placeholder="Search or enter Version..."
              dataLoader={getModelVersion}
              labelField="label"
              valueField="value"
              allowFreeText={true}
            />
          </div> */}
          <label className="w-64 font-medium">Version :</label>
          <div className="w-64">
            <SelectField
              value={String(selectedVersion)}
              onChange={(value) => {
                setSelectedVersion(parseInt(value));
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
          className={`ml-1 px-4 py-2 rounded-md transition w-32 bg-gray-400 hover:bg-gray-600 text-white`}
          onClick={onPrevious}
        >
          Previous
        </button>
        <button 
          className={`px-4 py-2 rounded gap-2 w-32 ${isTraining ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-primary-dark text-white"}`}
          onClick={handleSubmit(onSubmitHandler)}
          disabled={isTraining}
        >
          Finish
        </button>
      </div>
    </div>
  );
}
