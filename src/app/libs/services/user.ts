import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { User, ParamSearch } from "@/app/types/user"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.user.get}?${param}`);

    const mapData: User[] = res?.users
      ?.filter((item) => !item.isdeleted)
      ?.map((item) => ({
        userId: item.userid,
        username: item.username,
        firstname: item.ufname,
        lastname: item.ulname,
        location: item.username,
        password: item.upassword,
        email: item.email,
        roleName: item.roleid,
        status: item.userstatus,
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
    return await api.get<User>(`${API_ROUTES.user.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const create = async (param: Partial<User>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.user.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<User>) => {
  try {
    const res = await api.put<User>(`${API_ROUTES.user.update}?userId=${param.userId}`, param);
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
    return await api.delete<User>(`${API_ROUTES.user.delete}?userId=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<User[]>(`${API_ROUTES.user.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};

export const getUserIdOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.user.suggest_userid}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
};

export const getUserNameOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.user.suggest_username}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}