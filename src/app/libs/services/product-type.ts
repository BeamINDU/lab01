import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { ProductType, ParamSearch } from "@/app/types/product-type"
import { SelectOption } from "@/app/types/select-option";

//  Mock Data
const mockData = (): ProductType[] => {
  const PRODUCT_TYPE_DATA = [
    {
      id: 'BTL001',
      name: 'Bottle',
      description: 'Various types of bottles for beverages, medicines, and cosmetics',
      category: 'Container',
      applications: ['Beverage', 'Medicine', 'Cosmetic']
    },
    {
      id: 'BOX001',
      name: 'Box',
      description: 'Cardboard and plastic boxes for packaging various products',
      category: 'Packaging',
      applications: ['Electronics', 'Food', 'General']
    },
    {
      id: 'CAN001',
      name: 'Can',
      description: 'Metal and aluminum cans for beverages and food products',
      category: 'Container',
      applications: ['Beverage', 'Food']
    },
    {
      id: 'PLC001',
      name: 'Plastic Container',
      description: 'Plastic containers and tubs for food and chemical products',
      category: 'Container',
      applications: ['Food', 'Chemical', 'Industrial']
    },
    {
      id: 'GLS001',
      name: 'Glass Jar',
      description: 'Glass jars for premium food products and cosmetics',
      category: 'Container',
      applications: ['Food', 'Cosmetic', 'Pharmaceutical']
    },
    {
      id: 'PPR001',
      name: 'Paper Pack',
      description: 'Paper-based packaging for food and beverage products',
      category: 'Packaging',
      applications: ['Food', 'Beverage']
    },
    {
      id: 'MTL001',
      name: 'Metal Tin',
      description: 'Metal tins and containers for food and industrial products',
      category: 'Container',
      applications: ['Food', 'Industrial', 'Chemical']
    },
    {
      id: 'PCH001',
      name: 'Pouch',
      description: 'Flexible pouches for snacks and liquid products',
      category: 'Flexible Packaging',
      applications: ['Snack', 'Beverage', 'Food']
    },
    {
      id: 'TUB001',
      name: 'Tub',
      description: 'Wide-mouth containers for dairy and food products',
      category: 'Container',
      applications: ['Dairy', 'Food']
    },
    {
      id: 'SPR001',
      name: 'Spray Bottle',
      description: 'Bottles with spray mechanisms for cosmetics and cleaners',
      category: 'Specialized Container',
      applications: ['Cosmetic', 'Cleaning', 'Personal Care']
    },
    {
      id: 'AMP001',
      name: 'Ampoule',
      description: 'Small sealed vials for pharmaceuticals and cosmetics',
      category: 'Medical Container',
      applications: ['Pharmaceutical', 'Cosmetic']
    },
    {
      id: 'BLI001',
      name: 'Blister Pack',
      description: 'Pre-formed plastic packaging for tablets and small items',
      category: 'Medical Packaging',
      applications: ['Pharmaceutical', 'Electronics']
    }
  ];

  const currentDate = new Date();

  return PRODUCT_TYPE_DATA.map((type, i): ProductType => {
    const createdDate = new Date(currentDate.getTime() - (Math.random() * 1095 * 24 * 60 * 60 * 1000));
    const hasUpdate = Math.random() > 0.7;
    const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 365 * 24 * 60 * 60 * 1000)) : null;

    return {
      productTypeId: type.id,
      productTypeName: type.name,
      description: type.description,
      status: Math.random() > 0.08 ? 1 : 0,
      createdDate: createdDate,
      createdBy: i < 3 ? 'system' : ['admin', 'product_manager', 'engineer'][Math.floor(Math.random() * 3)],
      updatedDate: updatedDate,
      updatedBy: hasUpdate ? ['admin', 'product_manager', 'engineer'][Math.floor(Math.random() * 3)] : null,
    };
  });
};

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