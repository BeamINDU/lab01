import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.report_defect.get}?${param}`);

    const mapData: ReportDefect[] = res?.defect_summary?.map((item) => ({
      runningNo: item.summaryid,
      lotNo: item.prodlot,
      productTypeName: item.prodtype,
      defectTypeName: item.defecttype,
      total: item.totalprod,
      ok: item.totalok,
      ng: item.totalng,
    }));

    return mapData; 
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
