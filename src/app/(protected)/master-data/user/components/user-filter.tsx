'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchFieldResponsive  from '@/app/components/common/SearchField';
import { getRoleNameOptions } from '@/app/libs/services/role';
import { getUserIdOptions, getUserNameOptions } from '@/app/libs/services/user';
import { ActiveStatus } from '@/app/constants/status';

interface UserFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function UserFilterForm({ register, setValue, onSearch }: UserFilterFormProps) {
  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* User ID - แปลงจาก input เป็น SearchField */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="userId"
          label="User ID"
          placeholder="Search user ID..."
          dataLoader={getUserIdOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
        
        {/* Username - แปลงจาก input เป็น SearchField */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="userName"
          label="Username"
          placeholder="Search username..."
          dataLoader={getUserNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Role */}
        <SearchFieldResponsive 
          register={register}
          setValue={setValue}
          fieldName="roleName"
          label="Role Name"
          placeholder="Search role..."
          dataLoader={getRoleNameOptions}
          labelField="label"
          valueField="value"
          allowFreeText={false}
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