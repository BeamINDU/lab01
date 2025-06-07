import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.report_defect.get}?${param}`);

    const mapData: ReportDefect[] = res?.defect_summary
      ?.map((item) => ({
        runningNo: item.summaryid,
        lotNo: item.prodlot,
        productType: item.prodtype,
        defectType: item.defecttype,
        total: item.totalprod,
        ok: item.totalok,
        ng: item.totalng,
    }));

    return mapData; 
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<ReportDefect>(`${API_ROUTES.report_defect.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const getLotNoOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.report_defect.suggest_lotno}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}
