import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { Camera, ParamSearch } from "@/app/types/camera"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.camera.get}?${param}`);

    const mapData: Camera[] = res?.cameras?.map((item) => ({
        id: item.cameraid,
        cameraId: item.cameraid,
        cameraName: item.cameraname,
        location: item.cameralocation,
        status: item.camerastatus,
        statusName: item.camerastatus ? 'Active' : 'Inactive',
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

export const detail = async (id: string) => {
  try {
    return await api.get<Camera>(`${API_ROUTES.camera.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async ( param: Partial<Camera>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.camera.insert}`, param);
    return {
      ...param,
      id: param.cameraId,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(res.createddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<Camera>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.camera.update}?cameraid=${id}`, param);
    return {
      ...param,
      id: param.cameraId,
      statusName: param.status ? 'Active' : 'Inactive',
      updatedDate: new Date(res.updateddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<Camera>(`${API_ROUTES.camera.delete}?cameraid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Camera[]>(`${API_ROUTES.camera.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getCameraIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.camera.suggest_camera_id}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getCameraNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.camera.suggest_camera_name}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}

export const getCameraLocationOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.camera.suggest_location}?q=${q}`);
    
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}
