// src/app/(protected)/master-data/user/components/user-filter.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react'
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import GoogleStyleSearch, { SearchOption } from '@/app/components/common/Search';
import { getRoleOptions } from '@/app/lib/services/role';

interface UserFilterFormProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onSearch: () => void;
}

export default function UserFilterForm({ register, setValue, onSearch }: UserFilterFormProps) {
  // State สำหรับ Role search
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [roleOptions, setRoleOptions] = useState<SearchOption[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);

  // โหลดข้อมูล Role จาก role service
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const roles = await getRoleOptions();
        
        // แปลงจาก SelectOption เป็น SearchOption (เพิ่ม id field)
        const searchOptions: SearchOption[] = roles.map((item, index) => ({
          id: (index + 1).toString(),
          label: item.label,
          value: item.value
        }));
        
        setRoleOptions(searchOptions);
      } catch (error) {
        console.error('Failed to load roles:', error);
        setRoleOptions([]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    loadRoles();
  }, []);

  // จัดการเมื่อเลือก Role
  const handleRoleSelect = (option: SearchOption | null) => {
    const value = option ? option.value : '';
    setSelectedRole(value);
    setValue("roleName", value);
    console.log('Selected Role:', value); // Debug log
  };

  // จัดการเมื่อพิมพ์ใน Role Search Box
  const handleRoleInputChange = (inputValue: string) => {
    const matchedOption = roleOptions.find(opt => 
      opt.label.toLowerCase() === inputValue.toLowerCase()
    );
    
    if (!matchedOption) {
      setSelectedRole(inputValue);
      setValue("roleName", inputValue);
      console.log('Typed Role:', inputValue); // Debug log
    }
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* User ID */}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">User ID</label>
          <input
            type="text"
            {...register("userId")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
        
        {/* Username */}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <label className="font-semibold w-[150px]">Username</label>
          <input
            type="text"
            {...register("userName")}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Role - ใช้ Google Style Search Component */}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Role</label>
          <div className="relative">
            {/* Register กับ React Hook Form */}
            <input
              type="hidden"
              {...register("roleName")}
            />
            
            {/* Google Style Search Component */}
            <GoogleStyleSearch
              options={roleOptions}
              value={selectedRole}
              placeholder={isLoadingRoles ? "Loading roles..." : "Search role..."}
              onSelect={handleRoleSelect}
              onInputChange={handleRoleInputChange}
              allowClear={true}
              showDropdownIcon={true}
              minSearchLength={0}
              maxDisplayItems={8}
              disabled={isLoadingRoles}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Status */}
        <div className="grid grid-cols-[110px_1fr] items-center gap-2">
          <label className="font-semibold w-[120px]">Status</label>
          <select
            {...register("status", { valueAsNumber: true })}
            className="rounded px-3 py-2 border border-gray-300 w-full"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        
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