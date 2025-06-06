import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { SelectOption } from "@/app/types/select-option";


// API Functions
export const search = async (param?: ParamSearch) => { 
  try {
    return await api.get<ProductType[]>(`${API_ROUTES.product_type.get}/${param}`);
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

  // return mockData.find(item => item.productTypeId === id);
};

export const create = async (param: Partial<ProductType>) => {
  try {
    return await api.post<ProductType>(`${API_ROUTES.product_type.insert}`, param);
  } catch (error) {
    throw error;
  }  


};

export const update = async (param: Partial<ProductType>) => {
  try {
    return await api.post<ProductType>(`${API_ROUTES.product_type.update}`, param);
  } catch (error) {
    throw error;
  } 
  

};

export const remove = async (id: string) => {
  try {
    return await api.delete<ProductType>(`${API_ROUTES.product_type.delete}/${id}`);
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


export const getProductTypeIdOptions = async (id: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_id}/${id}`);
  } catch (error) {
    throw error;
  }  

};

export const getProductTypeNameOptions = async (name: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_name}/${name}`);
  } catch (error) {
    throw error;
  }  
}


