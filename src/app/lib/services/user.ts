// src/app/lib/services/user.ts - Complete Realistic Mock Data
import { api } from '@/app/utils/api'
import type { User, ParamSearch } from "@/app/types/user"

// ⭐ ข้อมูลพนักงานจริง
const EMPLOYEE_DATA = [
  // Management
  { firstName: 'Somchai', lastName: 'Jaidee', role: 'Administrator', department: 'Management', level: 'Senior', email: 'somchai.j' },
  { firstName: 'Siriporn', lastName: 'Wongsawat', role: 'Administrator', department: 'Management', level: 'Senior', email: 'siriporn.w' },
  { firstName: 'Kittipong', lastName: 'Rattana', role: 'Administrator', department: 'IT', level: 'Senior', email: 'kittipong.r' },
  
  // Production Supervisors
  { firstName: 'Niran', lastName: 'Suksan', role: 'User', department: 'Production', level: 'Supervisor', email: 'niran.s' },
  { firstName: 'Porntip', lastName: 'Khamkong', role: 'User', department: 'Production', level: 'Supervisor', email: 'porntip.k' },
  { firstName: 'Wichai', lastName: 'Moonmee', role: 'User', department: 'Production', level: 'Supervisor', email: 'wichai.m' },
  
  // Quality Control
  { firstName: 'Suwanna', lastName: 'Kaewta', role: 'User', department: 'Quality', level: 'Inspector', email: 'suwanna.k' },
  { firstName: 'Thawat', lastName: 'Pimpa', role: 'User', department: 'Quality', level: 'Inspector', email: 'thawat.p' },
  { firstName: 'Malee', lastName: 'Sornthong', role: 'User', department: 'Quality', level: 'Inspector', email: 'malee.s' },
  { firstName: 'Boonmee', lastName: 'Klahan', role: 'User', department: 'Quality', level: 'Senior Inspector', email: 'boonmee.k' },
  
  // Production Operators
  { firstName: 'Anan', lastName: 'Prasert', role: 'User', department: 'Production', level: 'Operator', email: 'anan.p' },
  { firstName: 'Sombat', lastName: 'Chaiyo', role: 'User', department: 'Production', level: 'Operator', email: 'sombat.c' },
  { firstName: 'Wandee', lastName: 'Siriporn', role: 'User', department: 'Production', level: 'Operator', email: 'wandee.s' },
  { firstName: 'Preecha', lastName: 'Dumrong', role: 'User', department: 'Production', level: 'Operator', email: 'preecha.d' },
  { firstName: 'Ratana', lastName: 'Boonsri', role: 'User', department: 'Production', level: 'Operator', email: 'ratana.b' },
  
  // Maintenance
  { firstName: 'Kritsada', lastName: 'Techaphan', role: 'User', department: 'Maintenance', level: 'Technician', email: 'kritsada.t' },
  { firstName: 'Surasak', lastName: 'Meesuk', role: 'User', department: 'Maintenance', level: 'Technician', email: 'surasak.m' },
  { firstName: 'Narong', lastName: 'Kamlang', role: 'User', department: 'Maintenance', level: 'Senior Technician', email: 'narong.k' },
  
  // Warehouse
  { firstName: 'Pensri', lastName: 'Thongchai', role: 'User', department: 'Warehouse', level: 'Clerk', email: 'pensri.t' },
  { firstName: 'Somsak', lastName: 'Boonchu', role: 'User', department: 'Warehouse', level: 'Clerk', email: 'somsak.b' },
  { firstName: 'Wipob', lastName: 'Srisawat', role: 'User', department: 'Warehouse', level: 'Supervisor', email: 'wipob.s' },
  
  // Engineering
  { firstName: 'Apirat', lastName: 'Chaiwong', role: 'User', department: 'Engineering', level: 'Engineer', email: 'apirat.c' },
  { firstName: 'Sutida', lastName: 'Phongphan', role: 'User', department: 'Engineering', level: 'Engineer', email: 'sutida.p' },
  { firstName: 'Chayakorn', lastName: 'Namsiri', role: 'User', department: 'Engineering', level: 'Senior Engineer', email: 'chayakorn.n' },
  
  // HR & Admin
  { firstName: 'Anchalee', lastName: 'Jitpakdee', role: 'User', department: 'HR', level: 'HR Officer', email: 'anchalee.j' },
  { firstName: 'Thanawat', lastName: 'Suksawat', role: 'User', department: 'Admin', level: 'Admin Officer', email: 'thanawat.s' },
];

// ⭐ สร้าง Mock Data
const mockData: User[] = EMPLOYEE_DATA.map((emp, i) => {
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 730 * 24 * 60 * 60 * 1000)); // สุ่ม 2 ปีย้อนหลัง
  const hasUpdate = Math.random() > 0.7; // 30% โอกาสที่จะมีการอัพเดท
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 365 * 24 * 60 * 60 * 1000)) : null;

  return {
    userId: `USR${String(i + 1).padStart(4, '0')}`,
    userName: `${emp.firstName.toLowerCase()}.${emp.lastName.toLowerCase()}`,
    firstname: emp.firstName,
    lastname: emp.lastName,
    email: `${emp.email}@company.com`,
    roleName: emp.role,
    status: Math.random() > 0.05 ? 1 : 0, // 95% Active, 5% Inactive
    createdDate: createdDate,
    createdBy: i < 3 ? 'system' : 'admin', // ผู้บริหารสร้างโดย system
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'hr'][Math.floor(Math.random() * 2)] : null,
  };
});

// ⭐ API-Ready Functions
export const search = async (param?: ParamSearch) => { 
  console.log('User service received params:', param);
  
  // TODO: Replace with actual API call
  // const response = await api.get<User[]>('/users', { params: param });
  // return response;
  
  if (!param) return mockData;

  // ✅ จัดการ status parameter ให้ปลอดภัย
  let parsedStatus: number | undefined = undefined;
  if (param.status !== undefined && param.status !== null && param.status.toString().trim() !== '') {
    const statusNum = Number(param.status);
    if (!isNaN(statusNum)) {
      parsedStatus = statusNum;
    }
  }

  const filteredData = mockData.filter(item => {
    const userIdMatch = !param.userId || item.userId.toLowerCase().includes(param.userId.toLowerCase());
    const userNameMatch = !param.userName || item.userName.toLowerCase().includes(param.userName.toLowerCase());
    const firstnameMatch = !param.firstname || item.firstname.toLowerCase().includes(param.firstname.toLowerCase());
    const lastnameMatch = !param.lastname || item.lastname.toLowerCase().includes(param.lastname.toLowerCase());
    const roleNameMatch = !param.roleName || 
      (item.roleName && item.roleName.toLowerCase().includes(param.roleName.toLowerCase()));
    const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
    return userIdMatch && userNameMatch && firstnameMatch && lastnameMatch && roleNameMatch && statusMatch;
  });
  
  console.log('User filtered results:', filteredData.length, 'items');
  return filteredData;
};

export const detail = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.get<User>(`/users/${id}`);
  
  return mockData.find(item => item.userId === id);
};

export const create = async (param: Partial<User>) => {
  // TODO: Replace with actual API call
  // return await api.post<User>('/users', param);
  
  console.log('Creating user:', param);
  const newUser = {
    ...param,
    userId: param.userId || `USR${String(mockData.length + 1).padStart(4, '0')}`,
    status: param.status ?? 1,
    createdDate: new Date(),
    createdBy: param.createdBy || 'admin',
    updatedDate: null,
    updatedBy: null,
  };
  
  mockData.push(newUser as User);
  return newUser;
};

export const update = async (param: Partial<User>) => {
  // TODO: Replace with actual API call
  // return await api.put<User>(`/users/${param.userId}`, param);
  
  console.log('Updating user:', param);
  const index = mockData.findIndex(item => item.userId === param.userId);
  if (index !== -1) {
    mockData[index] = {
      ...mockData[index],
      ...param,
      updatedDate: new Date(),
      updatedBy: param.updatedBy || 'admin'
    };
    return mockData[index];
  }
  
  return {
    ...param,
    updatedDate: new Date(),
    updatedBy: param.updatedBy || 'admin'
  };
};

export const remove = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.delete(`/users/${id}`);
  
  console.log('Deleting user:', id);
  const index = mockData.findIndex(item => item.userId === id);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
  return {};
};

export const upload = async (file: File) => {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // return await api.post('/users/upload', formData);
  
  console.log('Uploading user file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'User file uploaded successfully' };
};