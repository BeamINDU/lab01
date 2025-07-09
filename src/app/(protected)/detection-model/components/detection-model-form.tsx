import { useState, useEffect, useCallback, useMemo } from "react";
import { Check } from "lucide-react";
import clsx from "clsx";

import { usePermission } from "@/app/contexts/permission-context";
import { useTrainingSocketStore } from "@/app/stores/useTrainingSocketStore";
import { usePopupTraining } from "@/app/contexts/popup-training-context";

import { getModelVersion } from "@/app/libs/services/detection-model";
import DetectionModelStep1 from './detection-model-step1';
import DetectionModelStep2 from './detection-model-step2';
import DetectionModelStep3 from './detection-model-step3';
import DetectionModelStep4 from './detection-model-step4';

import type { FormData } from "@/app/types/detection-model";

const stepOptions = [
  "Select function and feature",
  "Configuration",
  "Annotation and Labeling",
  "Train and apply model"
];

const statusMap: Record<string, { label: string; className: string }> = {
  Using: { label: "Using", className: "bg-green-100 text-green-800" },
  Processing: { label: "Processing", className: "bg-yellow-100 text-yellow-800" },
  Ready: { label: "Ready", className: "bg-blue-100 text-blue-800" },
};

type DetectionModelStepsProps = {
  modelVersionId: number;
  isEditMode: boolean;
};

export default function DetectionModelSteps({ modelVersionId, isEditMode }: DetectionModelStepsProps) {
  const { hasPermission } = usePermission();
  const { connect, send } = useTrainingSocketStore();
  const { displaySuccess, displayError } = usePopupTraining();

  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(4);

  useEffect(() => {
    setFormData(prev => ({ ...prev, modelVersionId }));
  }, [modelVersionId]);

  useEffect(() => {
    const fetchModelVersion = async () => {
      try {
        const modelVersion = await getModelVersion(modelVersionId);
        const currentStep = Math.max(modelVersion?.currentStep ?? 0, 1);
        const allowedMaxStep = isEditMode ? 4 : currentStep;

        setMaxStep(allowedMaxStep);

        setStep(Math.min(currentStep, allowedMaxStep));

        setFormData(prev => ({
          ...prev,
          currentStep: currentStep,
          currentVersion: modelVersion?.currentVersion,
          modelVersionId,
          modelId: modelVersion?.modelId,
          modelName: modelVersion?.modelName,
          statusId: modelVersion?.statusId,
        }));
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };

    fetchModelVersion();
  }, [modelVersionId, isEditMode]);

  const next = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => Math.min(prev + 1, maxStep));
  }, [maxStep]);

  const prev = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextStep = useCallback((nextStep: number) => {
    setStep(nextStep);
  }, []);

  const handleStartTraining = useCallback(async (): Promise<boolean> => {
    try {
      await new Promise<void>((resolve) => {
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

      const success = await send({ action: 'start-training', data: formData });

      if (!success) {
        displayError('Model training failed.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Training operation failed:', error);
      displayError('Model training failed.');
      return false;
    }
  }, [formData, connect, send, displaySuccess, displayError]);

  const renderStatusBadge = (statusId?: string) => {
    const status = statusMap[statusId ?? ""] || { label: "", className: "bg-gray-100 text-gray-800" };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${status.className}`}>
        {status.label}
      </span>
    );
  };

  const renderStepIndicators = () => {
    const currentStep = Math.min((formData?.currentStep ?? 0), maxStep);

    return stepOptions.map((label, index) => {
      const stepIndex = index + 1;
      const isActive = step === stepIndex;
      const isCompleted = currentStep >= stepIndex;
      const isDisabled = stepIndex > currentStep;

      return (
        <div key={index} className="flex-1 relative flex flex-col items-center">
          <div
            onClick={() => !isDisabled && handleNextStep(stepIndex)}
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
          <span className={clsx("mt-2 text-sm text-center", isActive ? "text-blue-600 font-semibold" : "text-gray-500")}>
            {`${stepIndex} ${label}`}
          </span>
        </div>
      );
    });
  };

  const stepComponents = useMemo(() => [
    DetectionModelStep1,
    DetectionModelStep2,
    DetectionModelStep3,
    DetectionModelStep4
  ], []);

  const StepComponent = stepComponents[step - 1];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 ml-3">
        Detection Model:{" "}
        <span className="font-light">{formData.modelName}</span>{" "}
        <span className="font-bold">version</span>{" "}
        <span className="font-light">{formData.currentVersion}</span>{" "}
        {renderStatusBadge(formData.statusId)} 
        {/* <span className="font-light text-xs">current Step: {formData.currentStep}</span>{" "} */}
      </h2>

      <div className="p-3 mx-auto">
        <div className="flex items-center justify-between mt-1 mb-5 px-2">
          {renderStepIndicators()}
        </div>

        {StepComponent && (
          <StepComponent
            modelVersionId={modelVersionId}
            formData={formData}
            isEditMode={isEditMode}
            next={next}
            prev={prev}
            startTraining={step === 4 ? handleStartTraining : undefined}
          />
        )}
      </div>
    </div>
  );
}
