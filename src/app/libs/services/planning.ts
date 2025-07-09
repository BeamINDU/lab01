import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Planning, ParamSearch } from "@/app/types/planning"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.planning.get, param);

    const mapData: Planning[] = res?.planning?.map((item) => ({
      id: item.planid,
      planId: item.planid,
      productId: item.prodid,
      lotNo: item.prodlot,
      lineId: item.prodline,
      quantity: item.quantity,
      startDate:item.startdatetime,
      endDate:item.enddatetime,
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
    return await api.delete<Planning>(`${API_ROUTES.planning.delete}?planid=${id}`);
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
      planId: `PLAN00${i+1}`,
      productId: `PRO0000${i+1}`,
      lotNo: `LOT000${i+1}`,
      lineId: `Line${i+1}`,
      quantity: i+1,
      startDate: new Date(),
      endDate: new Date(),
    }));
    return mockPlans;

    // const res =  await api.get<any>(`${API_ROUTES.planning.plans_confirmation}?${param}`);
    // const mapData: Planning[] = res?.planning?.map((item) => ({
    //   planId: item.planid,
    //   productId: item.prodid,
    //   lotNo: item.prodlot,
    //   lineId: item.prodline,
    //   quantity: item.quantity,
    //   startDate:item.startdatetime,
    //   endDate:item.enddatetime,
    // }));

    // return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const stopPlans = async (param?: ParamSearch) => {
  try {
    
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}