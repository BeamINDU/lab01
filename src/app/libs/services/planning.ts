import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Planning, ParamSearch } from "@/app/types/planning"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.planning.get, param);
    const mapData: Planning[] = res?.items?.map((item) => ({
      ...item,
      id: item.planid,
    })); 
     return { total:res?.total, items: mapData }; 
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
      id: param.planid,
      prodname: res.prodname,
      createddate: new Date(res.createddate),
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
      id: param.planid,
      prodname: res.prodname,
      updateddate: new Date(res.updateddate ?? Date.now()),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<Planning>(`${API_ROUTES.planning.delete}?planid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const start = async (param: Planning) => {
  try {
    const res = await api.put<Planning>(API_ROUTES.planning.start, { planid: param.planid, updatedby: param.updatedby });
    return {
      ...param,
      actualstartdatetime: res.actualstartdatetime,
      updateddate: new Date(res.updateddate ?? Date.now()),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const stop = async (param: Planning) => {
  try {
    const res = await api.put<Planning>(API_ROUTES.planning.stop, { planid: param.planid, updatedby: param.updatedby });
    return {
      ...param,
      actualenddatetime: res.actualenddatetime,
      updateddate: new Date(res.updateddate ?? Date.now()),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (uploadby: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('uploadby', uploadby);
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
    return await api.get<SelectOption[]>(`${API_ROUTES.planning.suggest_lineid}?q=${q}`);
    
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}

export const startPlansConfirmation = async (param?: ParamSearch) => { 
  try {
    const mockPlans: Planning[] = Array.from({ length: 5000 }, (_, i) => ({
      planid: `PLAN00${i+1}`,
      prodid: `PRO0000${i+1}`,
      prodname: `NAME${i+1}`,
      prodlot: `LOT000${i+1}`,
      prodline: `Line${i+1}`,
      quantity: i+1,
      startdatetime: new Date(),
      enddatetime: new Date(),
      actualstartdatetime: new Date(),
      actualenddatetime: new Date(),
    }));
    return mockPlans;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};
