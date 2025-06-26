import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import SelectField from '@/app/components/common/SelectField';
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { SelectOption } from "@/app/types/select-option";
import { ModelStatus } from "@/app/constants/status"
import { useSession } from "next-auth/react";
import { updateStep4, getVersion, getModelVersion } from "@/app/libs/services/detection-model";
import { usePopupTraining } from '@/app/contexts/popup-training-context';
import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 

type Props = {
  prev: () => void;
  next: (data: any) => void;
  startTraining: () => Promise<boolean>;
  formData: FormData;
  modelVersionId: number;
  isEditMode: boolean;
};

export const step4Schema = z.object({
  modelVersionId: z.number(),
  version: z.number().min(1, "Version is required"),
});

type Step4Data = z.infer<typeof step4Schema>;

export default function DetectionModelStep4Page({ prev, next, modelVersionId, formData, isEditMode, startTraining }: Props) {
  const { data: session } = useSession();
  const { isTraining, cancelConnection } = useTrainingSocketStore();
  const { displayProcessing, displaySuccess, displayError, hidePopup } = usePopupTraining();
  const [versionOptions, setVersionOptions] = useState<SelectOption[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number>(0);

  //--------------------------------------------------------------------------------------------
  
  useEffect(() => {
    if(isEditMode && !isTraining) {
      // handleStartTraining();
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
    modelVersionId: modelVersionId,
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

  useEffect(() => {
    if (!formData?.modelId) return;

    const fetchVersion = async () => {
      try {
        const result = await getVersion(formData.modelId ?? 0);
        setVersionOptions(result);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
  
    fetchVersion();
  }, []);
  
  useEffect(() => {
    if (!formData?.modelId || formData.currentVersion == null || modelVersionId == null) return;

    setSelectedVersion(formData.currentVersion);

    reset({
      modelVersionId,
      version: formData.currentVersion,
    });
  }, [formData?.modelId, formData?.currentVersion, modelVersionId, reset]);


  const onPrevious = async () => {
    if (!isEditMode) prev();
    
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
    try {
      const data = getValues();

      if (!data.version) {
        showError("Version is required");
        return;
      }

      const updatedFormData: FormData = {
        ...formData,
        currentStep: 4,
        version: data.version,
        updatedBy: session?.user?.userid,
      };
      
      if (isEditMode) {
        console.log("Submit data4:", updatedFormData);
        await updateStep4(modelVersionId, updatedFormData);
      }

      await showSuccess("Saved successfully!");
      next({
        ...updatedFormData,
        statusId: 'Using',
      });
    } catch (error) {
      console.error('Save step1 failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };
  
  return (
    <div className="w-full">
      <div className="h-80 bg-white border border-gray-300 flex items-center justify-center mb-6">
        {isEditMode && isTraining ? (
          <span className="text-2xl font-medium">PLEASE WAIT....</span>
        ) : (
          <span className="text-3xl font-medium leading-relaxed text-center">
            TRAIN<br />COMPLETED
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <input type="hidden" {...register("modelVersionId")} />

        {/* Model Version */}
        <div className="flex items-center">
          <label className="w-64 font-medium">Version :</label>
          <div className="w-64">
            <SelectField
              value={String(selectedVersion)}
              onChange={(value) => {
                const parsed = parseInt(value);
                setSelectedVersion(parsed);
                setValue("version", parsed, { shouldValidate: true });
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
        {isEditMode && (
          <button 
            className={`px-4 py-2 rounded gap-2 w-32 ${isTraining ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "btn-primary-dark text-white"}`}
            onClick={handleSubmit(onSubmitHandler)}
            disabled={isTraining}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
