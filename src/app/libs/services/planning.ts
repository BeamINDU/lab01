import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Planning, ParamSearch } from "@/app/types/planning"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';
import axios, { AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL;

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

export const download = async (param?: ParamSearch) => { 
  try {
    const res = await api.get(API_ROUTES.planning.export, param, {
      responseType: 'blob',
    });
    return res;
    
    // const url = `${baseURL}${API_ROUTES.planning.export}`;
    // const response = await axios.get(url, {
    //   params: param,
    //   responseType: 'blob',
    // });
    // const blob = response.data;
    // return blob;
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
      updateddate: new Date(res.updateddate ?? Date.now()),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string, updatedby: string) => {
  try {
    return await api.delete<Planning>(`${API_ROUTES.planning.delete}?planid=${id}&updatedby=${updatedby}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const start = async (param: Planning) => {
  try {
    const res = await api.put<Planning>(API_ROUTES.planning.start, { 
      planid: param.planid, 
      prodid: param.prodid,
      prodlot: param.prodlot,
      prodline: param.prodline,
      startby: param.updatedby
    });
    return {
      ...param,
      seq_no: res.seq_no,
      actualstartdatetime: res.actualstartdatetime,
      actualenddatetime: null,
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const stop = async (param: Planning) => {
  try {
    const res = await api.put<Planning>(API_ROUTES.planning.stop, { 
      planid: param.planid, 
      prodid: param.prodid,
      prodlot: param.prodlot,
      prodline: param.prodline,
      seq_no: param.seq_no,
      stopby: param.updatedby
    });
    return {
      ...param,
      actualenddatetime: res.actualenddatetime,
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


export const startFlow = async (planid: string) => {
  try {
    const res = await axios.post<any>(`${process.env.NEXT_PUBLIC_START_FLOW_URL}/${API_ROUTES.start_flow}`, { planid: planid, action: 'start' });
    return res.status === 200 ? 'ok' : 'error';
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const stopFlow = async (planid: string) => {
  try {
    const res = await axios.post<any>(`${process.env.NEXT_PUBLIC_START_FLOW_URL}/${API_ROUTES.start_flow}`, { planid: planid, action: 'stop' });
    return res.status === 200 ? 'ok' : 'error';
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};
