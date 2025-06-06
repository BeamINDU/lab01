import { api } from '@/app/utils/api'
import type { ReportDefect, ParamSearch } from "@/app/types/report-defect-summary"
import { getProductTypeNameOptions } from '@/app/libs/services/product-type';
import { getDefectTypeOptions } from '@/app/libs/services/defect-type';

// Cache สำหรับเก็บข้อมูลที่ดึงมาแล้ว
let cachedProductTypes: string[] = [];
let cachedDefectTypes: string[] = [];

// ฟังก์ชันสำหรับโหลดข้อมูลจาก services อื่น
const loadMasterData = async () => {
  if (cachedProductTypes.length === 0) {
    try {
      // โหลดข้อมูล Product Types
      // const productTypeOptions = await getProductTypeNameOptions();
      // cachedProductTypes = productTypeOptions.map(opt => opt.label);
      
      // โหลดข้อมูล Defect Types  
      const defectOptions = await getDefectTypeOptions();
      cachedDefectTypes = defectOptions.map(opt => opt.label);
      
      console.log('Defect Summary master data loaded:', {
        productTypes: cachedProductTypes.length,
        defects: cachedDefectTypes.length
      });
    } catch (error) {
      console.error('Failed to load master data for defect summary:', error);

      cachedProductTypes = ['Bottle', 'Box', 'Can', 'Plastic Container'];
      cachedDefectTypes = ['Surface Scratch', 'No sealed', 'QuantityNG', 'Missing Component'];
    }
  }
};


const generateMockData = async (): Promise<ReportDefect[]> => {
  // โหลด master data ก่อน
  await loadMasterData();
  
  return Array.from({ length: 25 }, (_, i) => {
    // สุ่มข้อมูลจาก master data
    const productType = cachedProductTypes[Math.floor(Math.random() * cachedProductTypes.length)];
    const defectType = cachedDefectTypes[Math.floor(Math.random() * cachedDefectTypes.length)];
    
    // สุ่มข้อมูลสถิติ
    const total = Math.floor(Math.random() * 1000) + 100; 
    const ngPercentage = Math.random() * 0.15 + 0.02; 
    const ngCount = Math.floor(total * ngPercentage);
    const okCount = total - ngCount;
    
    const okPercent = parseFloat(((okCount / total) * 100).toFixed(2));
    const ngPercent = parseFloat(((ngCount / total) * 100).toFixed(2));

    return {
      lotNo: `LOT${String(i + 1).padStart(3, '0')}`,
      productType: productType,
      defectType: defectType,
      total: total,
      ok: okPercent,
      ng: ngPercent,
    };
  });
};

// ⭐ สร้าง mock data (จะโหลดครั้งแรกเมื่อมีการเรียกใช้)
let mockDataPromise: Promise<ReportDefect[]> | null = null;

const getMockData = async (): Promise<ReportDefect[]> => {
  if (!mockDataPromise) {
    mockDataPromise = generateMockData();
  }
  return await mockDataPromise;
};

export const search = async (param?: ParamSearch) => { 
  const mockData = await getMockData();
  
  if (!param) return mockData;

  return mockData.filter(item => {
    return (
      (!param.lotNo || item.lotNo.toLowerCase().includes(param.lotNo.toLowerCase())) &&
      (!param.productType || item.productType.toLowerCase().includes(param.productType.toLowerCase())) &&
      (!param.defectType || item.defectType.toLowerCase().includes(param.defectType.toLowerCase())) 
    );
  });
};

export const detail = async (id: string) => {
  const mockData = await getMockData();
  return mockData.find(item => item.lotNo === id);
};

