"use client";

import { useEffect,useState } from 'react';
import { useForm, SubmitHandler ,Controller} from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@/app/types/role";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';

const RoleSchema = z.object({
  id: z.number().optional(),
  roleName: z.string().min(1, "Role Name  is required"),
  description: z.string().optional(),
  status: z.boolean(),
  createdDate: z.union([
    z.coerce.date(),
    z.literal("").transform(() => undefined)
  ]).optional()
}); 

type RoleFormValues = z.infer<typeof RoleSchema>;

interface RoleModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: Role | null;
  onSave: (formData: Role) => void;
  canEdit: boolean;
}

export default function RoleFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: RoleModalProps) {
  const { data: session } = useSession();
 
  const defaultValues: RoleFormValues = {
    id: 0,
    roleName: '',
    description: '',
    status: true,
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(RoleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingData) {
      reset(editingData);
    } else {
      reset(defaultValues);
    }
  }, [editingData, reset]);


  if (!showModal) return null;

  const onSubmit: SubmitHandler<RoleFormValues> = async (formData) => {
    const formWithMeta: Role = {
      ...formData,
      createdBy: session?.user?.userid,
      createdDate: formData.createdDate,
      updatedBy: formData.id ? session?.user?.userid : null,
    };
    onSave(formWithMeta);
  };

  console.log(errors);
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
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
            ? editingData.id
              ? 'Add Role'
              : canEdit
                ? 'Edit Role'
                : 'Detail Role'
            : 'Add Role'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('createdDate')} />
          
          {/* <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Role ID:</label>
              <input 
                {...register("roleId")} 
                className="border p-2 w-full mb-1" 
              />
            </div>
            {errors.roleId && <p className="text-red-500 ml-160">{errors.roleId.message}</p>}
          </div> */}
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Role Name:</label>
              <input {...register("roleName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.roleName && <p className="text-red-500 ml-160">{errors.roleName.message}</p>}
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
            {errors.status && <p className="text-red-500 ml-110">{errors.status.message}</p>}
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