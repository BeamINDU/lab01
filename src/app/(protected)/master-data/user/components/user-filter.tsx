// src/app/(protected)/master-data/user/components/user-filter.tsx
'use client';

import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SearchField from '@/app/components/common/SearchField';
import { getRoleOptions } from '@/app/lib/services/role';
import { search as searchUsers } from '@/app/lib/services/user';
import { ActiveStatus } from '@/app/lib/constants/status';

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
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="userId"
          label="User ID"
          placeholder="Search or enter user ID..."
          dataLoader={searchUsers}
          labelField="userId"
          valueField="userId"
          allowFreeText={true}
        />
        
        {/* Username - แปลงจาก input เป็น SearchField */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="userName"
          label="Username"
          placeholder="Search or enter username..."
          dataLoader={searchUsers}
          labelField="userName"
          valueField="userName"
          allowFreeText={true}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Role - ใช้ SearchField (เหมือนเดิมแต่ง่ายขึ้น) */}
        <SearchField
          register={register}
          setValue={setValue}
          fieldName="roleName"
          label="Role"
          placeholder="Search role..."
          dataLoader={async () => {
            const options = await getRoleOptions();
            return options; // getRoleOptions ส่ง { label, value }
          }}
          labelField="label"
          valueField="value"
          allowFreeText={true}
        />
        
        {/* Status */}
        <SearchField
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
            type="button"
            className="flex items-center gap-1 bg-[#004798] text-white px-4 py-2 rounded hover:bg-blue-900"
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