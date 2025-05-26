"use client";

import { useEffect , useState} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/app/types/user";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';
const UserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  userName: z.string().min(1, "User name is required"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required"),
  roleName: z.string().min(1, "Role name is required"),
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
  const [isActive, setIsActive] = useState(true);
  const defaultValues: UserFormValues = {
    userId: '',
    userName: '',
    firstname: '',
    lastname: '',
    email: '',
    roleName: '',
    status: 1,
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
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

        <h2 className="text-2xl font-semibold text-center mb-6">
          {editingData
            ? editingData.isCreateMode
              ? 'Add User'
              : canEdit
                ? 'Edit User'
                : 'Detail User'
            : 'Add User'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">User ID:</label>
              <input 
                {...register("userId")} 
                className="border p-2 w-full mb-1" 
                readOnly={editingData && !editingData.isCreateMode ? true : undefined}
              />
            </div>
            {errors.userId && <p className="text-red-500 ml-160">{errors.userId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">User Name:</label>
              <input {...register("userName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.userName && <p className="text-red-500 ml-160">{errors.userName.message}</p>}
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

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Role Name:</label>
              <input 
                {...register("roleName")} 
                className="border p-2 w-full mb-1"
              />
            </div>
            {errors.roleName && <p className="text-red-500 ml-160">{errors.roleName.message}</p>}
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