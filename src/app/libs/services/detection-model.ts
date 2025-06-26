import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { DetectionModel, ParamSearch, ModelPicture, FormData } from "@/app/types/detection-model"
import { SelectOption, } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

// const mockData: DetectionModel[] = Array.from({ length: 5 }, (_, i) => ({
//   modelId: i+1,
//   modelName: `MD ${i+1}`,
//   productId: `PT ${i+1}`,
//   description: 'description description description',      
//   statusId: (i+1 === 1) ? "Using" : (i+1 === 2) ? "Processing" : "Ready",
//   function: "Color Check, Classification Type",
//   currentStep: i % 2 === 0 ? 1 : 0,
//   currentVersion: i % 2 === 0 ? 2 : 1,
//   createdDate: new Date(),
//   createdBy: 'admin',
//   pdatedDate: null,
//   updatedBy: null,
// }))

// const mockFormData = (id: number): FormData => {
//   return {
//     modelId: id,
//     statusId: (id === 1) ? "Using" : (id === 2) ? "Processing" : "Ready",
//     currentVersion: 1,
//     currentStep: 2,
//     functions: [1, 3, 5],
//     modelName: `MODEL-${id}`,
//     description: `Description ${id} `,
//     trainDataset: 1,
//     testDataset: 2,
//     validationDataset: 3,
//     epochs: 4,
//     cameraId: `CAM1`,
//     version: 1,
//   };
// };

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.get}?${param}`);

    const mapData: DetectionModel[] = res?.data?.map((item) => ({
      modelVersionId: item.modelversionid,
      modelId: item.modelid,
      productId: item.prodid,
      modelName: item.modelname,
      description: item.modeldescription,
      function: item.functionname,
      statusId: item.modelstatus,
      currentVersion: item.versionno,
      currentStep: item.currentstep,
      createdDate: item.createddate,
      createdBy: item.createdby,
      updatedDate: item.updateddate,
      updatedBy: item.updatedby,
    }));
    
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (modelversionid: number, modelid: number) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.detail}?modelversionid=${modelversionid}&modelid=${modelid}`);
    return {
      modelVersionId: res.modelversionid,
      modelId: res.modelid,
      statusId: res.modelstatus,
      currentVersion: res.versionno,
      currentStep: res.currentstep,
      productId: res.prodid,
      modelName: res.modelname,
      description: res.modeldescription,
      functions: res.functionids,
      trainDataset: res.trainpercent,
      testDataset: res.testpercent,
      validationDataset: res.valpercent,
      epochs: res.epochs
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<DetectionModel>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.detection_model.insert}`, {
      modelName: param.modelName,
      description: param.description,
      ProductId: param.productId,
      createdBy: param.createdBy
    });

    return {
      ...param,
      modelVersionId: res.modelversionid,
      modelId: res.modelid,
      productId: res.prodid,
      modelName: res.modelname,
      description: res.modeldescription,
      function: res.functionname,
      currentVersion: res.versionno,
      statusId: res.modelstatus,
      currentStep: res.currentstep,
      createdBy: res.createdby,
      createdDate: res.createddate,
      updatedBy: null,
      updatedDate: null
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const remove = async (modelid: number) => {
   try {
    return await api.delete<DetectionModel>(`${API_ROUTES.detection_model.delete}?modelid=${modelid}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const updateStep1 = async (modelVersioniId: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step1}?modelversionid=${modelVersioniId}`, {
      modelId: param.modelId,
      functions: param.functions,
      updatedBy: param.updatedBy
    });
    return {
      ...param,
      modelVersionId: res.modelversionid,
      currentVersion: res.versionno,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep2 = async (modelVersioniId: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step2}?modelversionid=${modelVersioniId}`, {
      modelId: param.modelId,
      modelName: param.modelName,
      ProductId: param.productId,
      cameraId: param.cameraId,
      description: param.description,
      trainDataset : param.trainDataset,
      testDataset : param.testDataset,
      validationDataset : param.validationDataset,
      epochs : param.epochs,
      updatedBy: param.updatedBy
    });
    return {
      ...param,
      modelVersionId: res.modelversionid,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep3 = async (modelVersioniId: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step3}?modelversionid=${modelVersioniId}`, {
      modelId: param.modelId,
      updatedBy: param.updatedBy
    });
    return {
      ...param,
      modelVersionId: res.modelversionid,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep4 = async (modelVersioniId: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step4}?modelversionid=${modelVersioniId}`, {
      modelId: param.modelId,
      version: param.version,
      updatedBy: param.updatedBy
    });
    return {
      ...param,
      modelVersionId: res.modelversionid,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const annotateImage = async (modelVersioniId: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.annotate_image}`, {
      modelVersioniId: modelVersioniId,
      productId: param.productId,
      cameraId: param.cameraId,
      modelId: param.modelId,
      filename: param.fileName,
      base64: param.base64,
      annotate: param.annotate,
      updatedBy: param.updatedBy
    });
    return {
      ...param,
      modelVersionId: res.modelversionid,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getModelFunction = async (modelversionId: number) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.model_function}?modelversionid=${modelversionId }`);
    const functionIds = res?.map((item) => item.functionid);
    return functionIds;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getModelVersion = async (modelversionId: number) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.model_version}?modelversionid=${modelversionId }`);
    return {
      modelVersionId: res.modelversionid,
      modelId: res.modelid,
      statusId: res.modelstatus,
      currentVersion: res.versionno,
      currentStep: res.currentstep,
      modelName: res.modelname,
      productId: res.prodid,
      description: res.modeldescription,
      trainDataset: res.trainpercent,
      testDataset: res.testpercent,
      validationDataset: res.valpercent,
      epochs: res.epochs,
      cameraId: res.cameraid
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getModelCamera = async (modelversionid: number) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.model_camera}?modelversionid=${modelversionid }`);
    return {
      modelVersionId: res.modelversionid,
      modelId: res.modelid,
      cameraId: res.cameraid,
      productId: res.prodid,
      applieddate: res.applieddate,
      appliedby: res.appliedby,
      status: res.status,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getFunctions = async () => {
  try {
    const res = await api.get<any>(`${API_ROUTES.detection_model.function}`);
    const mapData: SelectOption[] = res?.map((item) => ({
      label: item.functionname,
      value: item.functionid,
    }));
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getVersion = async (modelid : number) => {
  try {
    const res = await api.get<any>(`${API_ROUTES.detection_model.version}?modelid=${modelid}`);
    const mapData: SelectOption[] = res?.map((item) => ({
      label: item,
      value: item,
    }));
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getCamera = async () => {
  try {
    const res = await api.get<any>(`${API_ROUTES.camera.get}`);
    const mapData: SelectOption[] = res
      ?.filter(item => item.camerastatus === true)
      ?.map((item) => ({
        label: item.cameraid,
        value: item.cameraid,
    }));                    
    return mapData;
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
        // file:  await urlToFile("https://picsum.photos/800/600?random=1", "photos-random-1.png"),
        annotations: [
          {
            "id": "annotation-1748887785393",
            "type": "rectangle",
            "color": "#FF5722",
            "startX": 116,
            "startY": 95.125,
            "width": 122,
            "height": 93,
            "radius": 0,
            "points": [],
            "label": {
              "id": "1",
              "name": "defect"
            }
          },
          {
            "id": "annotation-1748887794637",
            "type": "circle",
            "color": "#00ff58",
            "startX": 343,
            "startY": 265.125,
            "width": 0,
            "height": 0,
            "radius": 59.54829972383762,
            "points": [],
            "label": {
              "id": "2",
              "name": "scratch"
            }
          }
        ]
      },
    ] as ModelPicture[];
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