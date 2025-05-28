// src/app/lib/services/product-type.ts
import { api } from '@/app/utils/api'
import type { ProductType, ParamSearch } from "@/app/types/product-type"
import { SelectOption } from "@/app/types/select-option";

const mockData: ProductType[] = Array.from({ length: 20 }, (_, i) => ({
  productTypeId:  `PT-${i+1}`,
  productTypeName: `PT-Name${i+1}`,
  description: 'description description description description description',
  status: i % 2 === 0 ? 1 : 0,
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: null,
  updatedBy: null,
}))

// เพิ่ม mock data สำหรับ Product Type Options
const mockProductTypeOptions: SelectOption[] = [
  { label: 'Bottle', value: 'bottle' },
  { label: 'Box', value: 'box' },
  { label: 'Can', value: 'can' },
  { label: 'Plastic Container', value: 'plastic-container' },
  { label: 'Glass Jar', value: 'glass-jar' },
  { label: 'Paper Pack', value: 'paper-pack' },
  { label: 'Metal Tin', value: 'metal-tin' },
  { label: 'Pouch', value: 'pouch' },
  { label: 'Aluminum Foil', value: 'aluminum-foil' },
  { label: 'Cardboard', value: 'cardboard' },
  { label: 'Vacuum Pack', value: 'vacuum-pack' },
  { label: 'Stand-up Pouch', value: 'stand-up-pouch' },
];

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined  : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.productTypeId || item.productTypeId.includes(param.productTypeId)) &&
      (!param.productTypeName || item.productTypeName.includes(param.productTypeName)) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
};

export const detail = async (id: string) => {
  return mockData.find(item => item.productTypeId === id);
};

export const create = async (param: Partial<ProductType>) => {
  return param;
};

export const update = async (param: Partial<ProductType>) => {
  return param;
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ⭐ เพิ่ม function สำหรับดึงข้อมูล Product Type Options
export const getProductTypeOptions = async (): Promise<SelectOption[]> => {
  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProductTypeOptions;
    
    // ในการใช้งานจริง อาจจะดึงจาก mockData หรือ API:
    // const productTypes = await search(); // ดึงข้อมูลทั้งหมด
    // return productTypes
    //   .filter(item => item.status === 1) // เฉพาะที่ active
    //   .map(item => ({
    //     label: item.productTypeName,
    //     value: item.productTypeId
    //   }));
    
    // หรือเรียก API โดยตรง:
    // return await api.get<SelectOption[]>('/product-type-options');
  } catch (error) {
    console.error('Failed to fetch product type options:', error);
    throw error;
  }
};