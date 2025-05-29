// src/app/lib/services/product.ts - Realistic Mock Data
import { api } from '@/app/utils/api'
import type { Product, ParamSearch } from "@/app/types/product"
import { SelectOption } from "@/app/types/select-option";

// ⭐ ข้อมูลจริงที่หลากหลาย
const PRODUCT_TYPES = [
  { label: 'Beverage Bottle', value: 'Beverage Bottle' },
  { label: 'Food Container', value: 'Food Container' },
  { label: 'Medicine Bottle', value: 'Medicine Bottle' },
  { label: 'Cosmetic Jar', value: 'Cosmetic Jar' },
  { label: 'Chemical Container', value: 'Chemical Container' },
  { label: 'Electronics Box', value: 'Electronics Box' },
  { label: 'Automotive Parts', value: 'Automotive Parts' },
  { label: 'Textile Product', value: 'Textile Product' },
];

const PRODUCT_DATA = [
  // Beverages
  { name: 'Coca Cola Classic 330ml', type: 'Beverage Bottle', category: 'Beverage' },
  { name: 'Pepsi Cola 500ml', type: 'Beverage Bottle', category: 'Beverage' },
  { name: 'Sprite Lemon 350ml', type: 'Beverage Bottle', category: 'Beverage' },
  { name: 'Fanta Orange 500ml', type: 'Beverage Bottle', category: 'Beverage' },
  { name: 'Red Bull Energy Drink', type: 'Beverage Bottle', category: 'Energy Drink' },
  
  // Food Containers
  { name: 'Instant Noodle Cup', type: 'Food Container', category: 'Food' },
  { name: 'Yogurt Container 200ml', type: 'Food Container', category: 'Dairy' },
  { name: 'Peanut Butter Jar 340g', type: 'Food Container', category: 'Condiment' },
  { name: 'Olive Oil Bottle 500ml', type: 'Food Container', category: 'Oil' },
  { name: 'Honey Jar 250g', type: 'Food Container', category: 'Natural' },
  
  // Medicine
  { name: 'Paracetamol 500mg', type: 'Medicine Bottle', category: 'Medicine' },
  { name: 'Vitamin C Tablets', type: 'Medicine Bottle', category: 'Supplement' },
  { name: 'Cough Syrup 100ml', type: 'Medicine Bottle', category: 'Medicine' },
  
  // Cosmetics
  { name: 'Face Cream Jar 50ml', type: 'Cosmetic Jar', category: 'Skincare' },
  { name: 'Foundation Bottle 30ml', type: 'Cosmetic Jar', category: 'Makeup' },
  { name: 'Shampoo Bottle 400ml', type: 'Cosmetic Jar', category: 'Haircare' },
  
  // Electronics
  { name: 'Smartphone Case', type: 'Electronics Box', category: 'Mobile' },
  { name: 'USB Cable Package', type: 'Electronics Box', category: 'Accessory' },
  { name: 'Bluetooth Earphone', type: 'Electronics Box', category: 'Audio' },
  
  // Automotive
  { name: 'Engine Oil Filter', type: 'Automotive Parts', category: 'Filter' },
  { name: 'Brake Pad Set', type: 'Automotive Parts', category: 'Brake' },
];

// ⭐ สร้าง Mock Data ที่เหมือนจริง
const mockData: Product[] = PRODUCT_DATA.map((item, i) => {
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000)); // สุ่มวันที่ในปีที่แล้ว
  const hasUpdate = Math.random() > 0.6; // 40% โอกาสที่จะมีการอัพเดท
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)) : null;

  return {
    productId: `PROD${String(i + 1).padStart(4, '0')}`, // PROD0001, PROD0002, etc.
    productName: item.name,
    productTypeName: item.type,
    serialNo: `${item.category.substring(0, 2).toUpperCase()}${Date.now() + i}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    status: Math.random() > 0.15 ? 1 : 0, // 85% Active, 15% Inactive
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'manager', 'operator'][Math.floor(Math.random() * 4)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'manager', 'operator'][Math.floor(Math.random() * 3)] : null,
  };
});

// ⭐ เพิ่มข้อมูลเพื่อให้ครบ 50 รายการ
while (mockData.length < 50) {
  const randomProduct = PRODUCT_DATA[Math.floor(Math.random() * PRODUCT_DATA.length)];
  const i = mockData.length;
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000));
  const hasUpdate = Math.random() > 0.6;
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)) : null;

  mockData.push({
    productId: `PROD${String(i + 1).padStart(4, '0')}`,
    productName: `${randomProduct.name} (Variant ${i - PRODUCT_DATA.length + 1})`,
    productTypeName: randomProduct.type,
    serialNo: `${randomProduct.category.substring(0, 2).toUpperCase()}${Date.now() + i}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    status: Math.random() > 0.15 ? 1 : 0,
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'manager', 'operator'][Math.floor(Math.random() * 4)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'manager', 'operator'][Math.floor(Math.random() * 3)] : null,
  });
}

// ⭐ API-Ready Functions
export const search = async (param?: ParamSearch) => { 
  console.log('Product service received params:', param);
  
  // TODO: Replace with actual API call
  // const response = await api.get<Product[]>('/products', { params: param });
  // return response;
  
  if (!param) return mockData;

  const filteredData = mockData.filter(item => {
    const productIdMatch = !param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase());
    const productNameMatch = !param.productName || item.productName.toLowerCase().includes(param.productName.toLowerCase());
    const productTypeMatch = !param.productTypeName || 
      item.productTypeName.toLowerCase().includes(param.productTypeName.toLowerCase()) ||
      param.productTypeName.toLowerCase().includes(item.productTypeName.toLowerCase());
    const serialNoMatch = !param.serialNo || item.serialNo.toLowerCase().includes(param.serialNo.toLowerCase());
    
    let statusMatch = true;
    if (param.status !== undefined && param.status !== null) {
      const searchStatus = typeof param.status === 'string' ? parseInt(param.status, 10) : param.status;
      if (!isNaN(searchStatus)) {
        statusMatch = item.status === searchStatus;
      }
    }
    
    return productIdMatch && productNameMatch && productTypeMatch && serialNoMatch && statusMatch;
  });
  
  console.log('Filtered results:', filteredData.length, 'items');
  return filteredData;
};

export const detail = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.get<Product>(`/products/${id}`);
  
  return mockData.find(item => item.productId === id);
};

export const create = async (param: Partial<Product>) => {
  // TODO: Replace with actual API call
  // return await api.post<Product>('/products', param);
  
  console.log('Creating product:', param);
  const newProduct = {
    ...param,
    productId: param.productId || `PROD${String(mockData.length + 1).padStart(4, '0')}`,
    status: param.status ?? 1,
    createdDate: new Date(),
    createdBy: param.createdBy || 'admin',
    updatedDate: null,
    updatedBy: null,
  };
  
  // เพิ่มเข้า mockData
  mockData.push(newProduct as Product);
  return newProduct;
};

export const update = async (param: Partial<Product>) => {
  // TODO: Replace with actual API call
  // return await api.put<Product>(`/products/${param.productId}`, param);
  
  console.log('Updating product:', param);
  const index = mockData.findIndex(item => item.productId === param.productId);
  if (index !== -1) {
    mockData[index] = {
      ...mockData[index],
      ...param,
      updatedDate: new Date(),
      updatedBy: param.updatedBy || 'admin'
    };
    return mockData[index];
  }
  
  return {
    ...param,
    updatedDate: new Date(),
    updatedBy: param.updatedBy || 'admin'
  };
};

export const remove = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.delete(`/products/${id}`);
  
  console.log('Deleting product:', id);
  const index = mockData.findIndex(item => item.productId === id);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
  return {};
};

export const upload = async (file: File) => {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // return await api.post('/products/upload', formData);
  
  console.log('Uploading file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'File uploaded successfully' };
};

// ⭐ Options for SearchField
export const getProductTypes = async (): Promise<SelectOption[]> => {
  // TODO: Replace with actual API call
  // return await api.get<SelectOption[]>('/products/types');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return PRODUCT_TYPES;
};

export const getProductNames = async (): Promise<SelectOption[]> => {
  // TODO: Replace with actual API call
  // return await api.get<SelectOption[]>('/products/names');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  const uniqueNames = [...new Set(mockData.map(item => item.productName))];
  return uniqueNames.map(name => ({ label: name, value: name }));
};