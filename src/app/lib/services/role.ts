// src/app/lib/services/role.ts
import { api } from '@/app/utils/api'
import type { Role, ParamSearch } from "@/app/types/role"
import { SelectOption } from "@/app/types/select-option";

// ⭐ ปรับปรุง mock data ให้มีแค่ admin, user
const mockData: Role[] = [
  {
    roleId: 'ADMIN',
    roleName: 'Administrator',
    description: 'All administrators have access to all functions.',
    status: 1,
    createdDate: new Date('2024-01-01'),
    createdBy: 'system',
    updatedDate: new Date('2024-06-01'),
    updatedBy: 'Admin',
  },
  {
    roleId: 'USER',
    roleName: 'User',
    description: 'Regular users have access to basic functions.',
    status: 1,
    createdDate: new Date('2024-01-01'),
    createdBy: 'system',
    updatedDate: null,
    updatedBy: null,
  }
];

// ⭐ ปรับปรุง mock data สำหรับ Role Options ให้ตรงกับ User mock data
const mockRoleOptions: SelectOption[] = [
  { label: 'Administrator', value: 'Administrator' }, // ⭐ เปลี่ยนจาก 'ADMIN' เป็น 'Administrator'
  { label: 'User', value: 'User' },                   // ⭐ เปลี่ยนจาก 'USER' เป็น 'User'
];

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.roleId || item.roleId.toLowerCase().includes(param.roleId.toLowerCase())) &&
      (!param.roleName || item.roleName.toLowerCase().includes(param.roleName.toLowerCase())) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
};

export const detail = async (id: string) => {
  return mockData.find(item => item.roleId === id);
};

export const create = async (param: Partial<Role>) => {
  return param;
};

export const update = async (param: Partial<Role>) => {
  return param;
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ⭐ เพิ่ม function สำหรับดึงข้อมูล Role Options
export const getRoleOptions = async (): Promise<SelectOption[]> => {
  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRoleOptions;
    
    // ในการใช้งานจริง อาจจะดึงจาก mockData:
    // const roles = await search(); // ดึงข้อมูลทั้งหมด
    // return roles
    //   .filter(item => item.status === 1) // เฉพาะที่ active
    //   .map(item => ({
    //     label: item.roleName,
    //     value: item.roleId
    //   }));
    
    // หรือเรียก API โดยตรง:
    // return await api.get<SelectOption[]>('/role-options');
  } catch (error) {
    console.error('Failed to fetch role options:', error);
    throw error;
  }
};