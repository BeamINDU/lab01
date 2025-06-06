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

  // console.log('ProductType service received params:', param);

  // if (!param) return mockData;

  // let parsedStatus: number | undefined = undefined;
  // if (param.status !== undefined && param.status !== null && param.status.toString().trim() !== '') {
  //   const statusNum = Number(param.status);
  //   if (!isNaN(statusNum)) {
  //     parsedStatus = statusNum;
  //   }
  // }

  // const filteredData = mockData.filter(item => {
  //   const productTypeIdMatch = !param.productTypeId || item.productTypeId.toLowerCase().includes(param.productTypeId.toLowerCase());
  //   const productTypeNameMatch = !param.productTypeName || item.productTypeName.toLowerCase().includes(param.productTypeName.toLowerCase());
  //   const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
  //   return productTypeIdMatch && productTypeNameMatch && statusMatch;
  // });
  
  // console.log('ProductType filtered results:', filteredData.length, 'items');
  // return filteredData;
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

  // const newProductType = {
  //   ...param,
  //   productTypeId: param.productTypeId || `PT${String(mockData.length + 1).padStart(3, '0')}`,
  //   status: param.status ?? 1,
  //   createdDate: new Date(),
  //   createdBy: param.createdBy || 'admin',
  //   updatedDate: null,
  //   updatedBy: null,
  // };
  // mockData.push(newProductType as ProductType);
  // return newProductType;
};

export const update = async (param: Partial<ProductType>) => {
  try {
    return await api.post<ProductType>(`${API_ROUTES.product_type.update}`, param);
  } catch (error) {
    throw error;
  } 
  
  // const index = mockData.findIndex(item => item.productTypeId === param.productTypeId);
  // if (index !== -1) {
  //   mockData[index] = {
  //     ...mockData[index],
  //     ...param,
  //     updatedDate: new Date(),
  //     updatedBy: param.updatedBy || 'admin'
  //   };
  //   return mockData[index];
  // }
  
  // return {
  //   ...param,
  //   updatedDate: new Date(),
  //   updatedBy: param.updatedBy || 'admin'
  // };
};

export const remove = async (id: string) => {
  try {
    return await api.delete<ProductType>(`${API_ROUTES.product_type.delete}/${id}`);
  } catch (error) {
    throw error;
  }  

  // const index = mockData.findIndex(item => item.productTypeId === id);
  // if (index !== -1) {
  //   mockData.splice(index, 1);
  // }
  // return {};
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
  // await new Promise(resolve => setTimeout(resolve, 2000));
  // return { message: 'Product type file uploaded successfully' };
};


export const getProductTypeIdOptions = async (id: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_id}/${id}`);
  } catch (error) {
    throw error;
  }  

  // console.log('Loading ProductType options...');
  // await new Promise(resolve => setTimeout(resolve, 500));

  // const activeProductTypes = mockData.filter(item => item.status === 1);
  
  // const options = activeProductTypes.map(item => ({
  //   label: item.productTypeName,
  //   value: item.productTypeName 
  // }));
  
  // console.log('ProductType options loaded:', options.length, 'items');
  // return options;
};

export const getProductTypeNameOptions = async (name: string) => {
  try {
    return await api.get<SelectOption[]>(`${API_ROUTES.product_type.suggest_producttype_name}/${name}`);
  } catch (error) {
    throw error;
  }  
}


// export const getProductTypeSearchOptions = async (): Promise<SelectOption[]> => {
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return mockData.map(item => ({
//     label: `${item.productTypeName} (${item.productTypeId})`,
//     value: item.productTypeName
//   }));
// };