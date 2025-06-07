'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, Control, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import DateTimeField from '@/app/components/common/DateTimeField';
import { getPlanIdOptions, getLotNoOptions, getLineNoOptions } from "@/app/libs/services/planning";
import { getProductIdOptions } from "@/app/libs/services/product";

interface PlanningFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  onSearch: () => void;
}

export default function PlanningFilterForm({ register, setValue, control, onSearch }: PlanningFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      {/* Date Range Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/*  Date From */}
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
        {/* Plan ID */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="planId"
          label="Plan ID"
          placeholder="Search plan ID..."
          // dataLoader={getPlanningPlanOptions}
          labelField="planId"
          valueField="planId"
          allowFreeText={true}
          className="w-full"
        />
        
        {/* Product ID */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="productId"
          label="Product ID"
          placeholder="Search product ID..."
          // dataLoader={getPlanningProductOptions}
          labelField="productId"
          valueField="productId"
          allowFreeText={true}
          className="w-full"
        />
      </div>
      
      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Lot No */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="lotNo"
          label="Lot No"
          placeholder="Search lot number..."
          // dataLoader={getPlanningLotOptions}
          labelField="lotNo"
          valueField="lotNo"
          allowFreeText={true}
          className="w-full"
        />
          
        {/* Line ID */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="lineId"
          label="Line ID"
          placeholder="Search line ID..."
          // dataLoader={getPlanningLineOptions}
          labelField="lineId"
          valueField="lineId"
          allowFreeText={true}
          className="w-full"
        />
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