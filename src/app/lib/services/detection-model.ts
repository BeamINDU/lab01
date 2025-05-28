import { api } from '@/app/utils/api'
import type { DetectionModel, ParamSearch } from "@/app/types/detection-model"
import { SelectOption } from "@/app/types/select-option";

const mockData: DetectionModel[] = Array.from({ length: 20 }, (_, i) => ({
  modelId: i,
  modelName: `MD ${i+1}`,
  description: 'description description description',      
  version: i+1,
  cameraId: `CAM ${i+1}`,
  function: `FN ${i+1}`,
  status: `S ${i+1}`,
  trainDataset: 0,
  testDataset: 0,
  validationDataset: 0,
  epochs: 0, 
  createdDate: new Date(),
  createdBy: 'admin',
  pdatedDate: null,
  updatedBy: null,
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      // (!param.modelId || item.modelId.toLowerCase().includes(param.modelId.toLowerCase())) &&
      (!param.modelName || item.modelName.toLowerCase().includes(param.modelName.toLowerCase())) &&
      (!param.version || item.version === param.version) &&
      (!param.status || item.status?.toLowerCase().includes(param.status.toLowerCase())) &&
      (!param.function || item.function?.toLowerCase().includes(param.function.toLowerCase()))
    );
  });
  // const detectionModel = await api.get<DetectionModel[]>('/search')
};

export const detail = async (id: number) => {
  return mockData.find(item => item.modelId === id);
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

export const getFunctions = async () => {
  return [
    { label: "Color Check", value: "1" },
    { label: "Classification Type", value: "2" },
    { label: "Barcode Text Ocr", value: "3" },
    { label: "Surface Defect Detection", value: "4" },
    { label: "Missing Component Check", value: "51" },
    { label: "Object Counting", value: "6" },
    { label: "Dimension Check", value: "7" },
    { label: "Uniform Color Check", value: "8" },
    { label: "Print Quality Check", value: "9" },
    { label: "Logo Detection", value: "10" },
    { label: "Seal Integrity Check", value: "11" },
    { label: "Shape Anomaly Check", value: "12" },
  ] as SelectOption[];
};

export const getPicture = async () => {
  return [
    { label: "takumi-pic.png", value: "/images/takumi-pic.png" },
    { label: "logo-takumi.png", value: "/images/logo-takumi.png" },
  ] as SelectOption[];
};

export const getCamera = async () => {
  return [
    { label: "CAM 1", value: "1" },
    { label: "CAM 2", value: "2" },
  ] as SelectOption[];
};

export const getModelVersion = async () => {
  return [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
  ] as SelectOption[];
};

