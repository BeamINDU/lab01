import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.product_type.get, param);

    const mapData: ProductType[] = res?.product_types?.map((item) => ({
      id: item.prodtypeid,
      productTypeId: item.prodtypeid,
      productTypeName: item.prodtype,
      description: item.proddescription,
      status: item.prodstatus,
      statusName: item.prodstatus ? 'Active' : 'Inactive',
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
    return await api.get<ProductType>(`${API_ROUTES.product_type.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<ProductType>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.product_type.insert}`, param);
    return {
      ...param,
      id: param.productTypeId,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(res.createddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<ProductType>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.product_type.update}?prodtypeid=${id}`, param);
    return {
      ...param,
      id: param.productTypeId,
      statusName: param.status ? 'Active' : 'Inactive',
      updatedDate: new Date(res.updateddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<ProductType>(`${API_ROUTES.product_type.delete}?prodtypeid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (uploadby: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('uploadby', uploadby);
    formData.append('file', file);

    const res = await api.upload<ProductType[]>(`${API_ROUTES.product_type.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getProductTypeIdOptions = async (q: string): Promise<SelectOption[]> => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_id}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getProductTypeNameOptions = async (q: string): Promise<SelectOption[]> => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_name}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}
