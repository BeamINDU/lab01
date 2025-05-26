import { api } from '@/app/utils/api'
import type { DefectType, ParamSearch } from "@/app/types/defect-type"

const mockData: DefectType[] = Array.from({ length: 20 }, (_, i) => ({
  defectTypeId: `DT${i+1}`,
  defectTypeName: `DTName${i+1}`,
  description: 'description description description description',
  createdDate: new Date(),
  createdBy: 'admin',
  pdatedDate: null,
  updatedBy: null,
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.defectTypeId || item.defectTypeId.toLowerCase().includes(param.defectTypeId.toLowerCase())) &&
      (!param.defectTypeName || item.defectTypeName.toLowerCase().includes(param.defectTypeName.toLowerCase()))
    );
  });
  // const defectType = await api.get<DefectType[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.defectTypeId === id);
  // return await apiClient<DefectType>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<DefectType>) => {
  return param;
  // const newData = await api.post<DefectType>('/create', param)
};

export const update = async (param: Partial<DefectType>) => {
  return param;
  // const updated = await api.put<DefectType>(`/update/${param.id}`, param)
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