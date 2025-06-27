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

  const onSubmitHandler = async (data: Step1Data) => {
    try {
      const updatedFormData: FormData = {
        ...formData,
        currentStep: 1,
        functions: data.functions,
        updatedBy: session?.user?.userid,
      };

      if (isEditMode) {
        // console.log("Submit data1:", updatedFormData);
        const res = await updateStep1(modelVersionId, updatedFormData);
        const isNewModelVersionId = modelVersionId != res.modelVersionId;

        await showSuccess(`Saved successfully`)
        if (isNewModelVersionId) {
          const path = isEditMode
            ? `/detection-model/edit/${res.modelVersionId}` 
            : `/detection-model/view/${res.modelVersionId}`;
          router.push(path);
        }
      }
      next(updatedFormData);
    } catch (error) {
      console.error('Save step1 failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
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
                  className={`h-20 w-full px-8 py-6 rounded-md text-sm font-medium text-center break-words shadow-sm ${selected.includes(parseInt(func.value))
                      ? "bg-violet-600 text-white"
                      : "bg-gray-300 text-black"
                    }`}
                  onClick={() => toggleSelection(parseInt(func.value))}
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
          className="fixed bottom-0 right-0 p-7 flex justify-end"
          style={{ zIndex: 1000, left: "250px" }}
        >
          <button
            type="submit"
            className="px-4 py-2 btn-primary-dark rounded gap-2 w-32 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || (!isEditMode && (formData.currentStep ?? 0) == 1)}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
}
