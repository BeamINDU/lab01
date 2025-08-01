import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';
import axios, { AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.report_defect.get, param);
    return res; 
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const download = async (param?: ParamSearch) => { 
  try {
    const res = await api.get(API_ROUTES.report_defect.export, param, {
      responseType: 'blob',
    });
    return res; 
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getLotNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.report_defect.suggest_lotno}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}
