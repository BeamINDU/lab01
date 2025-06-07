import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.product_type.get}?${param}`);

    const mapData: ProductType[] = res?.product_types
    ?.filter((item) => !item.isdeleted)
    ?.map((item) => ({
      productTypeId: item.prodtypeid,
      productTypeName: item.prodtype,
      description: item.proddescription,
      status: item.prodstatus,
      createdDate: item.createddate,
      createdBy: item.createdby,
      updatedDate: item.updateddate,
      updatedBy: item.updatedby,
    }));

    return mapData;
  } catch (error) {
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<ProductType>(`${API_ROUTES.product_type.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const create = async (param: Partial<ProductType>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.product_type.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<ProductType>) => {
  try {
    const res = await api.put<ProductType>(`${API_ROUTES.product_type.update}?prodtypeid=${param.productTypeId}`, param);
    return {
      ...param,
      updatedDate: new Date(),
    };
  } catch (error) {
    throw error;
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<ProductType>(`${API_ROUTES.product_type.delete}?prodtypeid=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<ProductType[]>(`${API_ROUTES.product_type.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};


export const getProductTypeIdOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_id}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
};

export const getProductTypeNameOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_name}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}
