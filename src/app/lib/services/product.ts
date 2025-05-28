// src/app/lib/services/product.ts - แก้ไข filter logic
import { api } from '@/app/utils/api'
import type { Product, ParamSearch } from "@/app/types/product"
import { SelectOption } from "@/app/types/select-option";

// ⭐ กำหนด Product Types ที่ใช้ร่วมกัน
const PRODUCT_TYPES = [
  { label: 'Bottle', value: 'Bottle' },
  { label: 'Box', value: 'Box' },
  { label: 'Can', value: 'Can' },
  { label: 'Pouch', value: 'Pouch' },
  { label: 'Glass Jar', value: 'Glass Jar' },
  { label: 'Plastic Container', value: 'Plastic Container' },
  { label: 'Paper Pack', value: 'Paper Pack' },
  { label: 'Metal Tin', value: 'Metal Tin' },
];

// ⭐ กำหนด Product Names ที่หลากหลาย
const PRODUCT_NAMES = [
  'Coca Cola', 'Pepsi', 'Sprite', 'Fanta Orange', 'Mountain Dew',
  'Red Bull', 'Coffee Black', 'Green Tea', 'Mineral Water', 'Orange Juice',
  'Apple Juice', 'Mango Juice', 'Lemon Soda', 'Energy Drink', 'Chocolate Milk',
  'Strawberry Milk', 'Yogurt Drink', 'Sports Drink', 'Ice Tea', 'Beer'
];

// ⭐ Mock Data ที่มีข้อมูลปกติและ Active
const mockData: Product[] = Array.from({ length: 20 }, (_, i) => ({
  productId: `PROD${String(i+1).padStart(3, '0')}`,
  productName: PRODUCT_NAMES[i % PRODUCT_NAMES.length],
  productTypeName: PRODUCT_TYPES[i % PRODUCT_TYPES.length].value,
  serialNo: `SN${Date.now() + i}${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
  status: i % 4 === 0 ? 0 : 1, // ✅ เปลี่ยนให้ส่วนใหญ่เป็น Active (75% Active, 25% Inactive)
  createdDate: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
  createdBy: ['admin', 'system', 'user'][i % 3],
  updatedDate: Math.random() > 0.5 ? new Date(Date.now() - (i * 12 * 60 * 60 * 1000)) : null,
  updatedBy: Math.random() > 0.5 ? ['admin', 'system'][i % 2] : null,
}))

export const search = async (param?: ParamSearch) => { 
  console.log('Product service received params:', param);
  
  if (!param) return mockData;

  const filteredData = mockData.filter(item => {
    const productIdMatch = !param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase());
    const productNameMatch = !param.productName || item.productName.toLowerCase().includes(param.productName.toLowerCase());
    
    // ✅ แก้ไข: รองรับหลายรูปแบบการค้นหา productType
    const productTypeMatch = !param.productTypeName || 
      item.productTypeName.toLowerCase().includes(param.productTypeName.toLowerCase()) ||
      param.productTypeName.toLowerCase().includes(item.productTypeName.toLowerCase());
    
    const serialNoMatch = !param.serialNo || item.serialNo.toLowerCase().includes(param.serialNo.toLowerCase());
    
    // ✅ แก้ไข: จัดการ status comparison ให้ถูกต้อง
    let statusMatch = true;
    if (param.status !== undefined && param.status !== null) {
      // แปลง param.status เป็น number สำหรับเปรียบเทียบ
      const searchStatus = typeof param.status === 'string' ? parseInt(param.status, 10) : param.status;
      if (!isNaN(searchStatus)) {
        statusMatch = item.status === searchStatus;
      }
    }
    
    console.log(`Product ${item.productId} matches:`, {
      productIdMatch,
      productNameMatch, 
      productTypeMatch,
      serialNoMatch,
      statusMatch,
      searchProductType: param.productTypeName,
      itemProductType: item.productTypeName,
      searchStatus: param.status,
      itemStatus: item.status
    });
    
    return productIdMatch && productNameMatch && productTypeMatch && serialNoMatch && statusMatch;
  });
  
  console.log('Filtered results:', filteredData.length, 'items');
  return filteredData;
};

export const detail = async (id: string) => {
  return mockData.find(item => item.productId === id);
};

export const create = async (param: Partial<Product>) => {
  return {
    ...param,
    productId: param.productId || `PROD${String(mockData.length + 1).padStart(3, '0')}`,
    status: param.status ?? 1,
    createdDate: new Date(),
    createdBy: 'admin'
  };
};

export const update = async (param: Partial<Product>) => {
  return {
    ...param,
    updatedDate: new Date(),
    updatedBy: 'admin'
  };
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ✅ ใช้ PRODUCT_TYPES โดยตรง
export const getProductTypes = async (): Promise<SelectOption[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PRODUCT_TYPES;
  } catch (error) {
    console.error('Failed to fetch product types:', error);
    throw error;
  }
};

// ✅ เพิ่ม function สำหรับดึง Product Names
export const getProductNames = async (): Promise<SelectOption[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PRODUCT_NAMES.map(name => ({ label: name, value: name }));
  } catch (error) {
    console.error('Failed to fetch product names:', error);
    throw error;
  }
};