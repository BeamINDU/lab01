// src/app/lib/services/product.ts
import { api } from '@/app/utils/api'
import type { Product, ParamSearch } from "@/app/types/product"
import { SelectOption } from "@/app/types/select-option";

const mockData: Product[] = Array.from({ length: 20 }, (_, i) => ({
  productId: `PROD${i+1}`,
  productName: i % 2 === 0 ? 'Grape' : 'Orange',
  productTypeName: i % 4 === 0 ? 'Bottle' : 
                   i % 4 === 1 ? 'Box' : 
                   i % 4 === 2 ? 'Can' : 'Pouch',
  serialNo: i % 2 === 0 ? '1234567890' : '0987654321',
  status: i % 2 === 0 ? 1 : 0,
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: null,
  updatedBy: null,
}))

// เพิ่ม mock data สำหรับ Product Types
const mockProductTypes: SelectOption[] = [
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
  console.log('Product service received params:', param); // Debug log
  
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined  : Number(param.status);

  const filteredData = mockData.filter(item => {
    const productIdMatch = !param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase());
    const productNameMatch = !param.productName || item.productName.toLowerCase().includes(param.productName.toLowerCase());
    const productTypeMatch = !param.productTypeName || item.productTypeName.toLowerCase().includes(param.productTypeName.toLowerCase());
    const serialNoMatch = !param.serialNo || item.serialNo.toLowerCase().includes(param.serialNo.toLowerCase());
    const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
    console.log(`Item ${item.productId}:`, {
      productTypeMatch,
      searchValue: param.productTypeName,
      itemValue: item.productTypeName
    }); // Debug log
    
    return productIdMatch && productNameMatch && productTypeMatch && serialNoMatch && statusMatch;
  });
  
  console.log('Filtered results:', filteredData.length, 'items'); // Debug log
  return filteredData;
};

export const detail = async (id: string) => {
  return mockData.find(item => item.productId === id);
  // return await apiClient<Product>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<Product>) => {
  return param;
  // const newData = await api.post<Product>('/create', param)
};

export const update = async (param: Partial<Product>) => {
  return param;
  // const updated = await api.put<Product>(`/update/${param.id}`, param)
};

export const remove = async (id: string) => {
  return {};
  // await api.delete(`/remove/${id}`)
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};

  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await api.post<Camera>('/upload', formData)
};

// เพิ่ม function ใหม่สำหรับดึงข้อมูล Product Types
export const getProductTypes = async (): Promise<SelectOption[]> => {
  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProductTypes;
    
    // ในการใช้งานจริง จะเป็นแบบนี้:
    // return await api.get<SelectOption[]>('/product-types');
  } catch (error) {
    console.error('Failed to fetch product types:', error);
    throw error;
  }
};