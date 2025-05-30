import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { detail, updateStep1 } from "@/app/libs/services/detection-model";
import { getFunctions } from "@/app/libs/services/detection-model";
import { SelectOption } from "@/app/types/select-option";
import { FormData } from "@/app/types/detection-model";
// import { useWebSocket } from '@/app/contexts/websocket-context';

type Props = {
  next: (data: any) => void;
  formData: FormData;
  modelId: number;
};

export const step1Schema = z.object({
  modelId: z.number(),
  functions: z.array(z.number()).min(1, "Please select at least one function"),
});

type Step1Data = z.infer<typeof step1Schema>;

export default function DetectionModelStep1({ next, modelId, formData }: Props) {
  const [functions, setFunctions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  const defaultValues: Step1Data = {
    modelId: modelId,
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
    const fetchFunctions = async () => {
      try {
        const result = await getFunctions();
        setFunctions(result);
      } catch (error) {
        console.error("Failed to load functions:", error);
      }
    };
    fetchFunctions();
  }, []);

  useEffect(() => {
    if (functions.length > 0) {
      const initial = formData.functions?.length ? formData.functions : [];
      setSelected(initial);
      reset({
        modelId: modelId,
        functions: initial,
      });
    }
  }, [functions, reset]);


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
    console.log("Submit data1:", data);
    await updateStep1(data);

    const updatedFormData: FormData = {
      ...formData,
      currentStep: 1,
      functions: data.functions,
    };
    next(updatedFormData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="bg-gray-100">
        <div className="bg-white rounded-md shadow-md h-[63vh]">
          <div className="bg-[#cce0ff] px-6 py-3 rounded-t-md">
            <h2 className="text-xl font-bold text-black">Function</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-[80px] gap-y-12 p-12">
            <input type="hidden" {...register("modelId")} />
            
            <input type="hidden" {...register("functions")} />

            {functions.map((func) => (
              <button
                type="button"
                key={func.value}
                className={`h-20 w-full px-8 py-6 rounded-md text-sm font-medium text-center break-words shadow-sm ${
                  selected.includes(parseInt(func.value))
                    ? "bg-violet-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => toggleSelection(parseInt(func.value))}
              >
                {func.label}
              </button>
            ))}
          </div>
          {errors.functions && (
            <p className="text-red-500 text-center pb-4">{errors.functions.message}</p>
          )}
        </div>

        <div
          className="fixed bottom-0 right-0 p-7 flex justify-end"
          style={{ zIndex: 1000, left: "250px" }}
        >
          <button
            type="submit"
            className="px-4 py-2 btn-primary-dark rounded gap-2 w-32"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
}
