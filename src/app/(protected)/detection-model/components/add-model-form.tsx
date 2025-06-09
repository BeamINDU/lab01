"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DetectionModel } from "@/app/types/detection-model"
import { ModelStatus } from "@/app/constants/status"
import { getProductIdOptions } from "@/app/libs/services/product";
import { SearchFieldModal } from '@/app/components/common/SearchField';


const AddModelFormSchema = z.object({
  modelId: z.number().nullable(),
  modelName: z.string().min(1, "Model Name is required"),
  productId: z.string().min(1, "Product ID is required"),
  description: z.string(),
  isCreateMode: z.boolean(), 
}); 

type AddModelFormValues = z.infer<typeof AddModelFormSchema>;

interface DetectionModelModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: DetectionModel | null;
  onSave: (formData: DetectionModel) => void;
  canEdit: boolean
}

export default function DetectionModelFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: DetectionModelModalProps) {
  const { data: session } = useSession();

  const defaultValues: AddModelFormValues = {
    modelId: null,
    modelName: '',
    productId: '',
    description: '',
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AddModelFormValues>({
    resolver: zodResolver(AddModelFormSchema),
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

  const onSubmit: SubmitHandler<AddModelFormValues> = async (formData) => {
    const formWithMeta: DetectionModel = {
      ...formData,
      // currentVersion: 0,
      statusId: ModelStatus.Processing,
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

        <h2 className="text-2xl font-semibold text-center mb-6">
          Add Model
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          {/* <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Model ID</label>
              <input {...register("modelId")} className="border p-2 w-full mb-1" />
            </div>
            {errors.modelId && <p className="text-red-500 ml-160">{errors.modelId.message}</p>}
          </div> */}
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Model Name:</label>
              <input {...register("modelName")} className="border p-2 w-full mb-1" />
            </div>
            {errors.modelName && <p className="text-red-500 ml-160">{errors.modelName.message}</p>}
          </div>
          <div className="mb-4">
            <SearchFieldModal
              key={`productType-${editingData?.productId || 'new'}`}
              register={register}
              setValue={setValue}
              fieldName="productId"
              label="Product ID"
              placeholder="Select product type..."
              //dataLoader={getProductTypeIdOptions}
              labelField="label"
              valueField="value"
              allowFreeText={false}
              disabled={!canEdit}
              initialValue={editingData?.productId || ''}
              onSelectionChange={(value, option) => {
                console.log('Product ID selected:', value, option);
                setValue("productId", value, { shouldValidate: true });
              }}
            />
            {errors.productId && <p className="text-red-500 ml-160">{errors.productId.message}</p>}
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
