import { useState, useEffect } from "react";
import { showConfirm, showSuccess, showError, showWarning } from '@/app/utils/swal'
import { Check, CheckCircle, Circle, Loader2 } from "lucide-react";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/constants/menu';
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { detail } from "@/app/libs/services/detection-model";
import clsx from "clsx";
import DetectionModelStep1 from '../components/detection-model-step1';
import DetectionModelStep2 from '../components/detection-model-step2';
import DetectionModelStep3 from '../components/detection-model-step3';
import DetectionModelStep4 from '../components/detection-model-step4';
// import { useWebSocket } from '@/app/contexts/websocket-context';
import { useTrainingSocketStore } from '@/app/stores/useTrainingSocketStore'; 
import { usePopupTraining } from '@/app/contexts/popup-training-context';

const stepOptions = [
  "Select function and feature",
  "Annotation and Labeling",
  "Configuration",
  "Train and apply model"
];

export default function DetectionModelSteps({ modelId }: { modelId: number }) {
  const { hasPermission } = usePermission();
  // const { send } = useWebSocket();
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
    setFormData((prev) => ({ ...prev, modelId: modelId }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await detail(modelId);
        setFormData(prev => ({
          ...prev,
          modelId,
          statusId: result?.statusId,
          currentStep: result?.currentStep ?? 1,
          currentVersion: result?.currentVersion ?? 1,
          functions: result?.functions
        }));
        setStep(result?.currentStep ?? 1);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    fetchData();
  }, [modelId]);

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

  return (
    <div>
      <div className="flex items-center justify-between mt-1 mb-5 px-2">
        {stepOptions.map((label, index) => {
          const currentStep = formData.currentStep ?? 1;
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

      {step === 1 && <DetectionModelStep1 next={next} modelId={modelId} formData={formData} />}

      {step === 2 && <DetectionModelStep2 next={next} prev={prev} modelId={modelId} formData={formData} />}

      {step === 3 && <DetectionModelStep3 next={next} prev={prev} modelId={modelId} formData={formData} />}

      {step === 4 && <DetectionModelStep4 next={next} prev={prev} modelId={modelId} formData={formData} startTraining={handleStartTraining} />}

      {/* <div className="ml-64 text-xs">
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div> */}

    </div>
  );
}
