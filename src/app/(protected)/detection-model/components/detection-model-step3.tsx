import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { detail } from "@/app/lib/services/detection-model";

type Props = {
  next: (data: any) => void;
  prev: () => void;
  formData: FormData;
  modelId: number;
};

export const step3Schema = z.object({
  modelId: z.number(),
  modelName: z.string().min(1, "Model Name is required"),
  description: z.string(),
  trainDataset: z.number(), //.min(1, "Train Dataset Percentage is required"),
  testDataset: z.number(), //.min(1, "Test Dataset Percentage is required"),
  validationDataset: z.number(), //.min(1, "Validation Dataset Percentage is required"),
  epochs: z.number(), //.min(1, "Epochs is required"),
});

type Step3Data = z.infer<typeof step3Schema>;

export default function DetectionModelStep3Page({ next, prev, modelId, formData }: Props) {
  console.log("formData:", formData);

  const defaultValues: Step3Data = {
    modelId: modelId,
    modelName: '',
    description: '',
    trainDataset: 0,
    testDataset: 0,
    validationDataset: 0,
    epochs: 0
  };

  const {
    register, 
    getValues, 
    setValue, 
    reset,
    handleSubmit, 
    clearErrors,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await detail(modelId);
        
        if (result) {
          reset({
            modelId: modelId,
            modelName: result.modelName ?? '',
            description: result.description ?? '',
            trainDataset: result.trainDataset ?? 0,
            testDataset: result.testDataset ?? 0,
            validationDataset: result.validationDataset ?? 0,
            epochs: result.epochs ?? 0,
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
  

  return (
    <form onSubmit={handleSubmit(next)}>
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4">
          <input type="hidden" {...register('modelId')} />
          {/* Model Name */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Model Name :</label>
            <input
              type="text"
              className="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("modelName")}
            />
          </div>
          {errors.modelName && (<p className="text-red-500 ml-260">{errors.modelName.message}</p>)}

          {/* Model Description */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Model Description :</label>
            <input
              type="text"
              className="flex-1 rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("description")}
            />
          </div>
          {errors.description && (<p className="text-red-500 ml-260">{errors.description.message}</p>)}

          {/* Train Percentage */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Train Dataset Percentage :</label>
            <input
              type="number"
              className="w-32 rounded-md px-3 py-2 border border-gray-300 shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("trainDataset", { valueAsNumber: true })}
            />
            <span className="ml-2">%</span>
          </div>
          {/* {errors.trainDataset && (<p className="text-red-500 ml-260">{errors.trainDataset.message}</p>)} */}

          {/* Test Percentage */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Test Dataset Percentage :</label>
            <input
              type="number"
              className="w-32 rounded-md px-3 py-2 border border-blue-500 shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("testDataset", { valueAsNumber: true })}
            />
            <span className="ml-2">%</span>
          </div>
          {/* {errors.testDataset && (<p className="text-red-500 ml-260">{errors.testDataset.message}</p>)} */}

          {/* Validation Percentage */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Validation Dataset Percentage :</label>
            <input
              type="number"
              className="w-32 rounded-md px-3 py-2 border border-gray-300 shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("validationDataset", { valueAsNumber: true })}
            />
            <span className="ml-2">%</span>
          </div>
          {/* {errors.validationDataset && (<p className="text-red-500 ml-260">{errors.validationDataset.message}</p>)} */}

          {/* Epochs */}
          <div className="flex items-center">
            <label className="w-64 font-medium">Epochs :</label>
            <input
              type="number"
              className="w-32 rounded-md px-3 py-2 border border-gray-300 shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("epochs", { valueAsNumber: true })}
            />
          </div>
          {/* {errors.epochs && (<p className="text-red-500 ml-260">{errors.epochs.message}</p>)} */}

          {/* Buttons */}
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
              type="submit"
              className="px-4 py-2 btn-primary-dark rounded gap-2 w-32"
            >
              Start Training
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
