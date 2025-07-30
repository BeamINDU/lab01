'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import { getRoleNameOptions } from "@/app/libs/services/role";
import { ActiveStatus } from '@/app/constants/status';

interface RoleFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function RoleFilterForm({ register, setValue, onSearch }: RoleFilterFormProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_3fr_3fr_1fr] gap-4">
        {/* Role Name  */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="roleName"
          label="Role Name"
          placeholder="Search role name..."
          dataLoader={getRoleNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
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
            ...ActiveStatus.map(status => ({
              label: status.label,
              value: String(status.value),
            }))
          ]}
          allowFreeText={false}
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