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
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<ProductType>) => {
  try {
    const res = await api.put<ProductType>(`${API_ROUTES.product_type.update}?prodtypeid=${id}`, param);
    return {
      ...param,
      id: param.productTypeId,
      createdDate: new Date(),
      updatedDate: new Date(),
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

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<ProductType[]>(`${API_ROUTES.product_type.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};


export const getProductTypeIdOptions = async (q: string): Promise<SelectOption[]> => {
  try {
    // return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_id}?q=${q}`);

    // For Test
    const res = await api.get<any>(`${API_ROUTES.product_type.get}`);

    const result: SelectOption[] = (res?.product_types ?? [])
      .filter((item) =>
        !item.isdeleted &&
        item.prodtypeid.toLowerCase().includes(q.toLowerCase())
      )
      .map((item) => ({
        value: item.prodtypeid,
        label: item.prodtypeid,
      }));

    return result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getProductTypeNameOptions = async (q: string): Promise<SelectOption[]> => {
  try {
    // return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_name}?q=${q}`);

    // For Test
    const res = await api.get<any>(`${API_ROUTES.product_type.get}`);

    const result: SelectOption[] = (res?.product_types ?? [])
      .filter((item) =>
        !item.isdeleted &&
        item.prodtype.toLowerCase().includes(q.toLowerCase())
      )
      .map((item) => ({
        value: item.prodtype,
        label: item.prodtype,
      }));

    return result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}
