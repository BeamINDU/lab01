import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Planning, ParamSearch } from "@/app/types/planning"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.planning.get}?${param}`);
    return res;
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<Planning>(`${API_ROUTES.planning.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};


export const create = async (param: Partial<Planning>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.planning.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<Planning>) => {
  try {
    const res = await api.put<Planning>(`${API_ROUTES.planning.update}?planId=${param.planId}`, param);
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
    return await api.delete<Planning>(`${API_ROUTES.planning.delete}?planId=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Planning[]>(`${API_ROUTES.planning.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};

export const getPlanIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_planid}?q=${q}`);
  } catch (error) {
    throw error;
  }  
}

export const getLotNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_lotno}?q=${q}`);
  } catch (error) {
    throw error;
  }  
}

export const getLineNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_lineno}?q=${q}`);
  } catch (error) {
    throw error;
  }  
}
