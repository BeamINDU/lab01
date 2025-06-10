import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Planning, ParamSearch } from "@/app/types/planning"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.planning.get}?${param}`);

    // const mapData: Planning[] = res?.planning?.map((item) => ({
    //   id: item.planid,
    //   planId: item.planid,
    //   productId: item.productid,
    //   lotNo: item.lotno,
    //   lineId: item.lineid,
    //   quantity: item.quantity,
    //   startDate:item.startdate,
    //   endDate:item.enddate,
    //   status: item.prodstatus,
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
    return await api.get<Planning>(`${API_ROUTES.planning.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};


export const create = async (param: Partial<Planning>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.planning.insert}`, param);
    return {
      ...param,
      id: param.planId,
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<Planning>) => {
  try {
    const res = await api.put<Planning>(`${API_ROUTES.planning.update}?planid=${id}`, param);
    return {
      ...param,
      id: param.planId,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<Planning>(`${API_ROUTES.planning.delete}?planId=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Planning[]>(`${API_ROUTES.planning.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getPlanIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_planid}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}

export const getLotNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_lotno}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}

export const getLineNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_lineno}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}
