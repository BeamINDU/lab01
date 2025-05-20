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

const removeTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStartDate = param.dateFrom ? removeTime(new Date(param.dateFrom)) : undefined;
  const parsedEndDate = param.dateTo ? removeTime(new Date(param.dateTo)) : undefined;

  return mockData.filter(item => {
    return (
      (parsedStartDate ? removeTime(item.startDate) >= parsedStartDate : true) &&
      (parsedEndDate ? removeTime(item.endDate) <= parsedEndDate : true) &&
      (!param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase())) &&
      (!param.lotNo || item.lotNo.toLowerCase().includes(param.lotNo.toLowerCase())) &&
      (!param.lineId || item.lineId.toLowerCase().includes(param.lineId.toLowerCase()))
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