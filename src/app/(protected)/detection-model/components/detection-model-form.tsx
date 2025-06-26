import { useState, useEffect } from "react";
import { showConfirm, showSuccess, showError, showWarning } from '@/app/utils/swal'
import { Check, CheckCircle, Circle, Loader2 } from "lucide-react";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { ModelStatus } from '@/app/constants/status';
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { detail, getModelVersion } from "@/app/libs/services/detection-model";
import clsx from "clsx";
import DetectionModelStep1 from './detection-model-step1';
import DetectionModelStep2 from './detection-model-step2';
import DetectionModelStep3 from './detection-model-step3';
import DetectionModelStep4 from './detection-model-step4';
import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 
import { usePopupTraining } from '@/app/contexts/popup-training-context';

const stepOptions = [
  "Select function and feature",
  "Configuration",
  "Annotation and Labeling",
  "Train and apply model"
];

type DetectionModelStepsProps = {
  modelVersionId: number, 
  isEditMode: boolean
};

export default function DetectionModelSteps({ modelVersionId, isEditMode }: DetectionModelStepsProps) {
  const { hasPermission } = usePermission();
  const { connect, send, cancelConnection, isTraining } = useTrainingSocketStore();
  const { displayProcessing, displaySuccess, displayError, hidePopup } = usePopupTraining();
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [step, setStep] = useState(1);
  const MAX_STEP = 4;

  const next = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prevStep) => Math.min(prevStep + 1, MAX_STEP));
  };

  const prev = () => setStep((s) => s - 1);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, modelVersionId: modelVersionId }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getModelVersion(modelVersionId);
        setFormData(prev => ({
          ...prev,
          modelVersionId,
          modelId: result?.modelId,
          modelName: result?.modelName,
          statusId: result?.statusId,
          currentVersion:  result?.currentVersion,
          currentStep: result?.currentStep ?? 1,
        }));
        setStep(Math.min((result?.currentStep ?? 1) + 1, MAX_STEP));
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    fetchData();
  }, [modelVersionId]);

  const handleNextStep = (nextStep: number) => {
    setStep(nextStep);
  };
  
  const handleStartTraining = async (): Promise<boolean> => {
    try {
      await new Promise<void>((resolve, reject) => {
        
        connect((status) => {
          if (status === 'done') {
            displaySuccess(`Detection model ${formData.modelName} training completed.`);
          } else if (status === 'error') {
            displayError(`Detection model ${formData.modelName} training failed.`);
          }
        });
  
        const checkSocketOpen = () => {
          const socket = useTrainingSocketStore.getState().socket;
          if (socket && socket.readyState === WebSocket.OPEN) {
            resolve();
          } else {
            setTimeout(checkSocketOpen, 100);
          }
        };
  
        checkSocketOpen();
      });
  
      const success = await send({
        action: 'start-training',
        data: formData,
      });
  
      if (!success) {
        displayError('Model training failed.');
        return false;
      }
  
      // await new Promise((resolve) => setTimeout(resolve, 30000));
      return true;
  
    } catch (error) {
      console.error('Training operation failed:', error);
      displayError('Model training failed.');
      return false;
    }
  };

  const renderStatusBadge = (statusId: string | undefined) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      Using: { label: "Using", className: "bg-green-100 text-green-800" },
      Processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800" },
      Ready: { label: "Ready", className: "bg-blue-100 text-blue-800" },
    };

    const status = statusMap[statusId ?? ""] || { label: "", className: "bg-gray-100 text-gray-800" };

    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${status.className}`}>
        {status.label}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 ml-3">
        Detection Model:{' '}
        <span className="font-light">{formData.modelName}</span>{' '}
        <span className="font-bold">version</span>{' '}
        <span className="font-light">{formData.currentVersion}</span>{' '}
        {renderStatusBadge(formData.statusId)}
      </h2>
      <div className="p-3 mx-auto">
        <div className="flex items-center justify-between mt-1 mb-5 px-2">
          {stepOptions.map((label, index) => {
            const currentStep = Math.min((formData?.currentStep ?? 1) + 1, MAX_STEP);
            const stepIndex = index + 1;

            const isActive = step === stepIndex;
            const isCompleted = currentStep >= stepIndex;
            const isDisabled = stepIndex > currentStep;

            return (
              <div key={index} className="flex-1 relative flex flex-col items-center">
                <div
                  onClick={() => {
                    if (!isDisabled) handleNextStep(stepIndex);
                  }}
                  className={clsx(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                    {
                      "cursor-pointer": !isDisabled,
                      "cursor-not-allowed opacity-40": isDisabled,
                      "bg-green-500 border-green-500 text-white": isCompleted,
                      "bg-blue-500 border-blue-500 text-white": isActive,
                      "bg-white border-gray-300 text-gray-500": !isActive && !isCompleted,
                    }
                  )}
                >
                  {isCompleted ? <Check size={20} className="text-white" /> : stepIndex}
                </div>
                <span
                  className={clsx(
                    "mt-2 text-sm text-center",
                    isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                  )}
                >
                  {`${stepIndex} ${label}`}
                </span>
              </div>
            );
          })}
        </div>

        {step === 1 && <DetectionModelStep1 next={next} modelVersionId={modelVersionId} formData={formData} isEditMode={isEditMode} />}

        {step === 2 && <DetectionModelStep2 next={next} prev={prev} modelVersionId={modelVersionId} formData={formData} isEditMode={isEditMode} />}

        {step === 3 && <DetectionModelStep3 next={next} prev={prev} modelVersionId={modelVersionId} formData={formData} isEditMode={isEditMode} />}

        {step === 4 && <DetectionModelStep4 next={next} prev={prev} modelVersionId={modelVersionId} formData={formData} startTraining={handleStartTraining} isEditMode={isEditMode} />}

        {/* <div className="ml-64 text-xs">
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div> */}
      </div>
    </div>
  );
}
