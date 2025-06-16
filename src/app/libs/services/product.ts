import { api } from "@/app/utils/api"
import { API_ROUTES } from "@/app/constants/endpoint";
import { Product, ParamSearch } from "@/app/types/product"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.product.get}?${param}`);

    const mapData: Product[] = res?.products?.map((item) => ({
      id: item.prodid,
      productId: item.prodid,
      productName: item.prodname,
      productTypeId: item.prodtypeid,
      serialNo: item.prodserial,
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
    return await api.get<Product>(`${API_ROUTES.product.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const create = async (param: Partial<Product>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.product.insert}`, param);
    return {
      ...param,
      id: param.productId,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<Product>) => {
  try {
    const res = await api.put<Product>(`${API_ROUTES.product.update}?prodid=${id}`, param);
    return {
      ...param,
      id: param.productId,
      statusName: param.status ? 'Active' : 'Inactive',
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const remove = async (id: string) => {
  try {
    return await api.delete<Product>(`${API_ROUTES.product.delete}?prodid=${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Product[]>(`${API_ROUTES.product.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const getProductIdOptions = async (q: string) => {
  try {
    // return await api.get<SelectOption[]>(`${API_ROUTES.product.suggest_product_id}?q=${q}`);

    // For Test
    const res = await api.get<any>(`${API_ROUTES.product.get}`);

    const result: SelectOption[] = (res?.products ?? [])
      .filter((item) =>
        item.prodstatus &&
        item.prodid.toLowerCase().includes(q.toLowerCase())
      )
      .map((item) => ({
        value: item.prodid,
        label: item.prodid,
      }));

    return result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const getProductNameOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product.suggest_product_name}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}

export const getSerialNoOptions = async (q: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product.suggest_serial_no}?q=${q}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
}