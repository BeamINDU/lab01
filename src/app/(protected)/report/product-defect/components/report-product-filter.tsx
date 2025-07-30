'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Control, UseFormSetValue, useWatch } from "react-hook-form";
import SearchFieldResponsive from '@/app/components/common/SearchField';
import DateTimeField from '@/app/components/common/DateTimeField';
import { getProductIdOptions, getProductNameOptions } from "@/app/libs/services/product";
import { getDefectTypeIdOptions, getDefectTypeNameOptions } from "@/app/libs/services/defect-type";
import { getCameraIdOptions, getCameraNameOptions } from "@/app/libs/services/camera";
import { ProductStatus } from '@/app/constants/status';
import dayjs from 'dayjs';

interface ReportProductFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function ReportProductFilterForm({ register, setValue, control, onSearch }: ReportProductFilterFormProps) {

  const dateFrom = useWatch({ control, name: 'dateFrom' });
  const dateTo = useWatch({ control, name: 'dateTo' });

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Date From */}
        <DateTimeField
          control={control}
          fieldName="dateFrom"
          label="Date From"
          placeholder="YYYY-MM-DD HH:mm"
          variant="datetime"
          format="YYYY-MM-DD HH:mm"
          ampm={false}
          timeSteps={{ minutes: 1 }}
          closeOnSelect={false}
          className="w-full"
          maxDate={dateTo ? dayjs(dateTo) : undefined}
        />
        
        {/* Date To */}
        <DateTimeField
          control={control}
          fieldName="dateTo"
          label="Date To"
          placeholder="YYYY-MM-DD HH:mm"
          variant="datetime"
          format="YYYY-MM-DD HH:mm"
          ampm={false}
          timeSteps={{ minutes: 1 }}
          closeOnSelect={false}
          className="w-full"
          minDate={dateFrom ? dayjs(dateFrom) : undefined}
        />
        
        

        {/* Status */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="status"
          label="Status"
          placeholder="Select status..."
          options={[
            { label: "All", value: "" },
            ...ProductStatus.map(status => ({
              label: status.label,
              value: String(status.value),
            }))
          ]}
          allowFreeText={false}
        />

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Product ID */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search Product ID..."
          dataLoader={getProductIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />

        {/* Product Name */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search Product Name..."
          dataLoader={getProductNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />

        {/* DefectType Name */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="defectTypeName"
          label="Defect Name"
          placeholder="Search Defect Name..."
          dataLoader={getDefectTypeNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[3fr_3fr_3fr_1fr] gap-4">

        {/* Camera ID */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="cameraId"
          label="Camera ID"
          placeholder="Search Camera ID..."
          dataLoader={getCameraIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        
        {/* Camera Name */}
        <SearchFieldResponsive
          register={register}
          setValue={setValue}
          fieldName="cameraName"
          label="Camera Name"
          placeholder="Search Camera Name..."
          dataLoader={getCameraNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />

        
        {/* Search Button */}
        <div className="flex items-end">
          <button
            className="flex items-center gap-1 btn-primary-dark text-white px-4 py-2 rounded hover:bg-blue-900 whitespace-nowrap"
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