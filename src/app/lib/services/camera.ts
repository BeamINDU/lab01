import { api } from '@/app/utils/api'
import type { Camera, ParamSearch } from "@/app/types/camera"

const mockData: Camera[] = Array.from({ length: 20 }, (_, i) => ({
  cameraId: `CAM${i+1}`,
  cameraName: `Name${i+1}`,
  location: i % 2 === 0 ? 'location1' : 'location2',
  status: i % 2 === 0 ? 1 : 0,
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: null,
  updatedBy: null,
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined  : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.cameraId || item.cameraId.toLowerCase().includes(param.cameraId.toLowerCase())) &&
      (!param.cameraName || item.cameraName.toLowerCase().includes(param.cameraName.toLowerCase())) &&
      (!param.location || item.location.toLowerCase().includes(param.location.toLowerCase())) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
  // const camera = await api.get<Camera[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.cameraId === id);
  // return await apiClient<Camera>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<Camera>) => {
  return param;
  // const newData = await api.post<Camera>('/create', param)
};

export const update = async (param: Partial<Camera>) => {
  return param;
  // const updated = await api.put<Camera>(`/update/${param.id}`, param)
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