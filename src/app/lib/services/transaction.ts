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

const removeTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStartDate = param.dateFrom ? removeTime(new Date(param.dateFrom)) : undefined;
  const parsedEndDate = param.dateTo ? removeTime(new Date(param.dateTo)) : undefined;

  return mockData.filter(item => {
    return (
      (parsedStartDate ? removeTime(item.startDate) >= parsedStartDate : true) &&
      (parsedEndDate ? removeTime(item.endDate) <= parsedEndDate : true) &&
      (!param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase())) &&
      (!param.lotNo || item.lotNo.toLowerCase().includes(param.lotNo.toLowerCase()))
    );
  });
  // const lotNo = await api.get<Transaction[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.lotNo === id);
  // return await apiClient<Transaction>(`${apiUrl}/detail/${id}`, "GET");
};

