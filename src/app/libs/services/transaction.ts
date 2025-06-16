import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { Transaction, ParamSearch } from "@/app/types/transaction"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.transaction.get}?${param}`);
    
    const mapData: Transaction[] = res?.transaction?.map((item) => ({
      runningNo: item.runningno,
      startDate: item.startdate,
      endDate: item.enddate,
      lotNo: item.lotno,
      productId: item.prodid,
      quantity: item.quantity,
      createdDate: item.createddate,
      createdBy: item.createdby,
      updatedDate: item.updateddate,
      updatedBy: item.updatedby,
    }));
      
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getLotNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.transaction.suggest_lotno}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}
