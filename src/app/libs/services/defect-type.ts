import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { DefectType, ParamSearch } from "@/app/types/defect-type"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.defect_type.get}?${param}`);

    const mapData: DefectType[] = res?.defect_types?.map((item) => ({
      id: item.defectid,
      defectTypeId: item.defectid,
      defectTypeName: item.defecttype,
      description: item.defectdescription,
      status: item.defectstatus,
      statusName: item.defectstatus ? 'Active' : 'Inactive',
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
    return await api.get<DefectType>(`${API_ROUTES.defect_type.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<DefectType>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.defect_type.insert}`, param);
    return {
      ...param,
      id: param.defectTypeId,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(res.createddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<DefectType>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.defect_type.update}?defectid=${id}`, param);
    return {
      ...param,
      id: param.defectTypeId,
      statusName: param.status ? 'Active' : 'Inactive',
      updatedDate: new Date(res.updateddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<DefectType>(`${API_ROUTES.defect_type.delete}?defectid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<DefectType[]>(`${API_ROUTES.defect_type.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getDefectTypeIdOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.defect_type.suggest_defecttype_id}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getDefectTypeNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.defect_type.suggest_defecttype_name}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}

