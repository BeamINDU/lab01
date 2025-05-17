import { api } from '@/app/utils/api'
import type { Transaction, ParamSearch } from "@/app/types/transaction"

const mockData: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
  runningNo: i+1,
  startDate: new Date(),
  endDate: new Date(),
  lotNo: `LOT${i+1}`,
  productId: `PROD${i+1}`,
  quantity: i+1000,
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: new Date(),
  updatedBy: 'admin',
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.lotNo || item.lotNo.includes(param.lotNo)) &&
      (!param.productId || item.lotNo.includes(param.productId))
    );
  });
  // const lotNo = await api.get<Transaction[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.lotNo === id);
  // return await apiClient<Transaction>(`${apiUrl}/detail/${id}`, "GET");
};

