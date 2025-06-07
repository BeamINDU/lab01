import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Transaction, ParamSearch } from "@/app/types/transaction"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.transaction.get}?${param}`);
    return res;
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<Transaction>(`${API_ROUTES.transaction.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const getLotNoOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.transaction.suggest_lotno}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}
