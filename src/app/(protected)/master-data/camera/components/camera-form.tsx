"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "@/app/types/camera";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';
const CameraSchema = z.object({
  id: z.string().optional(),
  cameraId: z.string().min(1, "Camera Id is required"),
  cameraName: z.string().min(1, "Camera Name is required"),
  location: z.string().min(1, "Location is required"),
  status: z.boolean(),
  createdDate: z.union([
    z.coerce.date(),
    z.literal("").transform(() => undefined)
  ]).optional()
}); 

type CameraFormValues = z.infer<typeof CameraSchema>;

interface CameraModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: Camera | null;
  onSave: (formData: Camera) => void;
  canEdit: boolean;
}

export default function CameraFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit,
}: CameraModalProps) {
  const { data: session } = useSession();

  const defaultValues: CameraFormValues = {
    id: '',
    cameraId: '',
    cameraName: '',
    location: '',
    status: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CameraFormValues>({
    resolver: zodResolver(CameraSchema),
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

  const onSubmit: SubmitHandler<CameraFormValues> = async (formData) => {
    const formWithMeta: Camera = {
      ...formData,
      createdBy: session?.user?.userid,
      createdDate: formData.createdDate,
      updatedBy: formData.id ? session?.user?.userid : null,
    };
    onSave(formWithMeta);
  };

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
              ? 'Add Camera'
              : canEdit
                ? 'Edit Camera'
                : 'Detail Camera'
            : 'Add Camera'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('createdDate')} />
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Camera ID:</label>
              <input 
                {...register("cameraId")} 
                className="border p-2 w-full mb-1" 
              />
            </div>
            {errors.cameraId && <p className="text-red-500 ml-160">{errors.cameraId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Camera Name:</label>
              <input {...register("cameraName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.cameraName && <p className="text-red-500 ml-160">{errors.cameraName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Location:</label>
              <input 
                {...register("location")} 
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.location && <p className="text-red-500 ml-160">{errors.location.message}</p>}
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
            {errors.status && <p className="text-red-500 ml-160">{errors.status.message}</p>}
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