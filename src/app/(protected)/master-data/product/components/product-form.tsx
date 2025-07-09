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
import { getProductTypeIdOptions } from '@/app/libs/services/product-type';

const ProductSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product Name is required"),
  productTypeId: z.string().min(1, "Product Type is required"),
  serialNo: z.string().min(1, "Serial No is required"),
  barcode: z.string().min(1, "Barcode is required"),
  packSize: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      if (!isNaN(Number(val))) return Number(val);
      return val; // let zod catch invalid input like non-numeric strings
    },
    z.number({
      required_error: "Pack Size is required",
      invalid_type_error: "Pack Size must be a number",
    }).min(0, "Pack Size must be at least 1")
  ),
  status: z.boolean(),
  createdDate: z.union([
    z.coerce.date(),
    z.literal("").transform(() => undefined)
  ]).optional()
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
    id: '',
    productId: '',
    productName: '',
    productTypeId: '',
    serialNo: '',
    barcode: '',
    packSize: 0,
    status: true,
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

  useEffect(() => {
    if (editingData) {
      reset(editingData);
    } else {
      reset(defaultValues);
    }
  }, [editingData, reset]);


  const onSubmit: SubmitHandler<ProductFormValues> = async (formData) => {
    try {
      // console.log('Form submitted with data:', formData);

      const formWithMeta: Product = {
        ...formData,
        createdBy: session?.user?.userid,
        createdDate: formData.createdDate,
        updatedBy: formData.id ? session?.user?.userid : null,
      };

      await onSave(formWithMeta);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Error saving product: ' + (error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
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
            ? editingData.id
              ? 'Add Product'
              : canEdit
                ? 'Edit Product'
                : 'Detail Product'
            : 'Add Product'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('createdDate')} />

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Product ID:</label>
              <input
                {...register("productId")}
                className="border p-2 w-full mb-1"
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
              register={register}
              setValue={setValue}
              fieldName="productTypeId"
              label="Product Type ID"
              placeholder="Select product type..."
              dataLoader={getProductTypeIdOptions}
              labelField="label"
              valueField="value"
              allowFreeText={false}
              disabled={!canEdit}
              initialValue={editingData?.productTypeId || ''}
              onSelectionChange={(value, option) => {
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
                disabled={!canEdit}
              />
            </div>
            {errors.serialNo && <p className="text-red-500 ml-160">{errors.serialNo.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Barcode:</label>
              <input
                {...register("barcode")}
                className="border p-2 w-full mb-1"
                disabled={!canEdit}
              />
            </div>
            {errors.barcode && <p className="text-red-500 ml-160">{errors.barcode.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Pack Size:</label>
              <input
                {...register("packSize")}
                type="number"
                step="1"
                inputMode="numeric"
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === "," || e.key === "e") {
                    e.preventDefault();
                  }
                }}
                className="border p-2 w-full mb-1"
                disabled={!canEdit}
              />
            </div>
            {errors.packSize && <p className="text-red-500 ml-160">{errors.packSize.message}</p>}
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