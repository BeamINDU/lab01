import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { FormData, DetectionModel } from "@/app/types/detection-model";
import { updateStep2, getModelVersion,  getCamera, getModelCamera } from "@/app/libs/services/detection-model";
import { useSession } from "next-auth/react";
import { getProductIdOptions } from "@/app/libs/services/product";
import { getCameraIdOptions } from "@/app/libs/services/camera";
import { SearchFieldModal } from '@/app/components/common/SearchField';
import SelectField from '@/app/components/common/SelectField';

type Props = {
  modelVersionId: number;
  formData: FormData;
  isEditMode: boolean;
  next: (data: any) => void;
  prev: () => void;
};

export const step2Schema = z.object({
  modelVersionId: z.number(),
  modelId: z.number(),
  modelName: z.string().min(1, "Model Name is required"),
  description: z.string(),
  trainDataset: z.number().gt(0, { message: "Train Dataset Percentage must be greater than 0" }),
  testDataset: z.number().gt(0, { message: "Test Dataset Percentage is required"}),
  validationDataset: z.number().gt(0, {message: "Validation Dataset Percentage is required"}),
  epochs: z.number().gt(0, {message: "Epochs is required"}),
  productId: z.string().min(1, "Product ID is required"),
  cameraId: z.string().min(1, "Camera ID is required"),
  // version: z.number().min(1, "Model Version is required"),
});

type Step3Data = z.infer<typeof step2Schema>;

export default function DetectionModelStep2Page({ next, prev, modelVersionId, formData, isEditMode }: Props) {
  const { data: session } = useSession();

  const defaultValues: Step3Data = {
    modelVersionId: modelVersionId,
    modelId: 0,
    modelName: '',
    description: '',
    trainDataset: 0,
    testDataset: 0,
    validationDataset: 0,
    epochs: 0,
    productId: '',
    cameraId: '',
    // version: 0
  };

  const {
    register, 
    getValues, 
    setValue, 
    reset,
    watch,
    handleSubmit, 
    clearErrors,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step2Schema),
    defaultValues
  });

  useEffect(() => {
    if (!formData?.modelId) return;

    const fetchModelVersion = async () => {
      try {
        const modelVersion = await getModelVersion(modelVersionId);
        if (modelVersion) {
          reset({
            modelVersionId: modelVersionId,
            modelId: modelVersion.modelId ?? 0,
            modelName: modelVersion.modelName ?? '',
            description: modelVersion.description ?? '',
            trainDataset: modelVersion.trainDataset ?? 0,
            testDataset: modelVersion.testDataset ?? 0,
            validationDataset: modelVersion.validationDataset ?? 0,
            epochs: modelVersion.epochs ?? 0,
            productId: modelVersion.productId,
            cameraId: modelVersion.cameraId ?? '',
            // version: modelVersion.currentVersion,
          });
        } else {
          reset(defaultValues);
        }
      } catch (error) {
        console.error("Failed to load model functions:", error);
      }
    };

    fetchModelVersion();
  }, [formData?.modelId, modelVersionId, reset]);

  const onSubmitHandler = async (data: Step3Data) => {
    try {
      const updatedFormData: FormData = {
        ...formData,
        currentStep: 2,
        modelId: data.modelId,
        modelName: data.modelName,
        description: data.description,
        trainDataset: data.trainDataset,
        testDataset: data.testDataset,
        validationDataset: data.validationDataset,
        epochs: data.epochs,
        productId: data.productId,
        cameraId: data.cameraId,
        updatedBy: session?.user?.userid,
      };

      if (isEditMode) {
        // console.log("Submit data2:", updatedFormData);
        await updateStep2(modelVersionId, updatedFormData);
        await showSuccess(`Saved successfully`)
      }

      next(updatedFormData);
    } catch (error) {
      console.error('Save step2 failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="w-full">
        <div className="p-12 bg-white">
          <div className="grid grid-cols-1 gap-4">
            <input type="hidden" {...register('modelVersionId')} />
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

            {/* Product ID */}
            <div className="flex items-center">
              <label className="w-64 font-medium">Product ID :</label>
              <div className="">
                <SearchFieldModal
                  className=""
                  register={register}
                  setValue={setValue}
                  fieldName="productId"
                  label=""
                  placeholder="Select product type..."
                  dataLoader={getProductIdOptions}
                  labelField="label"
                  valueField="value"
                  allowFreeText={true}
                  initialValue={watch('productId')}
                  onSelectionChange={(value, option) => {
                    console.log('Product ID selected:', value, option);
                    setValue("productId", value, { shouldValidate: true });
                  }}
                />
              </div>
            </div>
            {errors.productId && (<p className="text-red-500 ml-260">{errors.productId.message}</p>)}

            {/* Camera ID */}
            <div className="flex items-center">
              <label className="w-64 font-medium">Camera ID :</label>
              <div className="">
                <SearchFieldModal
                  className=""
                  register={register}
                  setValue={setValue}
                  fieldName="cameraId"
                  label=""
                  placeholder="Select camera..."
                  dataLoader={getCameraIdOptions}
                  labelField="label"
                  valueField="value"
                  allowFreeText={true}
                  initialValue={watch('cameraId')}
                  onSelectionChange={(value, option) => {
                    console.log('Camera ID selected:', value, option);
                    setValue("cameraId", value, { shouldValidate: true });
                  }}
                />
              </div>
            </div>
            {errors.cameraId && (<p className="text-red-500 ml-260">{errors.cameraId.message}</p>)}

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
            {errors.trainDataset && (<p className="text-red-500 ml-260">{errors.trainDataset.message}</p>)}

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
            {errors.testDataset && (<p className="text-red-500 ml-260">{errors.testDataset.message}</p>)}

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
            {errors.validationDataset && (<p className="text-red-500 ml-260">{errors.validationDataset.message}</p>)}

            {/* Epochs */}
            <div className="flex items-center">
              <label className="w-64 font-medium">Epochs :</label>
              <input
                type="number"
                className="w-32 rounded-md px-3 py-2 border border-gray-300 shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("epochs", { valueAsNumber: true })}
              />
            </div>
            {errors.epochs && (<p className="text-red-500 ml-260">{errors.epochs.message}</p>)}
            
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
                className="px-4 py-2 btn-primary-dark rounded gap-2 w-32 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={(!isEditMode && (formData.currentStep ?? 0) == 2)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
