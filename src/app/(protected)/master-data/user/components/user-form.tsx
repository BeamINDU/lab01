"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/types/user";
import { useSession } from "next-auth/react";

const UserSchema = z.object({
  userId: z.string().min(1, "รหัสผู้ใช้จำเป็นต้องระบุ"),
  userName: z.string().min(1, "ชื่อผู้ใช้จำเป็นต้องระบุ"),
  fullName: z.string().min(1, "ชื่อ-นามสกุลจำเป็นต้องระบุ"),
  roleName: z.string().optional(),
  status: z.number(),
  isCreateMode: z.boolean().optional(),
}); 

type UserFormValues = z.infer<typeof UserSchema>;

interface UserModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: User | null;
  onSave: (formData: User) => void;
  canEdit: boolean;
}

export default function UserFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: UserModalProps) {
  const { data: session } = useSession();

  const defaultValues: UserFormValues = {
    userId: '',
    userName: '',
    fullName: '',
    roleName: '',
    status: 1, // 1 = Active, 0 = Inactive
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
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

  const onSubmit: SubmitHandler<UserFormValues> = async (formData) => {
    const formWithMeta: User = {
      ...formData,
      userId: formData.userId,
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

        <h2 className="text-lg font-bold mb-4">{editingData && !editingData.isCreateMode ? 'Edit User' : 'Add User'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <label className="font-normal w-32">User Id:</label>
              <input 
                {...register("userId")} 
                className="border p-2 w-full mb-1" 
                readOnly={editingData && !editingData.isCreateMode ? true : undefined}
              />
            </div>
            {errors.userId && <p className="text-red-500 ml-110">{errors.userId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <label className="font-normal w-32">User Name:</label>
              <input {...register("userName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.userName && <p className="text-red-500 ml-110">{errors.userName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <label className="font-normal w-32">Full Name:</label>
              <input 
                {...register("fullName")} 
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.fullName && <p className="text-red-500 ml-110">{errors.fullName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <label className="font-normal w-32">Role Name:</label>
              <input 
                {...register("roleName")} 
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.roleName && <p className="text-red-500 ml-110">{errors.roleName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <label className="font-normal w-32">Status:</label>
              <select 
                {...register("status", { 
                  setValueAs: (v) => parseInt(v, 10) 
                })} 
                className="border p-2 w-full mb-1"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
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
              ปิด
              <X size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}