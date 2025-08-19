import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormData } from "@/app/types/detection-model";
import { ModelStatus } from "@/app/constants/status"
// import { extractErrorMessage } from '@/app/utils/errorHandler';
// import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
// import { useSession } from "next-auth/react";
// import { updateStep4, getModelVersion } from "@/app/libs/services/detection-model";
// import { usePopupTraining } from '@/app/contexts/popup-training-context';
// import { UseTrainingStatusWebSocket } from '@/app/stores/useTrainingStatusSocketStore'; 

type Props = {
  modelVersionId: number;
  formData: FormData;
  isEditMode: boolean;
  prev: () => void;
  isTraining: boolean;
};

export const step4Schema = z.object({
  modelVersionId: z.number(),
});

type Step4Data = z.infer<typeof step4Schema>;

export default function DetectionModelStep4Page({ prev, modelVersionId, formData, isEditMode, isTraining }: Props) {
  // const { data: session } = useSession();
  // const { displayProcessing, displaySuccess, displayError, hidePopup } = usePopupTraining();
  // const [currentStep, setCurrentStep] = useState(0);

  const defaultValues: Step4Data = {
    modelVersionId: modelVersionId,
  };

  const {
    register, 
    // handleSubmit, 
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const modelVersion = await getModelVersion(modelVersionId);
  //     const currentStep = modelVersion.currentStep;
  //     setCurrentStep(currentStep);

  //     // if (isEditMode && !isTraining && currentStep !== 4) {
  //     //   handleStartTraining();
  //     // }
  //   };

  //   fetchData();
  // }, []);

  // const handleStartTraining = async () => {
  //   try {
  //     displayProcessing(`Detection model ${formData.modelName} training...`);

  //     const result = await startTraining?.(modelVersionId);
  //     // await new Promise((resolve) => setTimeout(resolve, 2000));
      
  //     if (result) {
  //       console.log(`Model training completed.`);
  //     } else {
  //       console.log(`Model training failed.`);
  //     }
  //   } catch (error) {
  //     console.error('Model training failed:', error);
  //   }
  // };

  const onPrevious = async () => {
    prev();

    // if (!isEditMode) prev();
    
    // if (!isTraining) {
    //   prev();
    //   return;
    // }

    // const result = await showConfirm('Are you sure you want to cancel this training model?');
    // if (result?.isConfirmed) {
    //   const cancelled = await cancelTraining();
    //   if (cancelled) {
    //     displayError('Training cancelled by user.');
    //     await showError('Training cancelled by user.');
    //     prev();
    //   }
    // }
  };

  // const onSubmitHandler = async () => {
  //   try {
  //     const updatedFormData: FormData = {
  //       ...formData,
  //       currentStep: 4,
  //       updatedBy: session?.user?.userid,
  //     };
      
  //     if (isEditMode) {
  //       await updateStep4(modelVersionId, updatedFormData);
  //       setCurrentStep(4);
  //       await showSuccess(`Saved successfully`)
  //     }
      
  //     next({
  //       ...updatedFormData,
  //       statusId: ModelStatus.Ready,
  //     });

  //   } catch (error) {
  //     showError(`Save failed: ${extractErrorMessage(error)}`);
  //   }
  // };
  
  // console.log("isTraining", isTraining)

  return (
    <div className="w-full">
      <div className="h-80 bg-white border border-gray-300 flex items-center justify-center mb-6">
        {formData.statusId === ModelStatus.Ready ? (
          <span className="text-3xl font-medium leading-relaxed text-center">
            TRAIN<br />COMPLETED
          </span>
        ) : (
          <span className="text-2xl font-medium">PLEASE WAIT....</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <input type="hidden" {...register("modelVersionId")} />
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

        {/* {isEditMode && currentStep != 4 && (
          <button 
            className="px-4 py-2 btn-primary-dark rounded gap-2 w-32 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmitHandler)}
            disabled={isTraining || (!isEditMode && (formData.currentStep ?? 0) == 4)}
          >
            Finish
          </button>
        )} */}
      </div>
    </div>
  );
}
