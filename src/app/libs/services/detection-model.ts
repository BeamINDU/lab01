import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { DetectionModel, ParamSearch, FormData, ModelPicture } from "@/app/types/detection-model"
import { ClassName } from "@/app/types/class-name"
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

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.detection_model.get, param);

    const mapData: DetectionModel[] = res?.map((item) => ({
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

export const removeModel = async (modelid: number) => {
   try {
    return await api.delete<DetectionModel>(`${API_ROUTES.detection_model.delete_model}?modelid=${modelid}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const removeImage = async (imageid: number) => {
   try {
    return await api.delete<DetectionModel>(`${API_ROUTES.detection_model.delete_image}?imageid=${imageid}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const duplicateModel = async (modelversionid: number, createdBy: string) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.detection_model.duplicate}`,{
      modelVersionId: modelversionid,
      createdBy: createdBy
    });
    return res.modelversionid;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateStep1 = async (modelversionid: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step1}?modelversionid=${modelversionid}`, {
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

export const updateStep2 = async (modelversionid: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step2}?modelversionid=${modelversionid}`, {
      modelId: param.modelId,
      modelName: param.modelName,
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

export const updateStep3 = async (modelversionid: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step3}?modelversionid=${modelversionid}`, {
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

export const updateStep4 = async (modelversionid: number, param: Partial<FormData>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.detection_model.update_step4}?modelversionid=${modelversionid}`, {
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

export const annotateImage = async (
  param: {
    imageId?: number;
    modelVersionId: number;
    modelId: number;
    updatedBy: string;
    annotate: any;
    file?: File;
    size: number;
    width: number;
    height: number;
  }
) => {
  try {
    const formData = new FormData();

    if (param.imageId) {
      formData.append('imageid', param.imageId.toString());
    }

    if (param.imageId === undefined && param.file) {
      formData.append('file', param.file);
    }

    formData.append('modelversionid', param.modelVersionId.toString());
    formData.append('modelid', param.modelId.toString());
    formData.append('updatedby', param.updatedBy);
    formData.append('annotate', param.annotate);
    formData.append('size', param.size.toString());
    formData.append('width', param.width.toString());
    formData.append('height', param.height.toString());

    const res = await api.upload<any>(`${API_ROUTES.detection_model.upload_image_file}`, formData);
    
    return {
      ...param,
      id: res.imageid,
      name: res.imagename,
      file: res.file,
      url: `${baseURL}/${res.imagepath.replace(/\\/g, "/")}`,
      annotate: JSON.parse(param.annotate),
      refId: res.imageid.toString(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getModelFunction = async (modelversionid: number) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.model_function}?modelversionid=${modelversionid }`);
    const functionIds = res?.map((item) => item.functionid);
    return functionIds;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getModelVersion = async (modelversionid: number) => {
  try {
    const res =  await api.get<any>(`${API_ROUTES.detection_model.model_version}?modelversionid=${modelversionid }`);
    return {
      modelVersionId: res.modelversionid,
      modelId: res.modelid,
      statusId: res.modelstatus,
      currentVersion: res.versionno,
      currentStep: res.currentstep,
      modelName: res.modelname,
      description: res.modeldescription,
      // productId: res.prodid,
      trainDataset: res.trainpercent,
      testDataset: res.testpercent,
      validationDataset: res.valpercent,
      epochs: res.epochs,
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
      label: item.versionno,
      value: String(item.modelversionid),
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

export const getImage = async (modelversionid: number) => {
  try {
    const res = await api.get<any>(`${API_ROUTES.detection_model.model_image}?modelversionid=${modelversionid }`);
    const mapData: ModelPicture[] = res?.map((item) => {
      const relativePath = item.imagepath.replace(/\\/g, "/");
      const imageUrl = `${baseURL}/${relativePath}`;
      return {
          id: item.imageid,
          name: item.imagename,
          size: item.size,
          width: item.width,
          height: item.height,
          file: item.file,
          url: imageUrl,
          annotate: item.annotate,
          refId: item.imageid.toString(),
      };
    });    
    return mapData;
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

export const getLabelClass = async (modelVersionId: number) => {
  try {
    const res = await api.get<any>(`${API_ROUTES.detection_model.label_class}?modelversionid=${modelVersionId}`);
    const mapData: ClassName[] = res?.map((item) => ({
      name: item.classname,
      id: item.classid,
    }));
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const updateLabelClass = async (modelVersionId, param: ClassName[]) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.detection_model.update_label_class}?modelversionid=${modelVersionId}`, param);
    const mapData: ClassName[] = res?.map((item) => ({
      name: item.classname,
      id: item.classid,
    }));
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const deleteLabelClass = async (classid: number) => {
  try {
    return await api.delete<any>(`${API_ROUTES.detection_model.delete_label_class}?classid=${classid}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

// export const detail = async (modelversionid: number, modelid: number) => {
//   try {
//     const res =  await api.get<any>(`${API_ROUTES.detection_model.detail}?modelversionid=${modelversionid}&modelid=${modelid}`);
//     return {
//       modelVersionId: res.modelversionid,
//       modelId: res.modelid,
//       statusId: res.modelstatus,
//       currentVersion: res.versionno,
//       currentStep: res.currentstep,
//       productId: res.prodid,
//       modelName: res.modelname,
//       description: res.modeldescription,
//       functions: res.functionids,
//       trainDataset: res.trainpercent,
//       testDataset: res.testpercent,
//       validationDataset: res.valpercent,
//       epochs: res.epochs
//     };
//   } catch (error) {
//     throw new Error(extractErrorMessage(error));
//   }  
// };

// export const uploadBase64Image = async (modelversionid: number, param: Partial<FormData>) => {
//   try {
//     const res = await api.post<any>(`${API_ROUTES.detection_model.upload_base64_image}`, {
//       modelVersionId: modelversionid,
//       productId: param.productId,
//       cameraId: param.cameraId,
//       modelId: param.modelId,
//       updatedBy: param.updatedBy,
//       annotate: param.annotate,
//       filename: param.fileName,
//       base64: param.base64,
//     });
//     return {
//       ...param,
//       id: res.imageid,
//       name: res.imagename,
//       file: res.file,
//       url:  `${baseURL}/${res.imagepath.replace(/\\/g, "/")}`,
//       annotations: param.annotate,
//       refId: res.imageid
//     };
//   } catch (error) {
//     throw new Error(extractErrorMessage(error));
//   } 
// };
