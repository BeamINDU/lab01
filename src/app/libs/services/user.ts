import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { User, ParamSearch } from "@/app/types/user"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.user.get}?${param}`);

    const mapData: User[] = res?.users?.map((item) => ({
      id: item.userid,
      userId: item.userid,
      username: item.username,
      firstname: item.ufname,
      lastname: item.ulname,
      location: item.username,
      password: item.upassword,
      email: item.email,
      status: item.userstatus,
      statusName: item.userstatus ? 'Active' : 'Inactive',
      roleName: '',
      userRoles: [],
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
    return await api.get<User>(`${API_ROUTES.user.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<User>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.user.insert}`, param);
    return {
      ...param,
      id: param.userId,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(res.createddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<User>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.user.update}?userid=${id}`, param);
    return {
      ...param,
      id: param.userId,
      statusName: param.status ? 'Active' : 'Inactive',
      updatedDate: new Date(res.updateddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<User>(`${API_ROUTES.user.delete}?userid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<User[]>(`${API_ROUTES.user.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getUserIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.user.suggest_userid}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getUserNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.user.suggest_username}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}