import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { Role, ParamSearch } from "@/app/types/role"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.role.get}?${param}`);
    return res;
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<Role>(`${API_ROUTES.role.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const create = async (param: Partial<Role>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.role.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<Role>) => {
  try {
    const res = await api.put<Role>(`${API_ROUTES.role.update}?roleId=${param.roleId}`, param);
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
    return await api.delete<Role>(`${API_ROUTES.role.delete}?roleId=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Role[]>(`${API_ROUTES.role.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};


export const getRoleIdOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.role.suggest_role_id}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
};

export const getRoleNameOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.role.suggest_role_name}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}