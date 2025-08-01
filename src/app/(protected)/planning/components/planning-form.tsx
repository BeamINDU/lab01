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
import { getProductOptions } from '@/app/libs/services/product';
import { SearchFieldModal } from '@/app/components/common/SearchField';

const PlanningSchema = z.object({
  id: z.string().optional(),
  planid: z.string().min(1, "Plan ID is required"),
  startdatetime: z.string().min(1, "Plan Startdate is required"),
  enddatetime: z.string().min(1, "Plan Enddate is required"),
  prodid: z.string().min(1, "Product ID is required"),
  prodname: z.string().min(1, "Product ID is required"),
  prodlot: z.string().min(1, "Lot No is required"),
  prodline: z.string().min(1, "Line ID is required"),
  quantity: z.number(),
  seq_no: z.coerce.number().optional(),
  actualstartdatetime: z.coerce.string().optional(),
  actualenddatetime: z.coerce.string().optional(),
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
    id: '',
    planid: '',
    startdatetime: '',
    enddatetime: '',
    prodid: '',
    prodname: '',
    prodlot: '',
    prodline: '',
    quantity: 0,
    seq_no: 0,
    actualstartdatetime: '',
    actualenddatetime: '',
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


  useEffect(() => {
    if (editingData) {
      reset({
        ...editingData,
        startdatetime: editingData.startdatetime ? dayjs(editingData.startdatetime).format('YYYY-MM-DDTHH:mm') : undefined,
        enddatetime: editingData.enddatetime ? dayjs(editingData.enddatetime).format('YYYY-MM-DDTHH:mm') : undefined,
        actualstartdatetime: editingData.actualstartdatetime ? dayjs(editingData.actualstartdatetime).format('YYYY-MM-DDTHH:mm') : undefined,
        actualenddatetime: editingData.actualenddatetime ? dayjs(editingData.actualenddatetime).format('YYYY-MM-DDTHH:mm') : undefined,
      });
    } else {
      reset(defaultValues);
    }
  }, [editingData, reset]);

  if (!showModal) return null;

  const onSubmit: SubmitHandler<PlanningFormValues> = async (formData) => {
    const formWithMeta: Planning = {
      ...formData,
      startdatetime: new Date(formData.startdatetime),
      enddatetime: new Date(formData.enddatetime),
      actualstartdatetime: formData.actualstartdatetime ? new Date(formData.actualstartdatetime) : undefined,
      actualenddatetime: formData.actualenddatetime ? new Date(formData.actualenddatetime) : undefined,
      createdby: session?.user?.userid,
      updatedby: formData.id ? session?.user?.userid : null,
    };
    onSave(formWithMeta);
  };

  console.log('errors', errors)

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-4xl relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowModal(false)}
        >
          <X className="text-red-500" size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          {editingData?.planid ? 'Edit Planning' : 'Add Planning'}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('seq_no')} />
          <input type="hidden" {...register('actualstartdatetime')} />
          <input type="hidden" {...register('actualenddatetime')} />
          

          {/* Plan ID */}
          <div className="mb-4">
            <div className="grid grid-cols-[150px_1fr] items-center gap-2">
              <label className="font-normal w-32">Plan ID:</label>
              <input
                {...register("planid")}
                className="border p-2 w-full mb-1 bg-white"
                readOnly={editingData && !editingData.id ? true : undefined}
              />
            </div>
            {errors.planid && <p className="text-red-500 ml-160">{errors.planid.message}</p>}
          </div>

          {/* Plan Date Time Pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                  <label className="font-normal w-32">Plan Startdate:</label>
                  <Controller
                    name="startdatetime"
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
                            error: !!errors.startdatetime,
                            InputProps: {
                              sx: {
                                fontSize: '14px',
                                paddingX: '8px',
                              }
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
                {errors.startdatetime && <p className="text-red-500 ml-160">{errors.startdatetime.message}</p>}
              </div>

              {/* End Date */}
              <div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                  <label className="font-normal w-32">Plan Enddate:</label>
                  <Controller
                    name="enddatetime"
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
                            error: !!errors.enddatetime,
                            InputProps: {
                              sx: {
                                fontSize: '14px',
                                paddingX: '8px',
                              }
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
                {errors.enddatetime && <p className="text-red-500 ml-120">{errors.enddatetime.message}</p>}
              </div>
            </div>
          </LocalizationProvider>

          {/*  Product ID */}
          <div className="mb-4">
            <SearchFieldModal
              key={`productId-${editingData?.prodid || 'new'}`}
              register={register}
              setValue={setValue}
              fieldName="prodid"
              label="Product ID"
              placeholder="Select product ID..."
              dataLoader={getProductOptions}
              labelField="value"
              valueField="label"
              allowFreeText={false}
              disabled={!canEdit}
              initialValue={editingData?.prodid}
              onSelectionChange={(value, option) => {
                setValue("prodid", option?.label ?? '', { shouldValidate: true });
                setValue("prodname", value, { shouldValidate: true });
              }}
            />
            {errors.prodid && <p className="text-red-500 ml-160">{errors.prodid.message}</p>}
          </div>

          {/* Lot No & Line ID */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lot No */}
            <div>
              <div className="grid grid-cols-[150px_1fr] items-center gap-2">
                <label className="font-normal w-32">Lot No:</label>
                <input {...register("prodlot")} className="border p-2 w-full mb-1 bg-white" />
              </div>
              {errors.prodlot && <p className="text-red-500 ml-160">{errors.prodlot.message}</p>}
            </div>

            {/*  Line ID */}
            <div>
              <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                <label className="font-normal w-32">Line ID:</label>
                <input {...register("prodline")} className="border p-2 w-full mb-1 bg-white" />
              </div>
              {errors.prodline && <p className="text-red-500 ml-120">{errors.prodline.message}</p>}
            </div>
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