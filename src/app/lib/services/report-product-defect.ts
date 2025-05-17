import { api } from '@/app/utils/api'
import type { ReportProduct, ParamSearch, ProductDetail  } from "@/app/types/report-product-defect"

const mockData: ReportProduct[] = Array.from({ length: 20 }, (_, i) => ({
  datetime: new Date,
  productId: `PROD${i+1}`,
  productName: `Name${i+1}`,
  lotNo: `LOT${i+1}`,
  status: 'NG',
  defectType: i % 2 === 0 ? 'No sealed' : 'QuantityNG',
  cameraId: i % 2 === 0 ? "1" : "2",
}))

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.productName || item.productId.includes(param.productName)) &&
      (!param.defectType || item.defectType.toLowerCase().includes(param.defectType.toLowerCase()))
    );
  });
  // const product = await api.get<Product[]>('/search')
};

export const detail = async (id: string) => {
  const _mockData: ProductDetail = {
    productId: `${id}`,
    productName: `N${id}`,
    serialNo: `SN${id}`,
    date: '09/04/2025',
    time: '15:23:44',
    lotNo: `LOT${id}`,
    defectType: `DT${id}`,
    cameraId: `CAM${id}`,
    history: [
      { date: '07/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '06/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '05/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '04/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '03/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '02/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '01/04/2025', time: '10:30:00', updatedBy: 'admin'}
    ],
    status: 'OK',
    comment: '',
  }
  return _mockData;
  // return mockData.find(item => item.productId === id);
  // return await apiClient<Product>(`${apiUrl}/detail/${id}`, "GET");
};

export const update = async (param: Partial<ReportProduct>) => {
  return param;
  // const updated = await api.put<Product>(`/update/${param.id}`, param)
};



