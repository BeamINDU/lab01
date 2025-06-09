import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { Camera, ParamSearch } from "@/app/types/camera"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.camera.get}?${param}`);

    const mapData: Camera[] = res?.cameras
      ?.filter((item) => !item.isdeleted)
      ?.map((item) => ({
        cameraId: item.cameraid,
        cameraName: item.cameraname,
        location: item.cameralocation,
        status: item.camerastatus,
        createdDate: item.createddate,
        createdBy: item.createdby,
        updatedDate: item.updateddate,
        updatedBy: item.updatedby,
    }));
    
    return mapData;
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<Camera>(`${API_ROUTES.camera.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const create = async (param: Partial<Camera>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.camera.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<Camera>) => {
  try {
    const res = await api.put<Camera>(`${API_ROUTES.camera.update}?cameraId=${param.cameraId}`, param);
    return {
      ...param,
      updatedDate: new Date(),
    };
  } catch (error) {
    throw error;
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<Camera>(`${API_ROUTES.camera.delete}?cameraId=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Camera[]>(`${API_ROUTES.camera.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};

export const getCameraIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.camera.suggest_camera_id}?q=${q}`);
  } catch (error) {
    throw error;
  }  
};

export const getCameraNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.camera.suggest_camera_name}?q=${q}`);
  } catch (error) {
    throw error;
  }  
}

export const getCameraLocationOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.camera.suggest_location}?q=${q}`);
  } catch (error) {
    throw error;
  }  
}
