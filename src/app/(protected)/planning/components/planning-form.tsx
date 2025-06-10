"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Planning } from "@/app/types/planning";
import { useSession } from "next-auth/react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { getLineNoOptions, getLotNoOptions, getPlanIdOptions } from '@/app/libs/services/planning';
import { getProductIdOptions } from '@/app/libs/services/product';
import { SearchFieldModal } from '@/app/components/common/SearchField';

const PlanningSchema = z.object({
  id: z.string().optional(),
  planId: z.string().min(1, "Plan ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  lotNo: z.string().min(1, "Lot No is required"),
  lineId: z.string().min(1, "Line ID is required"),
  quantity: z.number(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
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
  
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',
  };

  const defaultValues: PlanningFormValues = {
    id: '',
    planId: '',
    productId: '',
    lotNo: '',
    lineId: '',
    quantity: 0,
    startDate: '',
    endDate: '',
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

  const productId = watch("productId");

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
          {editingData && !editingData.id ? 'Edit Planning' : 'Add Planning'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          
          {/* Plan ID */}
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Plan ID:</label>
              <input 
                {...register("planId")} 
                className="border p-2 w-full mb-1 bg-white"
                readOnly={editingData && !editingData.id ? true : undefined}
              />
            </div>
            {errors.planId && <p className="text-red-500 ml-160">{errors.planId.message}</p>}
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
                console.log('Product ID selected:', value, option);
                setValue("productId", value, { shouldValidate: true });
              }}
            />
            {errors.productId && <p className="text-red-500 ml-160">{errors.productId.message}</p>}
          </div>
          
          {/* Lot No */}
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Lot No:</label>
              <input {...register("lotNo")} className="border p-2 w-full mb-1 bg-white" />
            </div>
            {errors.lotNo && <p className="text-red-500 ml-160">{errors.lotNo.message}</p>}
          </div>
          
          {/*  Line ID - ใช้ SearchFieldModal */}
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Line ID:</label>
              <input {...register("lineId")} className="border p-2 w-full mb-1 bg-white" />
            </div>
            {errors.lineId && <p className="text-red-500 ml-160">{errors.lineId.message}</p>}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Quantity:</label>
              <input 
                {...register("quantity", { valueAsNumber: true })} 
                className="border p-2 w-full mb-1 bg-white" 
                type="number"
              />
            </div>
            {errors.quantity && <p className="text-red-500 ml-160">{errors.quantity.message}</p>}
          </div>
          
          {/* Date Time Pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Start Date */}
            <div className="mb-4">
              <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <label className="font-normal w-32">Start Date:</label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.format(dateFormat) : '')}
                      format={dateFormat}
                      ampm={false}
                      timeSteps={{ minutes: 1 }}
                      closeOnSelect={false} 
                      slotProps={{ 
                        textField: { 
                          size: "small",
                          fullWidth: true,
                          className: "border p-2 w-full rounded",
                          placeholder: "YYYY-MM-DD HH:mm",
                          sx: inputStyle,
                          error: !!errors.startDate
                        } 
                      }}
                    />
                  )}
                />
              </div>
              {errors.startDate && <p className="text-red-500 ml-160">{errors.startDate.message}</p>}
            </div>
            
            {/* End Date */}
            <div className="mb-4">
              <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <label className="font-normal w-32">End Date:</label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date ? date.format(dateFormat) : '')}
                      format={dateFormat}
                      ampm={false}
                      timeSteps={{ minutes: 1 }}
                      closeOnSelect={false} 
                      slotProps={{ 
                        textField: { 
                          size: "small",
                          fullWidth: true,
                          className: "border p-2 w-full rounded",
                          placeholder: "YYYY-MM-DD HH:mm",
                          sx: inputStyle,
                          error: !!errors.endDate
                        } 
                      }}
                    />
                  )}
                />
              </div>
              {errors.endDate && <p className="text-red-500 ml-160">{errors.endDate.message}</p>}
            </div>
          </LocalizationProvider>

          {/* Action Buttons */}
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