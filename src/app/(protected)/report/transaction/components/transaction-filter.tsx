'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import DateTimeField from '@/app/components/common/DateTimeField'; 
import { getProductIdOptions } from "@/app/libs/services/product";
import { getLotNoOptions } from "@/app/libs/services/transaction";

interface TransactionFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function TransactionFilterForm({ register, setValue, control, onSearch }: TransactionFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      {/* Date Range Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/*  Date From  */}
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
        />
        
        {/*  Date To  */}
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
        />
      </div>
      
      {/* Search Fields Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        
        {/* Lot No - ใช้ข้อมูลจาก Transaction ที่ดึง Lot No จาก Report Defect Summary */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search lot number..."
          dataLoader={getLotNoOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
          className="w-full"
        />
        
        {/* Product ID - ใช้ข้อมูลจาก Transaction */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search product ID..."
          dataLoader={getProductIdOptions}
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