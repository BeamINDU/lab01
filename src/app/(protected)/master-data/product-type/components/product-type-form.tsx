"use client";

import { useEffect, } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType } from "@/app/types/product-type";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';

const ProductTypeSchema = z.object({
  id: z.string().optional(),
  productTypeId: z.string().min(1, "Production Type Id is required"),
  productTypeName: z.string().min(1, "Product Type Name is required"),
  description: z.string(),
  status: z.boolean(),
  createdDate: z.union([
    z.coerce.date(),
    z.literal("").transform(() => undefined)
  ]).optional()
}); 

type ProductTypeFormValues = z.infer<typeof ProductTypeSchema>;

interface ProductTypeModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: ProductType | null;
  onSave: (formData: ProductType) => void;
  canEdit: boolean;
}

export default function ProductTypeFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: ProductTypeModalProps) {
  const { data: session } = useSession();

  const defaultValues: ProductTypeFormValues = {
    id: '',
    productTypeId: '',
    productTypeName: '',
    description: '',
    status: true, 
  };

  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductTypeFormValues>({
    resolver: zodResolver(ProductTypeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingData) {
      reset(editingData);
    } else {
      reset(defaultValues);
    }
  }, [editingData, reset]);

  const onSubmit: SubmitHandler<ProductTypeFormValues> = async (formData) => {
    const formWithMeta: ProductType = {
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
              ? 'Add Product Type'
              : canEdit
                ? 'Edit Product Type'
                : 'Detail Product Type'
            : 'Add Product Type'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('createdDate')} />
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">  
              <label className="font-normal w-32">Product Type ID:</label>
              <input 
                {...register("productTypeId")} 
                className="border p-2 w-full mb-1" 
              />
            </div>
            {errors.productTypeId && <p className="text-red-500 ml-160">{errors.productTypeId.message?.toString()}</p>}
          </div>
          
          <div className="mb-4">
          <div className="grid grid-cols-[150px_1fr] items-center gap-2">
            <label className="font-normal">Product Type Name:</label>
            <input {...register("productTypeName")} className="border p-2 w-full mb-1" />
          </div>
            {errors.productTypeName && <p className="text-red-500 ml-160">{errors.productTypeName.message?.toString()}</p>}
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
            {errors.description && <p className="text-red-500 ml-160">{errors.description.message?.toString()}</p>}
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Status:</label>
              {/* <ToggleSwitch 
                enabled={watchedStatus === 1}
                onChange={(enabled: boolean) => {
                  setValue("status", enabled ? 1 : 0);
                }}
                label={watchedStatus === 1 ? "Active" : "Inactive"}
                disabled={!canEdit}
              /> */}
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
            {errors.status && <p className="text-red-500 ml-110">{errors.status.message?.toString()}</p>}
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