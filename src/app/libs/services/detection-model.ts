import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { DetectionModel, ParamSearch, ModelPicture, FormData } from "@/app/types/detection-model"
import { SelectOption, } from "@/app/types/select-option";

const mockData: DetectionModel[] = Array.from({ length: 5 }, (_, i) => ({
  modelId: i+1,
  modelName: `MD ${i+1}`,
  productId: `PT ${i+1}`,
  description: 'description description description',      
  statusId: (i+1 === 1) ? "Using" : (i+1 === 2) ? "Processing" : "Ready",
  function: "Color Check, Classification Type",
  currentStep: i % 2 === 0 ? 1 : 0,
  currentVersion: i % 2 === 0 ? 2 : 1,
  createdDate: new Date(),
  createdBy: 'admin',
  pdatedDate: null,
  updatedBy: null,
}))

const mockFormData = (id: number): FormData => {
  return {
    modelId: id,
    statusId: (id === 1) ? "Using" : (id === 2) ? "Processing" : "Ready",
    currentVersion: 1,
    currentStep: 2,
    functions: [1, 3, 5],
    modelName: `MODEL-${id}`,
    description: `Description ${id} `,
    trainDataset: 1,
    testDataset: 2,
    validationDataset: 3,
    epochs: 4,
    cameraId: `CAM1`,
    version: 1,
  };
};

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.modelName || item.modelName.toLowerCase().includes(param.modelName.toLowerCase())) &&
      // (!param.function || item.function?.toLowerCase().includes(param.function.toLowerCase())) &&
      // (!param.version || item.currentVersion === param.version) &&
      (!param.statusId || item.statusId === param.statusId)
    );
  });
  // const detectionModel = await api.get<DetectionModel[]>('/search')
};

export const detail = async (id: number) => {
  return mockFormData(id);
  // mockData.find(item => item.modelId === id);
  // return await apiClient<DetectionModel>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<DetectionModel>) => {
  return param;
  // const newData = await api.post<DetectionModel>('/create', param)
};

export const updateStep1 = async (param: Partial<FormData>) => {
  // modelId: id,
  // functions: [1, 2, 3],
  // currentStep: 1,
  // updateBy: 'admin',

  return param;
  // const updated = await api.put<FormData>(`/update/${param.id}`, param)
};

export const updateStep2 = async (param: Partial<FormData>) => {
  // modelId: id,
  // Picture: [
  //   name: ''
  //   file: File
  //   data: {}
  // ]
  // currentStep: 2,
  // updateBy: 'admin',

  return param;
  // const updated = await api.put<FormData>(`/update/${param.id}`, param)
};

export const updateStep3 = async (param: Partial<FormData>) => {
  // modelId: id,
  // modelName: '',
  // description: '',
  // trainDataset: 0,
  // testDataset: 0,
  // validationDataset: 0,
  // epochs: 0,
  // currentStep: 3,
  // updateBy: 'admin',

  return param;
  // const updated = await api.put<FormData>(`/update/${param.id}`, param)
};

export const updateStep4 = async (param: Partial<FormData>) => {
  // modelId: id,
  // cameraId: '',
  // Version: '',
  // currentStep: 4,
  // updateBy: 'admin',

  return param;
  // const updated = await api.put<FormData>(`/update/${param.id}`, param)
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

export const getModelNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.detection_model.suggest_model}?q=${q}`);
  } catch (error) {
    throw error;
  }  
};

export const getFunctionOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.detection_model.suggest_function}?q=${q}`);
  } catch (error) {
    throw error;
  }  
};


export const getFunctions = async () => {
  return [
    { label: "Color Check", value: "1" },
    { label: "Classification Type", value: "2" },
    { label: "Barcode Text Ocr", value: "3" },
    { label: "Missing Component Check", value: "4" },
    { label: "Object Counting", value: "5" },
    // { label: "Surface Defect Detection", value: "6" },
    // { label: "Dimension Check", value: "7" },
    // { label: "Uniform Color Check", value: "8" },
    // { label: "Print Quality Check", value: "9" },
    // { label: "Logo Detection", value: "10" },
    // { label: "Seal Integrity Check", value: "11" },
    // { label: "Shape Anomaly Check", value: "12" },
  ] as SelectOption[];
};

export const getCamera = async () => {
  return [
    { label: "CAM 1", value: "CAM1" },
    { label: "CAM 2", value: "CAM2" },
  ] as SelectOption[];
};

export const getPicture = async () => {
  return [
    { 
      id: 1, 
      refId: `1`,
      name: "photos-random-1.png", 
      url: "https://picsum.photos/800/600?random=1",
      // url: "/images/takumi-pic.png",
      // file:  await urlToFile("https://picsum.photos/800/600?random=1", "photos-random-1.png"),
      annotations: [
        {
          "id": "annotation-1748887785393",
          "type": "rect",
          "color": "#FF5722",
          "points": [
            116,
            95.125
          ],
          "startX": 116,
          "startY": 95.125,
          "width": 122,
          "height": 93,
          "radius": 0,
          "label": {
            "id": "1",
            "name": "defect"
          }
        },
        {
          "id": "annotation-1748887794637",
          "type": "circle",
          "color": "#00ff58",
          "points": [
            392,
            146.125
          ],
          "startX": 343,
          "startY": 265.125,
          "width": 0,
          "height": 0,
          "radius": 59.54829972383762,
          "label": {
            "id": "2",
            "name": "scratch"
          }
        },
        {
          "id": "annotation-1748887803991",
          "type": "rect",
          "color": "#ff00ef",
          "points": [
            581,
            101.125
          ],
          "startX": 581,
          "startY": 101.125,
          "width": 97,
          "height": 82,
          "radius": 0,
          "label": {
            "id": "2",
            "name": "dent"
          }
        }
      ]
    },
    // { id: 2, name: "photos-random-2.png", url: "https://picsum.photos/800/600?random=2" },
    // { id: 3, name: "photos-random-3.png", url: "https://picsum.photos/800/600?random=3" },
    // { id: 4, name: "photos-random-4.png", url: "https://picsum.photos/800/600?random=4" },
    // { id: 5, name: "photos-random-5.png", url: "https://picsum.photos/800/600?random=5" },
  ] as ModelPicture[];
};

async function urlToFile(url: string, filename: string, mimeType: string = 'image/png'): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
}