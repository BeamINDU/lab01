import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { Role, ParamSearch } from "@/app/types/role"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.role.get}?${param}`);

    // const mapData: Role[] = res?.roles?.map((item) => ({
    //   id: item.roleid,
    //   RoleId: item.roleid,
    //   RoleIName: item.rolename,
    //   description: item.proddescription,
    //   status: item.prodstatus,
    //   statusName: item.camerastatus ? 'Active' : 'Inactive',
    //   createdDate: item.createddate,
    //   createdBy: item.createdby,
    //   updatedDate: item.updateddate,
    //   updatedBy: item.updatedby,
    // }));

    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (id: string) => {
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
      id: param.roleId,
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<Role>) => {
  try {
    const res = await api.put<Role>(`${API_ROUTES.role.update}?roleId=${id}`, param);
    return {
      ...param,
      id: param.roleId,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<Role>(`${API_ROUTES.role.delete}?roleId=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Role[]>(`${API_ROUTES.role.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};


export const getRoleIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.role.suggest_role_id}?q=${q}`);
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