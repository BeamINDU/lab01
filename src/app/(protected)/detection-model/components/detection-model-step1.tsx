import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { showConfirm, showSuccess, showError, showWarning } from '@/app/utils/swal'
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { extractErrorMessage } from '@/app/utils/errorHandler';
import { useSession } from "next-auth/react";
import { updateStep1, getFunctions, getModelFunction } from "@/app/libs/services/detection-model";
import { SelectOption } from "@/app/types/select-option";
import { FormData } from "@/app/types/detection-model";

type Props = {
  modelVersionId: number;
  formData: FormData;
  isEditMode: boolean;
  next: (data: any) => void;
};

export const step1Schema = z.object({
  modelVersionId: z.number(),
  functions: z.array(z.number()).min(1, "Please select at least one function"),
});

type Step1Data = z.infer<typeof step1Schema>;

export default function DetectionModelStep1({ next, modelVersionId, formData, isEditMode }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [functions, setFunctions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<FormData>({} as FormData);

  const defaultValues: Step1Data = {
    modelVersionId: modelVersionId,
    functions: [],
  };

  const {
    register,
    setValue,
    getValues,
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const functionList = await getFunctions();
        setFunctions(functionList);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!formData?.modelId) return;

    const fetchModelFunctions = async () => {
      try {
        const modelFunctions: number[] = await getModelFunction(modelVersionId);
        setData(prev => ({ ...prev, functions: modelFunctions }));
        setSelected(modelFunctions);
        reset({
          modelVersionId,
          functions: modelFunctions,
        });
      } catch (error) {
        console.error("Failed to load model functions:", error);
      }
    };

    fetchModelFunctions();
  }, [formData?.modelId, modelVersionId, reset]);

  const toggleSelection = (value: number) => {
    const current = getValues("functions").map(Number);
    let updated: number[];

    if (current.includes(value)) {
      updated = current.filter((v) => v !== value); // unselect
    } else {
      updated = [...current, value]; // select
    }

    setSelected(updated);
    setValue("functions", updated);
    clearErrors("functions");
  };

  const onSubmitHandler = async (step1Data: Step1Data) => {
    try {
      const updatedFormData: FormData = {
        ...formData,
        currentStep: 1,
        functions: step1Data.functions,
        updatedBy: session?.user?.userid,
      };

      const arraysAreEqual = (arr1: number[], arr2: number[]) => {
        if (arr1.length !== arr2.length) return false;
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);
        for (const item of set1) {
          if (!set2.has(item)) return false;
        }
        return true;
      };

      const hasChanged = !arraysAreEqual(step1Data.functions, data.functions ?? []);

      if (isEditMode && hasChanged) {
        const res = await updateStep1(modelVersionId, updatedFormData);
        const isNewModelVersionId = modelVersionId !== res.modelVersionId;

        await showSuccess(`Saved successfully`);
        if (isNewModelVersionId) {
          const path = isEditMode
            ? `/detection-model/edit/${res.modelVersionId}`
            : `/detection-model/view/${res.modelVersionId}`;
          router.push(path);
        }
      } else if (isEditMode && !hasChanged) {
        // Optional: show a message
        // await showWarning("No changes detected.");
      }

      next(updatedFormData);
    } catch (error) {
      console.error("Save step1 failed:", error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };


  const handleBack = () => {
    router.push("/detection-model");
  };

  return (
    // <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="bg-gray-100">
        <div className="bg-white rounded-md shadow-md h-[63vh]">
          <div className="bg-[#cce0ff] px-6 py-3 rounded-t-md">
            <h2 className="text-xl font-bold text-black">Function</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-[80px] gap-y-12 p-12">
            <input type="hidden" {...register("modelVersionId")} />
            <input type="hidden" {...register("functions")} />

            {isLoading ? (
              <div className="col-span-full text-center text-gray-500">Loading functions...</div>
            ) : (
              functions?.map((func) => (
                <button
                  type="button"
                  key={func.value}
                  className={`h-20 w-full px-8 py-6 rounded-md text-sm font-medium text-center break-words shadow-sm disabled:cursor-not-allowed ${selected.includes(parseInt(func.value))
                      ? "bg-violet-600 text-white"
                      : "bg-gray-300 text-black"
                    }`}
                  onClick={() => toggleSelection(parseInt(func.value))}
                  disabled={!isEditMode}
                >
                  {func.label}
                </button>
              ))
            )}
          </div>

          {errors?.functions && (
            <p className="text-red-500 text-center pb-4">{errors.functions.message}</p>
          )}
        </div>

        <div
          className="fixed bottom-0 right-0 p-7 flex justify-between"
          style={{ zIndex: 1000, left: "250px" }}
        >
          <button
            className="ml-1 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-600 transition w-32"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="px-4 py-2 btn-primary-dark rounded gap-2 w-32 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || (!isEditMode && (formData.currentStep ?? 0) == 1)}
             onClick={handleSubmit(onSubmitHandler)}
          >
            Next
          </button>
        </div>
      </div>
    // </form>
  );
}
