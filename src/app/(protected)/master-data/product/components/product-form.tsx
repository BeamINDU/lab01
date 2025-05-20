"use client";

import { useEffect,useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/app/types/product"
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';

const ProductSchema = z.object({
  productId: z.string().min(1, "Production Id is required"),
  productName: z.string().min(1, "Product Name is required"),
  productType: z.string().min(1, "Product Type is required"),
  serialNo: z.string().min(1, "Serial No is required"),
  status: z.number().min(1, "Status No is required"),
  isCreateMode: z.boolean(), 
}); 

type ProductFormValues = z.infer<typeof ProductSchema>;

interface ProductModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: Product | null;
  onSave: (formData: Product) => void;
  canEdit: boolean
}

export default function ProductFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: ProductModalProps) {
  const { data: session } = useSession();
  const [isActive, setIsActive] = useState(true);
  const defaultValues: ProductFormValues = {
    productId: '',
    productName: '',
    productType: '',
    serialNo: '',
    status: 1,
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    // watch,
    // getValues,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
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

  const onSubmit: SubmitHandler<ProductFormValues> = async (formData) => {
    const formWithMeta: Product = {
      ...formData,
      productId: formData.productId ?? "",
      createdBy: session?.user?.userid,
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

        <h2 className="text-lg font-bold mb-4">{editingData ? 'Edit Product' : 'Add Product'}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Production ID</label>
              <input {...register("productId")} className="border p-2 w-full mb-1" />
            </div>
            {errors.productId && <p className="text-red-500 ml-110">{errors.productId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Product Name:</label>
              <input {...register("productName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.productName && <p className="text-red-500 ml-110">{errors.productName.message}</p>}
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Product Type:</label>
              <input {...register("productType")} className="border p-2 w-full mb-1" />
            </div>
            {errors.productType && <p className="text-red-500 ml-110">{errors.productType.message}</p>}
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Serial No:</label>
              <input {...register("serialNo")} className="border p-2 w-full mb-1" autoComplete="new-password" />
            </div>
            {errors.serialNo && <p className="text-red-500 ml-110">{errors.serialNo.message}</p>}
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Status</label>
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
