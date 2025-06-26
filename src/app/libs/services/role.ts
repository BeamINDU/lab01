import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { Role, ParamSearch } from "@/app/types/role"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.role.get}?${param}`);

    const mapData: Role[] = res?.roles?.map((item) => ({
      id: item.roleid,
      roleName: item.rolename,
      description: item.roledescription,
      status: item.rolestatus,
      statusName: item.rolestatus ? 'Active' : 'Inactive',
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

export const detail = async (id: number) => {
  try {
    return await api.get<Role>(`${API_ROUTES.role.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<Role>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.role.insert}`, param);
    return {
      ...param,
      id: res.roleid,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(res.createddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: number, param: Partial<Role>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.role.update}?roleid=${id}`, param);
    return {
      ...param,
      statusName: param.status ? 'Active' : 'Inactive',
      updatedDate: new Date(res.updateddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: number) => {
  try {
    return await api.delete<Role>(`${API_ROUTES.role.delete}?roleid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (uploadby: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('uploadby', uploadby);
    formData.append('file', file);

    const res = await api.upload<Role[]>(`${API_ROUTES.role.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getRoleOptions = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.role.get}?${param}`);

    const mapData: SelectOption[] = (res?.roles ?? [])
      .filter((item) => item.rolestatus )
      .map((item) => ({
        value: item.roleid,
        label: item.rolename,
    }));

    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getRoleNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.role.suggest_role_name}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}