import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { SelectOption } from "@/app/types/select-option";

// API Functions
export const search = async (param?: ParamSearch) => { 
  try {

    const queryParams = new URLSearchParams();
    if (param?.productTypeId) queryParams.append('productTypeId', param.productTypeId);
    if (param?.productTypeName) queryParams.append('productTypeName', param.productTypeName);
    if (param?.status !== undefined && param.status !== '') queryParams.append('status', param.status);

    const queryString = queryParams.toString();
    const url = queryString ? `${API_ROUTES.product_type.get}?${queryString}` : API_ROUTES.product_type.get;
    
    const result = await api.get<any>(url);
    if (result && result.product_types && Array.isArray(result.product_types)) {
      return result.product_types.map((item: any) => ({
        productTypeId: item.prodtypeid,
        productTypeName: item.prodtype,
        description: item.proddescription,
        status: item.prodstatus ? 1 : 0,
        createdDate: item.createddate ? new Date(item.createddate) : undefined,
        createdBy: item.createdby,
        updatedDate: item.updateddate ? new Date(item.updateddate) : null,
        updatedBy: item.updatedby,
      }));
    } else {
      console.warn('Unexpected API response format:', result);
      return [];
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const detail = async (id: string) => {
  try {
    const result = await api.get<any>(`${API_ROUTES.product_type.detail}/${id}`);
    
    if (result && result.prodtypeid) {
      return {
        productTypeId: result.prodtypeid,
        productTypeName: result.prodtype,
        description: result.proddescription,
        status: result.prodstatus, 
        createdDate: result.createddate ? new Date(result.createddate) : undefined,
        createdBy: result.createdby,
        updatedDate: result.updateddate ? new Date(result.updateddate) : null,
        updatedBy: result.updatedby,
      };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const create = async (param: Partial<ProductType>) => {
  try {
    console.log('Creating with param:', param);
    

    const apiParam = {
      prodtypeid: param.productTypeId,
      prodtype: param.productTypeName,
      proddescription: param.description,
      prodstatus: param.status, 
      createdby: param.createdBy,
    };
    
    console.log('API param for create:', apiParam); 
    
    const result = await api.post<any>(`${API_ROUTES.product_type.insert}`, apiParam);
    console.log('Create result:', result); 
    
    if (result && result.prodtypeid) {
      return {
        productTypeId: result.prodtypeid,
        productTypeName: result.prodtype,
        description: result.proddescription,
        status: result.prodstatus, // ✅ ใช้ boolean ตรงๆ
        createdDate: result.createddate ? new Date(result.createddate) : undefined,
        createdBy: result.createdby,
        updatedDate: result.updateddate ? new Date(result.updateddate) : null,
        updatedBy: result.updatedby,
      };
    }
    return result;
  } catch (error) {
    console.error('Create error:', error); 
    throw error;
  }
};

export const update = async (param: Partial<ProductType>) => {
  try {
    console.log('Updating with param:', param); 
    const apiParam = {
      prodtypeid: param.productTypeId,
      prodtype: param.productTypeName,
      proddescription: param.description,
      prodstatus: param.status, 
      updatedby: param.updatedBy,
    };
    
    console.log('API param for update:', apiParam); 
    
    const result = await api.put<any>(`${API_ROUTES.product_type.update}/${param.productTypeId}`, apiParam);
    console.log('Update result:', result); 
    
    if (result && result.prodtypeid) {
      return {
        productTypeId: result.prodtypeid,
        productTypeName: result.prodtype,
        description: result.proddescription,
        status: result.prodstatus, // ✅ ใช้ boolean ตรงๆ
        createdDate: result.createddate ? new Date(result.createddate) : undefined,
        createdBy: result.createdby,
        updatedDate: result.updateddate ? new Date(result.updateddate) : null,
        updatedBy: result.updatedby,
      };
    }
    return result;
  } catch (error) {
    console.error('Update error:', error); // Debug log
    throw error;
  }
};

export const remove = async (id: string) => {
  try {
    return await api.delete(`${API_ROUTES.product_type.delete}/${id}`);
  } catch (error) {
    throw error;
  }
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return await api.upload<ProductType[]>(API_ROUTES.product_type.upload, formData);
  } catch (error) {
    throw error;
  }
};

// Options functions สำหรับ SearchField
export const getProductTypeIdOptions = async (searchTerm?: string): Promise<SelectOption[]> => {
  try {
    // ใช้ search function ที่มีอยู่แล้ว
    const data = await search();
    let filteredData = data;
    
    if (searchTerm) {
      filteredData = data.filter(item => 
        item.productTypeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredData.map(item => ({
      label: item.productTypeId,
      value: item.productTypeId
    }));
  } catch (error) {
    console.error('Failed to load product type ID options:', error);
    return [];
  }
};

export const getProductTypeNameOptions = async (searchTerm?: string): Promise<SelectOption[]> => {
  try {
 
    const data = await search();
    let filteredData = data;
    
    if (searchTerm) {
      filteredData = data.filter(item => 
        item.productTypeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredData.map(item => ({
      label: item.productTypeName,
      value: item.productTypeName 
    }));
  } catch (error) {
    console.error('Failed to load product type name options:', error);
    return [];
  }
};

// สำหรับ SearchField ในหน้า ProductType เอง
export const getProductTypeSearchOptions = async (): Promise<SelectOption[]> => {
  try {
    const data = await search();
    return data.map(item => ({
      label: `${item.productTypeName} (${item.productTypeId})`,
      value: item.productTypeName
    }));
  } catch (error) {
    throw error;
  }
};