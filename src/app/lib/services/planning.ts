import { api } from '@/app/utils/api'
import type { Planning, ParamSearch } from "@/app/types/planning"

const mockData: Planning[] = Array.from({ length: 20 }, (_, i) => ({
  productId: `PRD${i+1}`,
  lotNo: `LOT-${i+1}`,
  lineId:`Line ${i+1}`,
  startDate: new Date(),
  endDate: new Date(),
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: new Date(),
  updatedBy: 'admin',
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.productId || item.productId.includes(param.productId)) &&
      (!param.lotNo || item.lotNo.includes(param.lotNo))
    );
  });
  // const planningId = await api.get<Planning[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.productId === id);
  // return await apiClient<Planning>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<Planning>) => {
  return param;
  // const newData = await api.post<Planning>('/create', param)
};

export const update = async (param: Partial<Planning>) => {
  return param;
  // const updated = await api.put<v>(`/update/${param.id}`, param)
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
  // const response = await api.post<Planning>('/upload', formData)
};