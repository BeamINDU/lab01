import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getFunctions } from "@/app/lib/services/detection-model";
import { SelectOption } from "@/app/types/select-option";
import { FormData, DetectionModel } from "@/app/types/detection-model";

type Props = {
  next: (data: any) => void;
  formData: FormData;
  modelId: number;
};

export const step1Schema = z.object({
  modelId: z.number(),
  functions: z.string().min(1, "functions is required"),
});

type Step1Data = z.infer<typeof step1Schema>;

export default function DetectionModelStep1({ next, modelId, formData }: Props) {
  console.log("formData:", formData);
  const [functions, setFunctions] = useState<SelectOption[]>([]);
  const [selected, setSelected] = useState("");

  const defaultValues: Step1Data = {
    modelId: modelId,
    functions: '',
  };

  const {
    register, 
    getValues,
    setValue, 
    reset,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues
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
      reset({
        modelId: modelId,
        functions: functions[0].value,
      });
      setSelected(functions[0].value);
    }
  }, [functions, reset]);
  
  return (
    <form onSubmit={handleSubmit(next)}>
      <div className="bg-gray-100">
        <div className="bg-white rounded-md shadow-md h-[63vh]">
          <div className="bg-[#cce0ff] px-6 py-3 rounded-t-md">
            <h2 className="text-xl font-bold text-black">Function</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-[80px] gap-y-12 p-12">
            <input type="hidden" {...register('modelId')} />
            <input type="hidden" {...register("functions")} />

            {functions.map((func) => (
              <button
                type="button"
                key={func.value}
                className={`h-20 w-full px-8 py-6 rounded-md text-sm font-medium text-center break-words shadow-sm ${
                  selected === func.value
                    ? "bg-violet-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
                onClick={() => {
                  setSelected(func.value);
                  setValue("functions", func.value);
                  clearErrors("functions");
                }}
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
