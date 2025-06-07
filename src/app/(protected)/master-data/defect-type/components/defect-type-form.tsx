"use client";

import { useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefectType } from "@/app/types/defect-type"
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';

const DefectTypeSchema = z.object({
  defectTypeId: z.string().min(1, "Defect Type Id is required"),
  defectTypeName: z.string().min(1, "Defect Type Name is required"),
  description: z.string(),
  status: z.boolean(),
  isCreateMode: z.boolean().optional(),
}); 

type DefectTypeFormValues = z.infer<typeof DefectTypeSchema>;

interface DefectTypeModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: DefectType | null;
  onSave: (formData: DefectType) => void;
  canEdit: boolean
}

export default function DefectTypeFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: DefectTypeModalProps) {
  const { data: session } = useSession();

  const defaultValues: DefectTypeFormValues = {
    defectTypeId: '',
    defectTypeName: '',
    description: '',
    status: true,
    isCreateMode: true,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DefectTypeFormValues>({
    resolver: zodResolver(DefectTypeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingData) {
      reset(editingData);
    } else {
      reset({...defaultValues, isCreateMode: true});
    }
  }, [editingData, reset]);

  if (!showModal) return null;

  const onSubmit: SubmitHandler<DefectTypeFormValues> = async (formData) => {
    const formWithMeta: DefectType = {
      ...formData,
      defectTypeId: formData.defectTypeId,
      createdBy: formData.isCreateMode ? session?.user?.userid : undefined,
      updatedBy: session?.user?.userid,
    };
    onSave(formWithMeta);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowModal(false)}
        >
          <X className="text-red-500" size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          {editingData
            ? editingData.isCreateMode
              ? 'Add Defect Type'
              : canEdit
                ? 'Edit Defect Type'
                : 'Detail Defect Type'
            : 'Add Defect Type'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Defect Type ID:</label>
              <input 
                {...register("defectTypeId")} 
                className="border p-2 w-full mb-1" 
              />
            </div>
            {errors.defectTypeId && <p className="text-red-500 ml-160">{errors.defectTypeId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Defect Type Name:</label>
              <input {...register("defectTypeName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.defectTypeName && <p className="text-red-500 ml-160">{errors.defectTypeName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Description:</label>
              <textarea 
                {...register("description")} 
                className="border p-2 w-full mb-1" 
                rows={3}
              />
            </div>
            {errors.description && <p className="text-red-500 ml-160">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Status:</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    enabled={field.value}
                    onChange={(enabled: boolean) => field.onChange(enabled)}
                    label={field.value ? "Active" : "Inactive"}
                    disabled={!canEdit}
                  />
                )}
              />
            </div>
            {errors.status && <p className="text-red-500 ml-160">{errors.status.message?.toString()}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {/* Save Button */}
            {canEdit && (
              <button
                type="submit"
                className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2"
              >
                Save
                <Save size={16} />
              </button>
            )}
            {/* Cancel Button */}
            <button
              type="button"
              className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
              onClick={() => setShowModal(false)}
            >
              Close
              <X size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}