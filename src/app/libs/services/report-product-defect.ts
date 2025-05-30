import { api } from '@/app/utils/api'
import type { ReportProduct, ParamSearch, ProductDetail  } from "@/app/types/report-product-defect"
import { getProductOptions } from '@/app/libs/services/product';
import { getDefectTypeOptions } from '@/app/libs/services/defect-type';
import { getCameraOptions } from '@/app/libs/services/camera';

//  Cache สำหรับเก็บข้อมูลที่ดึงมาแล้ว
let cachedProductNames: string[] = [];
let cachedDefectTypes: string[] = [];
let cachedCameraNames: string[] = [];

//  ฟังก์ชันสำหรับโหลดข้อมูลจาก services อื่น
const loadMasterData = async () => {
  if (cachedProductNames.length === 0) {
    try {
      // โหลดข้อมูล Product Names
      const productOptions = await getProductOptions();
      cachedProductNames = productOptions.map(opt => opt.label);
      
      // โหลดข้อมูล Defect Types  
      const defectOptions = await getDefectTypeOptions();
      cachedDefectTypes = defectOptions.map(opt => opt.label);
      
      // โหลดข้อมูล Camera Names
      const cameraOptions = await getCameraOptions();
      cachedCameraNames = cameraOptions.map(opt => {
        return opt.label.split(' - ')[0];
      });
      
      console.log('Master data loaded:', {
        products: cachedProductNames.length,
        defects: cachedDefectTypes.length,
        cameras: cachedCameraNames.length
      });
    } catch (error) {
      console.error('Failed to load master data:', error);
      cachedProductNames = ['Coca Cola Classic 330ml', 'Pepsi Cola 500ml', 'Sprite Lemon 350ml'];
      cachedDefectTypes = ['Surface Scratch', 'No sealed', 'QuantityNG'];
      cachedCameraNames = ['CAM-LA-01', 'CAM-LA-02', 'CAM-LB-01'];
    }
  }
};

//  สร้าง Mock Data โดยใช้ข้อมูลจาก services อื่น
const generateMockData = async (): Promise<ReportProduct[]> => {

  await loadMasterData();
  
  return Array.from({ length: 50 }, (_, i) => {

    const randomDaysAgo = Math.floor(Math.random() * 7);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - randomDaysAgo);
    baseDate.setHours(randomHours, randomMinutes, randomSeconds);

    const productName = cachedProductNames[Math.floor(Math.random() * cachedProductNames.length)];
    const defectType = cachedDefectTypes[Math.floor(Math.random() * cachedDefectTypes.length)];
    const cameraName = cachedCameraNames[Math.floor(Math.random() * cachedCameraNames.length)];

    const status = Math.random() > 0.8 ? 'OK' : 'NG';

    return {
      datetime: baseDate,
      productId: `PROD${String(i + 1).padStart(4, '0')}`,
      productName: productName,
      lotNo: `LOT${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
      status: status,
      defectType: status === 'OK' ? 'None' : defectType,
      cameraName: cameraName,
    };
  });
};

//  สร้าง mock data 
let mockDataPromise: Promise<ReportProduct[]> | null = null;

const getMockData = async (): Promise<ReportProduct[]> => {
  if (!mockDataPromise) {
    mockDataPromise = generateMockData();
  }
  const data = await mockDataPromise;
  return [...data].sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
};

const removeTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const search = async (param?: ParamSearch) => { 
  const mockData = await getMockData();
  
  if (!param) return mockData;

  const parsedStartDate = param.dateFrom ? removeTime(new Date(param.dateFrom)) : undefined;
  const parsedEndDate = param.dateTo ? removeTime(new Date(param.dateTo)) : undefined;

  return mockData.filter(item => {
    return (
      (parsedStartDate ? removeTime(item.datetime) >= parsedStartDate : true) &&
      (parsedEndDate ? removeTime(item.datetime) <= parsedEndDate : true) &&
      (!param.productName || item.productName.toLowerCase().includes(param.productName.toLowerCase())) &&
      (!param.defectType || item.defectType.toLowerCase().includes(param.defectType.toLowerCase())) &&
      (!param.cameraName || item.cameraName.toLowerCase().includes(param.cameraName.toLowerCase()))
    );
  });
};

export const detail = async (id: string) => {
  const mockData = await getMockData();
  
  // หา product จาก mock data
  const product = mockData.find(item => item.productId === id);
  if (!product) return null;

  const _mockData: ProductDetail = {
    productId: product.productId,
    productName: product.productName,
    serialNo: `SN${product.productId.slice(-4)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    date: product.datetime.toLocaleDateString('en-GB'),
    time: product.datetime.toLocaleTimeString('en-GB'),
    lotNo: product.lotNo,
    defectType: product.defectType,
    cameraId: product.cameraName.replace('CAM-', '').replace('-', ''),
    cameraName: product.cameraName,
    history: [
      { date: '07/04/2025', time: '10:30:00', updatedBy: 'admin'},
      { date: '06/04/2025', time: '10:30:00', updatedBy: 'quality_inspector'},
      { date: '05/04/2025', time: '10:30:00', updatedBy: 'operator'},
      { date: '04/04/2025', time: '10:30:00', updatedBy: 'supervisor'},
      { date: '03/04/2025', time: '10:30:00', updatedBy: 'admin'},
    ],
    status: product.status,
    comment: product.status === 'NG' ? 'Auto-detected defect by AI system' : 'Manually verified as good quality',
  };
  
  return _mockData;
};

export const update = async (param: Partial<ReportProduct>) => {
  console.log('Updating report product:', param);
  return param;
};

