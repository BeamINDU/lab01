"use client";

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "@/app/types/camera";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';
const CameraSchema = z.object({
  cameraId: z.string().min(1, "Camera Id is required"),
  cameraName: z.string().min(1, "Camera Name is required"),
  location: z.string().min(1, "location is required"),
  status: z.number(),
  isCreateMode: z.boolean().optional(),
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
  canEdit
}: CameraModalProps) {
  const { data: session } = useSession();
  const [isActive, setIsActive] = useState(true);
  const defaultValues: CameraFormValues = {
    cameraId: '',
    cameraName: '',
    location: '',
    status: 1, // 1 = Active, 0 = Inactive
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CameraFormValues>({
    resolver: zodResolver(CameraSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingData) {
      reset(editingData);
      setIsActive(editingData.status === 1);
    } else {
      reset({...defaultValues, isCreateMode: true});
      setIsActive(true);
    }
  }, [editingData, reset]);

  const handleStatusToggle = (enabled: boolean) => {
    setIsActive(enabled);
    setValue("status", enabled ? 1 : 0);
  };

  if (!showModal) return null;

  const onSubmit: SubmitHandler<CameraFormValues> = async (formData) => {
    const formWithMeta: Camera = {
      ...formData,
      cameraId: formData.cameraId,
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

        <h2 className="text-lg font-bold mb-4">{editingData && !editingData.isCreateMode ? 'Edit Camera' : 'Add Camera'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Camera ID:</label>
              <input 
                {...register("cameraId")} 
                className="border p-2 w-full mb-1" 
                readOnly={editingData && !editingData.isCreateMode ? true : undefined}
              />
            </div>
            {errors.cameraId && <p className="text-red-500 ml-110">{errors.cameraId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Camera Name:</label>
              <input {...register("cameraName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.cameraName && <p className="text-red-500 ml-110">{errors.cameraName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">location:</label>
              <input 
                {...register("location")} 
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.location && <p className="text-red-500 ml-110">{errors.location.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Status:</label>
              <ToggleSwitch 
                enabled={isActive}
                onChange={handleStatusToggle}
                label={isActive ? "Active" : "Inactive"}
                disabled={!canEdit}
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