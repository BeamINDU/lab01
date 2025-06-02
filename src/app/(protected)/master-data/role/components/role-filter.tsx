'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import { search as searchRoles } from "@/app/libs/services/role";
import { ActiveStatus } from '@/app/constants/status';

interface RoleFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function RoleFilterForm({ register, setValue, onSearch }: RoleFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Role ID */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="roleId"
          label="Role ID"
          placeholder="Search or enter role ID..."
          dataLoader={searchRoles}
          labelField="roleId"
          valueField="roleId"
          allowFreeText={true}
        />
        
        {/* Role Name  */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="roleName"
          label="Role Name"
          placeholder="Search or enter role name..."
          dataLoader={searchRoles}
          labelField="roleName"
          valueField="roleName"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="status"
          label="Status"
          placeholder="Select status..."
          options={[
            { id: "all", label: "All", value: "" },
            ...ActiveStatus.map(status => ({
              id: status.value,
              label: status.label,
              value: status.value
            }))
          ]}
          allowFreeText={false}
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