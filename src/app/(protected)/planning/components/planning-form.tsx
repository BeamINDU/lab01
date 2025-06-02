// src/app/(protected)/planning/components/planning-form.tsx - ใช้ DateTimeFieldModal
"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Planning } from "@/app/types/planning";
import { useSession } from "next-auth/react";
import dayjs from 'dayjs';
import { getProductIdOptions, getLineIdOptions } from '@/app/libs/services/planning';
import { SearchFieldModal } from '@/app/components/common/SearchField';
import { DateTimeFieldModal } from '@/app/components/common/DateTimeField'; // ✅ ใช้ DateTimeFieldModal

const PlanningSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  lotNo: z.string().min(1, "Lot No is required"),
  lineId: z.string().min(1, "Line ID is required"),
  quantity: z.number(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  isCreateMode: z.boolean().optional(),
});

type PlanningFormValues = z.infer<typeof PlanningSchema>;

interface PlanningModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: Planning | null;
  onSave: (formData: Planning) => void;
  canEdit: boolean;
}

export default function PlanningFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: PlanningModalProps) {
  const { data: session } = useSession();
  const dateFormat = 'YYYY-MM-DD HH:mm';

  const defaultValues: PlanningFormValues = {
    planId: '',
    productId: '',
    lotNo: '',
    lineId: '',
    quantity: 0,
    startDate: '',
    endDate: '',
    isCreateMode: true,
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanningFormValues>({
    resolver: zodResolver(PlanningSchema),
    defaultValues,
  });

  // ✅ Watch values สำหรับ SearchField และ DateTimeField
  const productId = watch("productId");
  const lineId = watch("lineId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    if (editingData) {
      const startDateString = editingData.startDate instanceof Date 
        ? dayjs(editingData.startDate).format(dateFormat) 
        : typeof editingData.startDate === 'string'
          ? editingData.startDate
          : '';
          
      const endDateString = editingData.endDate instanceof Date 
        ? dayjs(editingData.endDate).format(dateFormat) 
        : typeof editingData.endDate === 'string'
          ? editingData.endDate
          : '';
      
      reset({
        ...editingData,
        startDate: startDateString,
        endDate: endDateString,
        isCreateMode: !editingData.productId
      });
    } else {
      reset(defaultValues);
    }
  }, [editingData, reset]);

  if (!showModal) return null;

  const onSubmit: SubmitHandler<PlanningFormValues> = async (formData) => {
    const formWithMeta: Planning = {
      ...formData,
      startDate: new Date(formData.startDate), 
      endDate: new Date(formData.endDate),     
      createdBy: formData.isCreateMode ? session?.user?.userid : undefined,
      updatedBy: session?.user?.userid,
    };
    onSave(formWithMeta);
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
          {editingData && !editingData.isCreateMode ? 'Edit Planning' : 'Add Planning'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className='text-sm'>
          <input type="hidden" {...register('isCreateMode')} />
          
          {/* Plan ID */}
          <div className="mb-4">
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <label className="font-normal w-32 pr-3">Plan ID:</label>
              <div className="w-full">
                <input 
                  {...register("planId")} 
                  className="border p-2 w-full bg-white"
                  readOnly={editingData && !editingData.isCreateMode ? true : undefined}
                />
                {errors.planId && <p className="text-red-500 text-xs mt-1">{errors.planId.message}</p>}
              </div>
            </div>
          </div>
          
          {/*  Product ID - ใช้ SearchFieldModal */}
          <div className="mb-4">
            <SearchFieldModal
              key={`productId-${editingData?.planId || 'new'}`}
              register={register}
              setValue={setValue}
              fieldName="productId"
              label="Product ID"
              placeholder="Select product ID..."
              dataLoader={getProductIdOptions}
              labelField="label"
              valueField="value"
              allowFreeText={true}
              disabled={!canEdit}
              initialValue={productId}
              onSelectionChange={(value, option) => {
                setValue("productId", value, { shouldValidate: true });
              }}
            />
            {errors.productId && (
              <div className="grid grid-cols-[160px_1fr] gap-4">
                <div></div>
                <p className="text-red-500 text-xs mt-1">{errors.productId.message}</p>
              </div>
            )}
          </div>
          
          {/* Lot No */}
          <div className="mb-4">
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <label className="font-normal w-32 pr-3">Lot No:</label>
              <div className="w-full">
                <input {...register("lotNo")} className="border p-2 w-full bg-white" />
                {errors.lotNo && <p className="text-red-500 text-xs mt-1">{errors.lotNo.message}</p>}
              </div>
            </div>
          </div>
          
          {/*  Line ID - ใช้ SearchFieldModal */}
          <div className="mb-4">
            <SearchFieldModal
              key={`lineId-${editingData?.planId || 'new'}`}
              register={register}
              setValue={setValue}
              fieldName="lineId"
              label="Line ID"
              placeholder="Select line ID..."
              dataLoader={getLineIdOptions}
              labelField="label"
              valueField="value"
              allowFreeText={true}
              disabled={!canEdit}
              initialValue={lineId}
              onSelectionChange={(value, option) => {
                setValue("lineId", value, { shouldValidate: true });
              }}
            />
            {errors.lineId && (
              <div className="grid grid-cols-[160px_1fr] gap-4">
                <div></div>
                <p className="text-red-500 text-xs mt-1">{errors.lineId.message}</p>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <div className="grid grid-cols-[160px_1fr] items-center gap-4">
              <label className="font-normal w-32 pr-3">Quantity:</label>
              <div className="w-full">
                <input 
                  {...register("quantity", { valueAsNumber: true })} 
                  className="border p-2 w-full bg-white" 
                  type="number"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
              </div>
            </div>
          </div>
          
          {/*  Start Date - ใช้ DateTimeFieldModal */}
          <div className="mb-4">
            <DateTimeFieldModal
              key={`startDate-${editingData?.planId || 'new'}`}
              control={control}
              fieldName="startDate"
              label="Start Date"
              placeholder="YYYY-MM-DD HH:mm"
              variant="datetime"
              format="YYYY-MM-DD HH:mm"
              ampm={false}
              timeSteps={{ minutes: 1 }}
              closeOnSelect={false}
              required={true}
              disabled={!canEdit}
              initialValue={startDate}
            />
          </div>
          
          {/*  End Date - ใช้ DateTimeFieldModal */}
          <div className="mb-4">
            <DateTimeFieldModal
              key={`endDate-${editingData?.planId || 'new'}`}
              control={control}
              fieldName="endDate"
              label="End Date"
              placeholder="YYYY-MM-DD HH:mm"
              variant="datetime"
              format="YYYY-MM-DD HH:mm"
              ampm={false}
              timeSteps={{ minutes: 1 }}
              closeOnSelect={false}
              required={true}
              disabled={!canEdit}
              initialValue={endDate}
            />
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