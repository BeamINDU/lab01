import { useState, useEffect } from "react";
import { showConfirm, showSuccess, showError, showWarning } from '@/app/utils/swal'
import { Check, CheckCircle, Circle, Loader2 } from "lucide-react";
import { usePermission } from '@/app/contexts/permission-context';
import { Menu, Action } from '@/app/lib/constants/menu';
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { detail } from "@/app/lib/services/detection-model";
import clsx from "clsx";
import DetectionModelStep1 from '../components/detection-model-step1';
import DetectionModelStep2 from '../components/detection-model-step2';
import DetectionModelStep3 from '../components/detection-model-step3';
import DetectionModelStep4 from '../components/detection-model-step4';

export default function DetectionModelSteps({ modelId }: { modelId: string }) {
  const MAX_STEP = 4;
  const { hasPermission } = usePermission();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({} as FormData);

  const next = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prevStep) => Math.min(prevStep + 1, MAX_STEP));
  };

  const prev = () => setStep((s) => s - 1);

  const stepStatus = (index: number) => {
    if (step > index + 1) return "complete";
    if (step === index + 1) return "active";
    return "upcoming";
  };

  const stepOptions = [
    "Select function and feature",
    "Annotation and Labeling",
    "Configuration",
    "Train and apply model"
  ];

  useEffect(() => {
    setFormData((prev) => ({ ...prev, modelId: modelId }));
  }, []);

  const handleNextStep = (nextStep: number) => {
    // alert(nextStep);
    // if(nextStep > 4) {
    //   return;
    // }
    setStep(nextStep);
  };

  return (
    <div>
      {/* <div className="flex justify-between py-4 mb-4">
        {stepOptions.map((label, index) => {
          const status = stepStatus(index);
          return (
            <div
              key={index}
              onClick={() => handleNextStep(index + 1)}
              className={clsx(
                "flex flex-col items-center w-1/4 px-4 py-3 rounded-lg border transition duration-200 cursor-pointer",
                status === "complete" && "bg-green-100 border-green-400 text-green-700",
                status === "active" && "bg-blue-500 border-blue-600 text-white",
                status === "upcoming" && "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
              )}
            >
              <div className="mb-2">
                {status === "complete" || formData?.isComplete ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : status === "active" ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="text-sm font-medium text-center">
                Step {index + 1}: {label}
              </div>
            </div>
          );
        })}
      </div> */}


      <div className="flex items-center justify-between mt-2 mb-8 px-2">
        {stepOptions.map((label, index) => {
          const isActive = step === index + 1;
          const isCompleted = step > index + 1; // || formData?.isComplete;

          return (
            <div key={index} className="flex-1 relative flex flex-col items-center">
              <div
                onClick={() => handleNextStep(index + 1)}
                className={clsx(
                  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors",
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                )}
              >
                {isCompleted ? <Check size={20} className="text-white" /> : index + 1}
              </div>
              <span
                className={clsx(
                  "mt-2 text-sm text-center",
                  isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>


      {step === 1 && <DetectionModelStep1 next={next} modelId={modelId} formData={formData} />}

      {step === 2 && <DetectionModelStep2 next={next} prev={prev} modelId={modelId} formData={formData} />}

      {step === 3 && <DetectionModelStep3 next={next} prev={prev} modelId={modelId} formData={formData} />}

      {step === 4 && <DetectionModelStep4 next={next} prev={prev} modelId={modelId} formData={formData} />}

      {/* <div className="ml-64 text-xs">
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div> */}

    </div>
  );
}
