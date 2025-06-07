import { api } from "@/app/utils/api"
import { API_ROUTES } from "@/app/constants/endpoint";
import { Product, ParamSearch } from "@/app/types/product"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.product.get}?${param}`);

    const mapData: Product[] = res?.products
      ?.filter((item) => !item.isdeleted)
      ?.map((item) => ({
        productId: item.prodid,
        productName: item.prodname,
        productTypeId: item.prodtypeid,
        productTypeName: '',
        serialNo: item.prodserial,
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
    return await api.get<Product>(`${API_ROUTES.product.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const create = async (param: Partial<Product>) => {
  try {
    const res = await api.post<any>(`${API_ROUTES.product.insert}`, param);
    return {
      ...param,
      createdDate: new Date(),
    };
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<Product>) => {
  try {
    const res = await api.put<Product>(`${API_ROUTES.product.update}?productId=${param.productId}`, param);
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
    return await api.delete<Product>(`${API_ROUTES.product.delete}?productId=${id}`);
  } catch (error) {
    throw error;
  }  
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<Product[]>(`${API_ROUTES.product.upload}`, formData);
    return res;
  } catch (error) {
    throw error;
  } 
};

export const getProductIdOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product.suggest_product_id}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
};

export const getProductNameOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product.suggest_product_name}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}

export const getSerialNoOptions = async (keyword: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product.suggest_serial_no}?keyword=${keyword}`);
  } catch (error) {
    throw error;
  }  
}