// src/app/lib/services/role.ts - Complete Realistic Mock Data
import { api } from '@/app/utils/api'
import type { Role, ParamSearch } from "@/app/types/role"
import { SelectOption } from "@/app/types/select-option";

// ⭐ ข้อมูล Role จริงในองค์กร
const ROLE_DATA = [
  {
    id: 'ADMIN',
    name: 'Administrator',
    description: 'System administrators with full access to all functions and settings. Can manage users, configure system parameters, and access all modules.',
    level: 'Executive',
    permissions: ['all']
  },
  {
    id: 'MANAGER',
    name: 'Production Manager',
    description: 'Production managers who oversee manufacturing operations, quality control, and production planning. Have access to reports and management functions.',
    level: 'Management', 
    permissions: ['production', 'quality', 'reports', 'planning']
  },
  {
    id: 'SUPERVISOR',
    name: 'Production Supervisor', 
    description: 'Line supervisors responsible for daily production operations, quality monitoring, and team coordination.',
    level: 'Supervisory',
    permissions: ['production', 'quality', 'basic_reports']
  },
  {
    id: 'QC_INSPECTOR',
    name: 'Quality Inspector',
    description: 'Quality control inspectors who perform product inspections, defect analysis, and quality reporting.',
    level: 'Specialist',
    permissions: ['quality', 'defect_reports', 'inspection']
  },
  {
    id: 'OPERATOR',
    name: 'Production Operator',
    description: 'Machine operators and production workers who operate equipment and perform basic quality checks.',
    level: 'Operational',
    permissions: ['production_view', 'basic_inspection']
  },
  {
    id: 'ENGINEER',
    name: 'Process Engineer',
    description: 'Engineers responsible for process optimization, equipment maintenance, and technical problem solving.',
    level: 'Professional',
    permissions: ['engineering', 'maintenance', 'technical_reports', 'process_optimization']
  },
  {
    id: 'MAINTENANCE',
    name: 'Maintenance Technician',
    description: 'Maintenance staff responsible for equipment upkeep, repairs, and preventive maintenance.',
    level: 'Technical',
    permissions: ['maintenance', 'equipment_reports']
  },
  {
    id: 'WAREHOUSE',
    name: 'Warehouse Clerk',
    description: 'Warehouse staff handling inventory management, receiving, and shipping operations.',
    level: 'Operational',
    permissions: ['warehouse', 'inventory']
  },
  {
    id: 'PLANNER',
    name: 'Production Planner',
    description: 'Planning specialists who create production schedules, manage resources, and coordinate manufacturing activities.',
    level: 'Professional',
    permissions: ['planning', 'scheduling', 'resource_management']
  },
  {
    id: 'ANALYST',
    name: 'Quality Analyst',
    description: 'Data analysts who analyze quality metrics, generate reports, and provide insights for process improvement.',
    level: 'Professional',
    permissions: ['analytics', 'reports', 'data_analysis']
  },
  {
    id: 'VIEWER',
    name: 'Read Only User',
    description: 'Users with view-only access for monitoring and reporting purposes without modification rights.',
    level: 'Basic',
    permissions: ['view_only']
  }
];

// ⭐ สร้าง Mock Data
const mockData: Role[] = ROLE_DATA.map((role, i) => {
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 1460 * 24 * 60 * 60 * 1000)); // สุ่ม 4 ปีย้อนหลัง
  const hasUpdate = Math.random() > 0.8; // 20% โอกาสที่จะมีการอัพเดท
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 730 * 24 * 60 * 60 * 1000)) : null;

  return {
    roleId: role.id,
    roleName: role.name,
    description: role.description,
    status: role.level === 'Executive' || role.level === 'Management' ? 1 : Math.random() > 0.1 ? 1 : 0, // Important roles always active, others 90% active
    createdDate: createdDate,
    createdBy: i < 2 ? 'system' : ['admin', 'hr_manager'][Math.floor(Math.random() * 2)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'hr_manager'][Math.floor(Math.random() * 2)] : null,
  };
});

// ⭐ API-Ready Functions
export const search = async (param?: ParamSearch) => { 
  console.log('Role service received params:', param);
  
  // TODO: Replace with actual API call
  // const response = await api.get<Role[]>('/roles', { params: param });
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
    const roleIdMatch = !param.roleId || item.roleId.toLowerCase().includes(param.roleId.toLowerCase());
    const roleNameMatch = !param.roleName || item.roleName.toLowerCase().includes(param.roleName.toLowerCase());
    const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
    return roleIdMatch && roleNameMatch && statusMatch;
  });
  
  console.log('Role filtered results:', filteredData.length, 'items');
  return filteredData;
};

export const detail = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.get<Role>(`/roles/${id}`);
  
  return mockData.find(item => item.roleId === id);
};

export const create = async (param: Partial<Role>) => {
  // TODO: Replace with actual API call
  // return await api.post<Role>('/roles', param);
  
  console.log('Creating role:', param);
  const newRole = {
    ...param,
    roleId: param.roleId || `ROLE${String(mockData.length + 1).padStart(3, '0')}`,
    status: param.status ?? 1,
    createdDate: new Date(),
    createdBy: param.createdBy || 'admin',
    updatedDate: null,
    updatedBy: null,
  };
  
  mockData.push(newRole as Role);
  return newRole;
};

export const update = async (param: Partial<Role>) => {
  // TODO: Replace with actual API call
  // return await api.put<Role>(`/roles/${param.roleId}`, param);
  
  console.log('Updating role:', param);
  const index = mockData.findIndex(item => item.roleId === param.roleId);
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
  // return await api.delete(`/roles/${id}`);
  
  console.log('Deleting role:', id);
  const index = mockData.findIndex(item => item.roleId === id);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
  return {};
};

export const upload = async (file: File) => {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // return await api.post('/roles/upload', formData);
  
  console.log('Uploading role file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'Role file uploaded successfully' };
};

// function สำหรับดึงข้อมูล Role Options
export const getRoleOptions = async (): Promise<SelectOption[]> => {

  
  console.log('Loading Role options...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // ส่งเฉพาะ Role ที่ Active เท่านั้น
  const activeRoles = mockData.filter(item => item.status === 1);
  
  const options = activeRoles.map(item => ({
    label: item.roleName,
    value: item.roleName // ใช้ name เป็น value เพื่อให้ตรงกับ User data
  }));
  
  console.log('Role options loaded:', options.length, 'items');
  return options;
};

// ⭐ เพิ่ม function สำหรับดึงข้อมูล Role สำหรับ SearchField ในหน้า Role เอง
export const getRoleSearchOptions = async (): Promise<SelectOption[]> => {
  // TODO: Replace with actual API call
  // return await api.get<SelectOption[]>('/roles/search-options');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // ส่งทั้งหมด (รวม Inactive) สำหรับการค้นหาในหน้า Role
  return mockData.map(item => ({
    label: `${item.roleName} (${item.roleId})`,
    value: item.roleName
  }));
};