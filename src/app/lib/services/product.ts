import { api } from '@/app/utils/api'
import type { Product, ParamSearch } from "@/app/types/product"

const mockData: Product[] = Array.from({ length: 20 }, (_, i) => ({
  productId: `PROD${i+1}`,
  productName: i % 2 === 0 ? 'Grape' : 'Orange',
  productTypeName: i % 2 === 0 ? 'Bottle' : 'Box',
  serialNo: i % 2 === 0 ? '1234567890' : '0987654321',
  status: i % 2 === 0 ? 1 : 0,
  createdDate: new Date(),
  createdBy: 'admin',
  pdatedDate: null,
  updatedBy: null,
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined  : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase())) &&
      (!param.productName || item.productName.toLowerCase().includes(param.productName.toLowerCase())) &&
      (!param.productTypeName || item.productTypeName.toLowerCase().includes(param.productTypeName.toLowerCase())) &&
      (!param.serialNo || item.serialNo.toLowerCase().includes(param.serialNo.toLowerCase())) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
  // const product = await api.get<Product[]>('/search')
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
