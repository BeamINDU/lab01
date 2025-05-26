import { api } from '@/app/utils/api'
import type { Role, ParamSearch } from "@/app/types/role"

const mockData: Role[] = Array.from({ length: 20 }, (_, i) => ({
  roleId:  `R${i+1}`,
  roleName: `RN${i+1}`,
  description: `ผู้ดูแลระบบทั้งหมด ${i+1}`,
  status: i % 2 === 0 ? 1: 0,
  createdDate: new Date(),
  createdBy: 'admin',
  pdatedDate: null,
  updatedBy: null,
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined  : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.roleId || item.roleId.toLowerCase().includes(param.roleId.toLowerCase())) &&
      (!param.roleName || item.roleName.toLowerCase().includes(param.roleName.toLowerCase())) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
  // const role = await api.get<Role[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.roleId === id);
  // return await apiClient<Role>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<Role>) => {
  return param;
  // const newData = await api.post<Role>('/create', param)
};

export const update = async (param: Partial<Role>) => {
  return param;
  // const updated = await api.put<Role>(`/update/${param.id}`, param)
};

export const remove = async (id: string) => {
  return {};
  // await api.delete(`/remove/${id}`)
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};

  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await api.post<Camera>('/upload', formData)
};