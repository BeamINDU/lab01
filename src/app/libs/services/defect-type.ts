import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { DefectType, ParamSearch } from "@/app/types/defect-type"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.defect_type.get}?${param}`);
    return res;
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<DefectType>(`${API_ROUTES.defect_type.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const create = async (param: Partial<DefectType>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.defect_type.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<DefectType>) => {
  try {
    const res = await api.put<DefectType>(`${API_ROUTES.defect_type.update}?defectTypeId=${param.defectTypeId}`, param);
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
    return await api.delete<DefectType>(`${API_ROUTES.defect_type.delete}?defectTypeId=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<DefectType[]>(`${API_ROUTES.defect_type.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};

export const getDefectTypeIdOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.defect_type.suggest_defecttype_id}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
};

export const getDefectTypeNameOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.defect_type.suggest_defecttype_name}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}

