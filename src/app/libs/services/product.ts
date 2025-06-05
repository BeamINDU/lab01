import { api } from "@/app/utils/api"
import { API_ROUTES } from "@/app/constants/endpoint"
import type { Product, ParamSearch } from "@/app/types/product"
import { SelectOption } from "@/app/types/select-option";

const PRODUCT_DATA = [
  // Beverages
  { name: 'Coca Cola Classic 330ml', type: 'Bottle', category: 'Beverage' },
  { name: 'Pepsi Cola 500ml', type: 'Bottle', category: 'Beverage' },
  { name: 'Sprite Lemon 350ml', type: 'Bottle', category: 'Beverage' },
  { name: 'Fanta Orange 500ml', type: 'Bottle', category: 'Beverage' },
  { name: 'Red Bull Energy Drink', type: 'Can', category: 'Energy Drink' },
  
  // Food Containers
  { name: 'Instant Noodle Cup', type: 'Paper Pack', category: 'Food' },
  { name: 'Yogurt Container 200ml', type: 'Plastic Container', category: 'Dairy' },
  { name: 'Peanut Butter Jar 340g', type: 'Glass Jar', category: 'Condiment' },
  { name: 'Olive Oil Bottle 500ml', type: 'Bottle', category: 'Oil' },
  { name: 'Honey Jar 250g', type: 'Glass Jar', category: 'Natural' },
  
  // Medicine
  { name: 'Paracetamol 500mg', type: 'Bottle', category: 'Medicine' },
  { name: 'Vitamin C Tablets', type: 'Bottle', category: 'Supplement' },
  { name: 'Cough Syrup 100ml', type: 'Bottle', category: 'Medicine' },
  
  // Cosmetics
  { name: 'Face Cream Jar 50ml', type: 'Glass Jar', category: 'Skincare' },
  { name: 'Foundation Bottle 30ml', type: 'Bottle', category: 'Makeup' },
  { name: 'Shampoo Bottle 400ml', type: 'Bottle', category: 'Haircare' },
  
  // Electronics
  { name: 'Smartphone Case', type: 'Box', category: 'Mobile' },
  { name: 'USB Cable Package', type: 'Box', category: 'Accessory' },
  { name: 'Bluetooth Earphone', type: 'Box', category: 'Audio' },
  
  // Others
  { name: 'Snack Pack', type: 'Pouch', category: 'Snack' },
  { name: 'Coffee Powder', type: 'Metal Tin', category: 'Beverage' },
];


const mockData: Product[] = PRODUCT_DATA.map((item, i) => {
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000)); 
  const hasUpdate = Math.random() > 0.6; 
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)) : null;

  return {
    productId: `PROD${String(i + 1).padStart(4, '0')}`, 
    productName: item.name,
    productTypeId: 'PT0011',
    productTypeName: item.type,
    serialNo: `${item.category.substring(0, 2).toUpperCase()}${Date.now() + i}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    status: Math.random() > 0.15 ? 1 : 0,
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'manager', 'operator'][Math.floor(Math.random() * 4)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'manager', 'operator'][Math.floor(Math.random() * 3)] : null,
  };
});


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
    productTypeId: randomProduct.type,
    productTypeName: randomProduct.type,
    serialNo: `${randomProduct.category.substring(0, 2).toUpperCase()}${Date.now() + i}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    status: Math.random() > 0.15 ? 1 : 0,
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'manager', 'operator'][Math.floor(Math.random() * 4)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'manager', 'operator'][Math.floor(Math.random() * 3)] : null,
  });
}


export const search = async (param?: ParamSearch) => { 
  console.log('Product service received params:', param);
  
  if (!param) return mockData;

  const filteredData = mockData.filter(item => {
    const productIdMatch = !param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase());
    const productNameMatch = !param.productName || item.productName.toLowerCase().includes(param.productName.toLowerCase());
    const productTypeMatch = !param.productTypeName || item.productTypeName?.toLowerCase().includes(param.productTypeName.toLowerCase());
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

  // const res = await api.get<string>(`${API_ROUTES.product.get}`);
  // console.log('get product:', res);
  // res
  // {
  //       "prodid": "G0123",
  //       "prodname": "Grape juice",
  //       "prodtypeid": "B0002",
  //       "prodserial": "SR1234567",
  //       "prodstatus": true,
  //       "createdby": "TH0001",
  //       "createddate": "2025-05-27T09:43:30.399727",
  //       "updatedby": null,
  //       "updateddate": null,
  //       "isdeleted": true
  //   }
  
  // productId: string
  // productName: string
  // productTypeId: string
  // productTypeName: string
  // serialNo: string
  // status: number
  // createdDate?: Date | null
  // createdBy?: string
  // updatedDate?: Date | null
  // updatedBy?: string | null
};

export const detail = async (id: string) => {

  return mockData.find(item => item.productId === id);
};

export const create = async (param: Partial<Product>) => {

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
  

  mockData.push(newProduct as Product);
  return newProduct;
};

export const update = async (param: Partial<Product>) => {

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

  console.log('Deleting product:', id);
  const index = mockData.findIndex(item => item.productId === id);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
  return {};
};

export const upload = async (file: File) => {

  console.log('Uploading file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'File uploaded successfully' };
};


export const getProductOptions = async (): Promise<SelectOption[]> => {

  await new Promise(resolve => setTimeout(resolve, 500));
  const uniqueNames = [...new Set(mockData.map(item => item.productName))];
  return uniqueNames.map(name => ({ label: name, value: name }));
};
