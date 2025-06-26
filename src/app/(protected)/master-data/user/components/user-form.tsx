"use client";

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/types/user";
import { useSession } from "next-auth/react";
import { SelectOption } from "@/app/types/select-option";
import { getRoleOptions } from '@/app/libs/services/role';
import ToggleSwitch from '@/app/components/common/ToggleSwitch';
import GoogleStyleSearch from '@/app/components/common/Search';

const UserSchema = z.object({
  id: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  username: z.string().min(1, "User name is required"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required"),
  status: z.boolean(),
  createdDate: z.union([
    z.coerce.date(),
    z.literal("").transform(() => undefined)
  ]).optional(),
  roles: z.array(z.number()).min(1, "At least one role must be selected"),
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
  const [roleOptions, setRoleOptions] = useState<SelectOption[]>([]);
  const [selectedRole, setSelectedRole] = useState<number[]>([]);

  const defaultValues: UserFormValues = {
    id: '',
    userId: '',
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    status: true,
    roles: [],
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roleOptions = await getRoleOptions();
        setRoleOptions(roleOptions);
      } catch (error) {
        console.error('Failed to load roles:', error);
        setRoleOptions([]);
      }
    };

    loadRoles();
  }, []);


  useEffect(() => {
    if (editingData) {
      reset(editingData);
    } else {
      reset(defaultValues);
    }
  }, [editingData, reset]);


  const onSubmit: SubmitHandler<UserFormValues> = async (formData) => {
    const formWithMeta: User = {
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
              ? 'Add User'
              : canEdit
                ? 'Edit User'
                : 'Detail User'
            : 'Add User'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('createdDate')} />

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">User ID:</label>
              <input
                {...register("userId")}
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.userId && <p className="text-red-500 ml-160">{errors.userId.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Username:</label>
              <input {...register("username")} className="border p-2 w-full mb-1" />
            </div>
            {errors.username && <p className="text-red-500 ml-160">{errors.username.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">First Name:</label>
              <input
                {...register("firstname")}
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.firstname && <p className="text-red-500 ml-160">{errors.firstname.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Last Name:</label>
              <input
                {...register("lastname")}
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.lastname && <p className="text-red-500 ml-160">{errors.lastname.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Email:</label>
              <input
                {...register("email")}
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.email && <p className="text-red-500 ml-160">{errors.email.message}</p>}
          </div>

          {/* Role */}
          <div className="mb-6">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Role Name:</label>
              <div className="space-y-2">
                {roleOptions.map((role) => (
                  <div key={role.value} className="checkbox">
                    <input
                      type="checkbox"
                      value={role.value.toString()}
                      checked={(watch('roles', []) || []).includes(parseInt(role.value))}
                      onChange={(e) => {
                        const selectedValues = watch('roles') || [];
                        const value = parseInt(e.target.value, 10);
                        const updatedRoleIds = e.target.checked
                          ? [...selectedValues, value]
                          : selectedValues.filter(id => id !== value);
                        setValue('roles', updatedRoleIds, { shouldValidate: true });
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm">{role.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {errors.roles && <p className="text-red-500 ml-160">{errors.roles.message}</p>}
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