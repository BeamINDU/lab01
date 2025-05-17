import { api } from '@/app/utils/api'
import type { User, ParamSearch } from "@/app/types/user"

const mockData: User[] = Array.from({ length: 20 }, (_, i) => ({
  userId: `UN${i+1}`,
  userName: `User${i+1}`,
  fullName: `F${i+1} L${i+1}`,
  status: i % 2 === 0 ? 1: 0,
  roleName: 'admin',
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: new Date(),
  updatedBy: 'admin',
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.userId || item.userId.includes(param.userId)) &&
      (!param.userName || item.userName.includes(param.userName))
    );
  });
  // const User = await api.get<User[]>('/search')
};


export const detail = async (id: string) => {
  return mockData.find(item => item.userId === id);
  // return await apiClient<User>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<User>) => {
  return param;
  // const newData = await api.post<User>('/create', param)
};

export const update = async (param: Partial<User>) => {
  return param;
  // const updated = await api.put<User>(`/update/${param.id}`, param)
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