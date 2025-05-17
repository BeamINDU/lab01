import { api } from '@/app/utils/api'
import type { DetectionModel, ParamSearch } from "@/app/types/detection-model"

const mockData: DetectionModel[] = Array.from({ length: 20 }, (_, i) => ({
  id: i+1,
  modelName: `M ${i+1}`,      
  version: `V ${i+1}`,    
  status: `S ${i+1}`,           
  function: `FN ${i+1}`,              
  feature: `F ${i+1}`,
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: new Date(),
  updatedBy: 'admin',
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.modelName || item.modelName.includes(param.modelName)) &&
      (!param.version || item.version.includes(param.version)) &&
      (!param.status || item.status.toLowerCase().includes(param.status.toLowerCase())) &&
      (!param.function || item.function.toLowerCase().includes(param.function.toLowerCase())) &&
      (!param.feature || item.feature.toLowerCase().includes(param.feature.toLowerCase()))
    );
  });
  // const detectionModel = await api.get<DetectionModel[]>('/search')
};

export const detail = async (id: number) => {
  return mockData.find(item => item.id === id);
  // return await apiClient<DetectionModel>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<DetectionModel>) => {
  return param;
  // const newData = await api.post<DetectionModel>('/create', param)
};

export const update = async (param: Partial<DetectionModel>) => {
  return param;
  // const updated = await api.put<DetectionModel>(`/update/${param.id}`, param)
};

export const remove = async (id: number) => {
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