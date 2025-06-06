// src/app/(protected)/master-data/product/components/product-form.tsx - แก้ไข layout
"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@/app/types/product";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';
import { SearchFieldModal } from '@/app/components/common/SearchField'; 
import { getProductTypeNameOptions } from '@/app/libs/services/product-type'; 

const ProductSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product Name is required"),
  productTypeId: z.string().min(1, "Product Type is required"),
  // productTypeName: z.string().min(1, "Product Type is required"),
  serialNo: z.string().min(1, "Serial No is required"),
  status: z.number().min(0).max(1, "Status must be 0 or 1"), 
  isCreateMode: z.boolean().optional(),
}); 

type ProductFormValues = z.infer<typeof ProductSchema>;

interface ProductModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: Product | null;
  onSave: (formData: Product) => void;
  canEdit: boolean;
}

export default function ProductFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: ProductModalProps) {
  const { data: session } = useSession();

  const defaultValues: ProductFormValues = {
    productId: '',
    productName: '',
    productTypeId: '',
    // productTypeName: '',
    serialNo: '',
    status: 1,
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });

  const productTypeId = watch("productTypeId");
  // const productTypeName = watch("productTypeName");

  useEffect(() => {
    if (editingData) {
      console.log('Form received editingData:', editingData); 
      reset(editingData);
    } else {
      console.log('Form reset to default values'); 
      reset({...defaultValues, isCreateMode: true});
    }
  }, [editingData, reset]);

  if (!showModal) return null;

  const onSubmit: SubmitHandler<ProductFormValues> = async (formData) => {
    try {
      console.log('Form submitted with data:', formData);
      
      const formWithMeta: Product = {
        ...formData,
        productId: formData.productId,
        createdBy: formData.isCreateMode ? session?.user?.userid : undefined,
        updatedBy: session?.user?.userid,
      };
      
      await onSave(formWithMeta);
      
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving product: ' + (error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
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
              ? 'Add Product'
              : canEdit
                ? 'Edit Product'
                : 'Detail Product'
            : 'Add Product'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Product ID:</label>
              <input 
                {...register("productId")} 
                className="border p-2 w-full mb-1"
                readOnly={editingData && !editingData.isCreateMode ? true : undefined}
              />
            </div>
            {errors.productId && <p className="text-red-500 ml-160">{errors.productId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Product Name:</label>
              <input {...register("productName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.productName && <p className="text-red-500 ml-160">{errors.productName.message}</p>}
          </div>

          <div className="mb-4">
            <SearchFieldModal
              key={`productType-${editingData?.productId || 'new'}`}
              register={register}
              setValue={setValue}
              fieldName="productTypeName"
              label="Product Type"
              placeholder="Select product type..."
              // dataLoader={getProductTypeNameOptions}
              labelField="label"
              valueField="value"
              allowFreeText={true}
              disabled={!canEdit}
              initialValue={productTypeId}
              onSelectionChange={(value, option) => {
                console.log('Product Type selected:', value, option);
                setValue("productTypeId", value, { shouldValidate: true });
              }}
            />
            {errors.productTypeId && <p className="text-red-500 ml-160">{errors.productTypeId.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Serial No:</label>
              <input 
                {...register("serialNo")} 
                className="border p-2 w-full mb-1" 
                autoComplete="new-password" 
              />
            </div>
            {errors.serialNo && <p className="text-red-500 ml-160">{errors.serialNo.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Status:</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    enabled={field.value === 1}
                    onChange={(enabled: boolean) => field.onChange(enabled ? 1 : 0)}
                    label={field.value === 1 ? "Active" : "Inactive"}
                    disabled={!canEdit}
                  />
                )}
              />
            </div>
            {errors.status && <p className="text-red-500 ml-160">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {canEdit && (
              <button
                type="submit"
                className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2"
              >
                Save
                <Save size={16} />
              </button>
            )}
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