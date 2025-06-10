import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { DetectionModel, ParamSearch, ModelPicture, FormData } from "@/app/types/detection-model"
import { SelectOption, } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

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
  try {
    return mockData;

    // const res =  await api.get<any>(`${API_ROUTES.detection_model.get}?${param}`);

    // const mapData: DetectionModel[] = res?.models?.map((item) => ({
    //   id: item.modelId,
    //   modelId: item.modelId,
    //   modelName: item.modelname,
    //   productId: item.productid,
    //   description: item.description,
    //   function: item.function,
    //   statusId: item.statusid,
    //   currentVersion: item.currentversion,
    //   currentStep: item.currentstep,
    //   createdDate: item.createddate,
    //   createdBy: item.createdby,
    //   updatedDate: item.updateddate,
    //   updatedBy: item.updatedby,
    // }));
    
    // return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (id: number) => {
  try {
    return mockFormData(id);

    // return await api.get<ModelPicture>(`${API_ROUTES.detection_model.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<DetectionModel>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.detection_model.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const updateStep1 = async (id: number, param: Partial<FormData>) => {
  try {
    // modelId: id,
    // functions: [1, 2, 3],
    // currentStep: 1,
    // updateBy: 'admin',
    
    const res = await api.put<FormData>(`${API_ROUTES.defect_type.update}?modelid=${id}`, param);
    return {
      ...param,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep2 = async (id: number, param: Partial<FormData>) => {
  try {
    // modelId: id,
    // Picture: [
    //   name: ''
    //   file: File
    //   data: {}
    // ]
    // currentStep: 2,
    // updateBy: 'admin',

    const res = await api.put<FormData>(`${API_ROUTES.detection_model.update}?modelid=${id}`, param);
    return {
      ...param,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep3 = async (id: number, param: Partial<FormData>) => {
  try {
    // modelId: id,
    // modelName: '',
    // description: '',
    // trainDataset: 0,
    // testDataset: 0,
    // validationDataset: 0,
    // epochs: 0,
    // currentStep: 3,
    // updateBy: 'admin',

    const res = await api.put<FormData>(`${API_ROUTES.detection_model.update}?modelid=${id}`, param);
    return {
      ...param,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep4 = async (id: number, param: Partial<FormData>) => {
  try {
    // modelId: id,
    // cameraId: '',
    // Version: '',
    // currentStep: 4,
    // updateBy: 'admin',

    const res = await api.put<FormData>(`${API_ROUTES.detection_model.update}?modelid=${id}`, param);
    return {
      ...param,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: number) => {
   try {
    return await api.delete<DetectionModel>(`${API_ROUTES.detection_model.delete}?modelid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getModelNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.detection_model.suggest_model}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getFunctionOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.detection_model.suggest_function}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getFunctions = async () => {
  try {
    // return await api.get<Function>(`${API_ROUTES.detection_model.function}`);
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
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getPicture = async () => {
  try {
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
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getCamera = async () => {
  try {
    return [
      { label: "CAM 1", value: "CAM1" },
      { label: "CAM 2", value: "CAM2" },
    ] as SelectOption[];
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};
