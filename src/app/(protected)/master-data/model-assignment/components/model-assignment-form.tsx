"use client";

import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModelAssignment } from "@/app/types/model-assignment";
import { useSession } from "next-auth/react";
import ToggleSwitch from '@/app/components/common/ToggleSwitch';
import { SearchFieldModal } from '@/app/components/common/SearchField';
import { getCameraIdOptions } from "@/app/libs/services/camera";
import SelectField from '@/app/components/common/SelectField';
import { SelectOption } from "@/app/types/select-option";
import { getVersion } from "@/app/libs/services/detection-model";

const ModelAssignmentSchema = z.object({
  id: z.number().optional(),
  modelId: z.number().min(1, "Model Id is required"),
  modelName: z.string().min(1, "Model Name is required"),
  productId: z.string().min(1, "Product ID is required"),
  cameraId: z.string().min(1, "Camera ID is required"),
  versionNo: z.number().min(1, "Version No is required"),
  modelVersionId: z.number().min(1, "Version No is required"),
  status: z.boolean(),
}); 

type ModelAssignmentFormValues = z.infer<typeof ModelAssignmentSchema>;

interface ModelAssignmentModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: ModelAssignment | null;
  onSave: (formData: ModelAssignment) => void;
  canEdit: boolean;
}

export default function ModelAssignmentFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit,
}: ModelAssignmentModalProps) {
  const { data: session } = useSession();
  const [versionOptions, setVersionOptions] = useState<SelectOption[]>([]);
  // const [selectedVersion, setSelectedVersion] = useState<number>(0);

  const defaultValues: ModelAssignmentFormValues = {
    id: 0,
    modelId: 0,
    modelName: '',
    productId: '',
    cameraId: '',
    modelVersionId: 0,
    versionNo: 0,
    status: true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ModelAssignmentFormValues>({
    resolver: zodResolver(ModelAssignmentSchema),
    defaultValues,
  });

 useEffect(() => {
    // Reset form
    if (editingData) {
      reset(editingData);
    } else {
      reset(defaultValues);
    }

    // Fetch version if modelId is valid
    if (typeof editingData?.modelId === 'number') {
      const fetchVersion = async () => {
        try {
          const result = await getVersion(editingData.modelId!); 
          setVersionOptions(result);
        } catch (error) {
          console.error("Failed to load version data:", error);
        }
      };

      fetchVersion();
    }
  }, [editingData, reset]);

  const onSubmit: SubmitHandler<ModelAssignmentFormValues> = async (formData) => {
    const formWithMeta: ModelAssignment = {
      ...formData,
      appliedBy: session?.user?.userid,
    };
    onSave(formWithMeta);
  };

  // {console.log("errors", errors)}

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
              ? 'Add Model Assignment'
              : canEdit
                ? 'Edit Model Assignment'
                : 'Detail Model Assignment'
            : 'Add Model Assignment'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('modelId')} />

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Model Name:</label>
              <input {...register("modelName")} className="border p-2 w-full mb-1" disabled />
            </div>
            {errors.modelName && <p className="text-red-500 ml-160">{errors.modelName.message}</p>}
          </div>
          
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Product ID:</label>
              <input 
                {...register("productId")} 
                className="border p-2 w-full mb-1" 
                disabled
              />
            </div>
            {errors.productId && <p className="text-red-500 ml-160">{errors.productId.message}</p>}
          </div>
          
          <div className="mb-4">
            <SearchFieldModal
              register={register}
              setValue={setValue}
              fieldName="cameraId"
              label="Camera ID"
              placeholder="Select camera ID..."
              dataLoader={getCameraIdOptions}
              labelField="label"
              valueField="value"
              allowFreeText={false}
              disabled={!canEdit}
              initialValue={editingData?.cameraId}
              onSelectionChange={(value, option) => {
                setValue("cameraId", value, { shouldValidate: true });
              }}
            />
            {errors.cameraId && <p className="text-red-500 ml-160">{errors.cameraId.message}</p>}
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Version No:</label>
              <Controller
                name="modelVersionId"
                control={control}
                render={({ field }) => (
                  <SelectField
                    value={field.value ? String(field.value) : ""}
                    onChange={(selectedValue) => {
                      const selected = versionOptions.find(opt => opt.value === selectedValue);
                      if (!selected) return;

                      setValue("versionNo", parseInt(selected.label), { shouldValidate: true });
                      field.onChange(parseInt(selected.value));

                      clearErrors("versionNo");
                      clearErrors("modelVersionId");
                    }}
                    options={versionOptions}
                    showEmptyOption={false}
                  />
                )}
              />
            </div>
            {errors.versionNo && <p className="text-red-500 ml-160">{errors.versionNo.message}</p>}
            {errors.modelVersionId && <p className="text-red-500 ml-160">{errors.modelVersionId.message}</p>}
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