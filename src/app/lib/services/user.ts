// src/app/lib/services/user.ts
import { api } from '@/app/utils/api'
import type { User, ParamSearch } from "@/app/types/user"

// ⭐ ปรับปรุง mock data ให้มี roleName ที่ตรงกับ Role options
const mockData: User[] = Array.from({ length: 20 }, (_, i) => ({
  userId: `UN${i+1}`,
  userName: `User${i+1}`,
  firstname: `FirstName${i+1}`,
  lastname: `LastName${i+1}`, 
  email: `user${i+1}@company.com`,
  status: i % 2 === 0 ? 1: 0,
  roleName: i % 3 === 0 ? 'Administrator' :   // ทุก 3 คน = Administrator
           i % 3 === 1 ? 'User' :             // ทุก 3 คน = User  
           'Administrator',                   // ที่เหลือ = Administrator
  createdDate: new Date(),
  createdBy: 'Admin',
  updatedDate: null,
  updatedBy: null,
}))

export const search = async (param?: ParamSearch) => { 
  console.log('User service received params:', param); // Debug log
  
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined : Number(param.status);

  const filteredData = mockData.filter(item => {
    const userIdMatch = !param.userId || item.userId.toLowerCase().includes(param.userId.toLowerCase());
    const userNameMatch = !param.userName || item.userName.toLowerCase().includes(param.userName.toLowerCase());
    const firstnameMatch = !param.firstname || item.firstname.toLowerCase().includes(param.firstname.toLowerCase());
    const lastnameMatch = !param.lastname || item.lastname.toLowerCase().includes(param.lastname.toLowerCase());
    
    // ⭐ เพิ่มการกรอง roleName (สำคัญ!)
    const roleNameMatch = !param.roleName || 
      (item.roleName && item.roleName.toLowerCase().includes(param.roleName.toLowerCase())) ||
      (param.roleName.toLowerCase() === 'admin' && item.roleName === 'Administrator') ||
      (param.roleName.toLowerCase() === 'administrator' && item.roleName === 'Administrator') ||
      (param.roleName.toLowerCase() === 'user' && item.roleName === 'User');
    
    const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
    console.log(`User ${item.userId}:`, {
      roleNameMatch,
      searchRole: param.roleName,
      itemRole: item.roleName,
      allMatches: { userIdMatch, userNameMatch, firstnameMatch, lastnameMatch, roleNameMatch, statusMatch }
    }); // Debug log
    
    return userIdMatch && userNameMatch && firstnameMatch && lastnameMatch && roleNameMatch && statusMatch;
  });
  
  console.log('User filtered results:', filteredData.length, 'items'); // Debug log
  console.log('Filtered users:', filteredData.map(u => ({ userId: u.userId, roleName: u.roleName }))); // Debug log
  
  return filteredData;
};

export const detail = async (id: string) => {
  const user = mockData.find(item => item.userId === id);
  console.log('User detail for', id, ':', user); // Debug log
  return user;
};

export const create = async (param: Partial<User>) => {
  return param;
};

export const update = async (param: Partial<User>) => {
  return param;
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};