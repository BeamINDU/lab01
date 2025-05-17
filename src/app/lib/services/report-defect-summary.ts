import { api } from '@/app/utils/api'
import type { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"

const mockData: ReportDefect[] = Array.from({ length: 20 }, (_, i) => ({
  lotNo: `LOT${i+1}`,
  productType: i % 2 === 0 ? 'Bottle' : 'Box',
  defectType: i % 2 === 0 ? 'No sealed' : 'QuantityNG',
  total: i % 2 === 0 ? 100 : 200,
  ok: i % 2 === 0 ? 50.12 : 52.99,
  ng: i % 2 === 0 ? 99.43 : 78.43,
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.lotNo || item.lotNo.includes(param.lotNo)) &&
      (!param.productType || item.productType.toLowerCase().includes(param.productType.toLowerCase()))
    );
  });
  // const product = await api.get<Product[]>('/search')
};

export const detail = async (id: string) => {
  return mockData.find(item => item.lotNo === id);
  // return await apiClient<Product>(`${apiUrl}/detail/${id}`, "GET");
};

