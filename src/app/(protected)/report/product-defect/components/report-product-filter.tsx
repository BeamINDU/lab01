'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Controller, Control, UseFormSetValue } from "react-hook-form";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import SearchField from '@/app/components/common/SearchField';
import { getProductOptions } from "@/app/libs/services/product";
import { getDefectTypeOptions } from "@/app/libs/services/defect-type";
import { getCameraOptions } from "@/app/libs/services/camera";

interface ReportProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function ReportProductFilterForm({ register, setValue, control, onSearch }: ReportProductFilterFormProps) {
  const dateFormat = 'YYYY-MM-DD HH:mm';
  
  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '0.375rem',  
  };
  
  return (
    <div className="md:col-span-2 space-y-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Date From  */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Date From</label>
            <Controller
              name="dateFrom"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format(dateFormat) : null)}
                  format={dateFormat}
                  ampm={false}
                  timeSteps={{ minutes: 1 }}
                  closeOnSelect={false} 
                  minutesStep={1}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      fullWidth: true,
                      className: "rounded border border-gray-300",
                      placeholder: "YYYY-MM-DD HH:mm",
                      sx: inputStyle 
                    } 
                  }}
                />
              )}
            />
          </div>
          
          {/* Date To  */}
          <div className="grid grid-cols-[110px_1fr] items-center gap-2">
            <label className="font-semibold w-[120px]">Date To</label>
            <Controller
              name="dateTo"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.format(dateFormat) : null)}
                  format={dateFormat}
                  ampm={false}
                  timeSteps={{ minutes: 1 }}
                  closeOnSelect={false} 
                  minutesStep={1}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      fullWidth: true,
                      className: "rounded border border-gray-300",
                      placeholder: "YYYY-MM-DD HH:mm",
                      sx: inputStyle 
                    } 
                  }}
                />
              )}
            />
          </div>
          
          {/* Camera Name - ใช้ Camera Options */}
          <SearchField
            register={register}
            setValue={setValue}
            fieldName="cameraName"
            label="Camera Name"
            placeholder="Search camera..."
            dataLoader={async () => {
              const options = await getCameraOptions();
              // แปลง SelectOption เป็น format ที่ SearchField ต้องการ
              return options.map(opt => ({
                cameraName: opt.label.split(' - ')[0] // ใช้ชื่อกล้องอย่างเดียว
              }));
            }}
            labelField="cameraName"
            valueField="cameraName"
            allowFreeText={true}
          />
        </div>
      </LocalizationProvider>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Product Name - ใช้ Product Options */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search product..."
          dataLoader={async () => {
            const options = await getProductOptions();
            // แปลง SelectOption เป็น format ที่ SearchField ต้องการ
            return options.map(opt => ({
              productName: opt.label
            }));
          }}
          labelField="productName"
          valueField="productName"
          allowFreeText={true}
        />
        
        {/* Defect Type - ใช้ Defect Type Options */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="defectType"
          label="Defect Type"
          placeholder="Search defect type..."
          dataLoader={async () => {
            const options = await getDefectTypeOptions();
            // แปลง SelectOption เป็น format ที่ SearchField ต้องการ
            return options.map(opt => ({
              defectType: opt.label
            }));
          }}
          labelField="defectType"
          valueField="defectType"
          allowFreeText={true}
        />
        
        {/* Search Button */}
        <div className="flex items-center justify-start pt-[2px]">
          <button

            className="flex items-center gap-1 btn-primary-dark text-white px-4 py-2 rounded hover:bg-blue-900"

            onClick={onSearch}
          >
            Search
            <Search size={16} className="mt-1" />
          </button>
        </div>
      </div>
    </div>
  );
}