'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Control, UseFormSetValue, useWatch } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import DateTimeField from '@/app/components/common/DateTimeField'; 
import { getProductIdOptions, getProductNameOptions } from "@/app/libs/services/product";
import { getLotNoOptions } from "@/app/libs/services/transaction";
import dayjs from 'dayjs';

interface TransactionFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function TransactionFilterForm({ register, setValue, control, onSearch }: TransactionFilterFormProps) {

  const dateFrom = useWatch({ control, name: 'dateFrom' });
  const dateTo = useWatch({ control, name: 'dateTo' });

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
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

        {/* Lot No */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search Lot No..."
          dataLoader={getLotNoOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Product ID */}
        <SearchField
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
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productName"
          label="Product Name"
          placeholder="Search Product name..."
          dataLoader={getProductNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />

        {/* Search Button  */}
        <div className="hidden xl:flex items-center justify-start pt-[2px]">
          <button
            type="button"
            className="flex items-center gap-1 bg-[#004798] text-white px-4 py-2 rounded hover:bg-blue-900 whitespace-nowrap"
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