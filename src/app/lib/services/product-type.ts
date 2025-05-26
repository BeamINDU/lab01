import { api } from '@/app/utils/api'
import type { ProductType, ParamSearch } from "@/app/types/product-type"

const mockData: ProductType[] = Array.from({ length: 20 }, (_, i) => ({
  productTypeId:  `PT-${i+1}`,
  productTypeName: `PT-Name${i+1}`,
  description: 'description description description description description',
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
      (!param.productTypeId || item.productTypeId.includes(param.productTypeId)) &&
      (!param.productTypeName || item.productTypeName.includes(param.productTypeName)) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
  // const productType = await api.get<ProductType[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.productTypeId === id);
  // return await apiClient<ProductType>(`${apiUrl}/detail/${id}`, "GET");
};

export const create = async (param: Partial<ProductType>) => {
  return param;
  // const newData = await api.post<ProductType>('/create', param)
};

export const update = async (param: Partial<ProductType>) => {
  return param;
  // const updated = await api.put<ProductType>(`/update/${param.id}`, param)
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