import { api } from '@/app/utils/api'
import type { Planning, ParamSearch } from "@/app/types/planning"
// ⭐ Import ข้อมูลจาก services อื่น
import { getProductOptions } from '@/app/libs/services/product';

// ⭐ Line ID data จากระบบจริง
const LINE_DATA = [
  { id: 'LINE-001', name: 'Production Line A' },
  { id: 'LINE-002', name: 'Production Line B' },
  { id: 'LINE-003', name: 'Production Line C' },
  { id: 'LINE-004', name: 'Packaging Line 1' },
  { id: 'LINE-005', name: 'Packaging Line 2' },
  { id: 'LINE-006', name: 'Quality Line' },
  { id: 'LINE-007', name: 'Assembly Line' },
];

// ⭐ Cache สำหรับเก็บข้อมูลที่ดึงมาแล้ว
let cachedProductIds: string[] = [];
let cachedLineIds: string[] = [];

// ⭐ ฟังก์ชันสำหรับโหลดข้อมูลจาก services อื่น
const loadMasterData = async () => {
  if (cachedProductIds.length === 0) {
    try {
      // โหลดข้อมูล Product IDs
      const productOptions = await getProductOptions();
      // สร้าง Product ID จากชื่อสินค้า
      cachedProductIds = productOptions.map((_, index) => `PROD${String(index + 1).padStart(4, '0')}`);
      
      // โหลดข้อมูล Line IDs
      cachedLineIds = LINE_DATA.map(line => line.id);
      
      console.log('Planning master data loaded:', {
        productIds: cachedProductIds.length,
        lineIds: cachedLineIds.length
      });
    } catch (error) {
      console.error('Failed to load master data for planning:', error);
      // Fallback ถ้าโหลดไม่ได้
      cachedProductIds = ['PROD0001', 'PROD0002', 'PROD0003', 'PROD0004'];
      cachedLineIds = ['LINE-001', 'LINE-002', 'LINE-003'];
    }
  }
};

// ⭐ สร้าง Mock Data โดยใช้ข้อมูลจาก services อื่น
const generateMockData = async (): Promise<Planning[]> => {
  // โหลด master data ก่อน
  await loadMasterData();
  
  return Array.from({ length: 30 }, (_, i) => {
    // สร้างวันที่ในอนาคต (สำหรับการวางแผน)
    const randomDaysAhead = Math.floor(Math.random() * 60) + 1; // 1-60 วันข้างหน้า
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + randomDaysAhead);
    
    // สุ่มระยะเวลาการผลิต (4-48 ชั่วโมง)
    const productionHours = Math.floor(Math.random() * 44) + 4;
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + productionHours);
    
    // ✅ ใช้ index เพื่อให้ไม่ซ้ำกัน
    const productIdIndex = i % cachedProductIds.length;
    const lineIdIndex = i % cachedLineIds.length;
    
    // ✅ สร้าง unique identifiers
    const planId = `PLAN-${String(i + 1).padStart(4, '0')}`;
    const productId = cachedProductIds[productIdIndex];
    const lineId = cachedLineIds[lineIdIndex];
    const lotNo = `LOT-${String(i + 1).padStart(3, '0')}`; // สร้างเอง ไม่ขึ้นกับข้อมูลอื่น
    const quantity = Math.floor(Math.random() * 10000) + 1000; // 1000-11000 ชิ้น

    return {
      planId: planId,
      productId: productId,
      lotNo: lotNo,
      lineId: lineId,
      quantity: quantity,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdDate: new Date().toISOString(),
      createdBy: 'planner',
      updatedDate: new Date().toISOString(),
      updatedBy: 'planner',
    };
  });
};

// ⭐ สร้าง mock data (จะโหลดครั้งแรกเมื่อมีการเรียกใช้)
let mockDataPromise: Promise<Planning[]> | null = null;

const getMockData = async (): Promise<Planning[]> => {
  if (!mockDataPromise) {
    mockDataPromise = generateMockData();
  }
  const data = await mockDataPromise;
  // เรียงตาม planId
  return [...data].sort((a, b) => a.planId.localeCompare(b.planId));
};

const removeTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const search = async (param?: ParamSearch) => { 
  const mockData = await getMockData();
  
  console.log("Planning service received params:", param);
  
  if (!param) {
    console.log("No parameters provided, returning all planning data");
    return mockData;
  }

  const parsedStartDate = param.dateFrom ? removeTime(new Date(param.dateFrom)) : undefined;
  const parsedEndDate = param.dateTo ? removeTime(new Date(param.dateTo)) : undefined;

  return mockData.filter(item => {
    return (
      (parsedStartDate ? removeTime(new Date(item.startDate)) >= parsedStartDate : true) &&
      (parsedEndDate ? removeTime(new Date(item.endDate)) <= parsedEndDate : true) &&
      (!param.planId || item.planId.includes(param.planId)) && 
      (!param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase())) &&
      (!param.lotNo || item.lotNo.toLowerCase().includes(param.lotNo.toLowerCase())) &&
      (!param.lineId || item.lineId.toLowerCase().includes(param.lineId.toLowerCase()))
    );
  });
};

export const detail = async (id: string) => {
  console.log("Planning detail function called for id:", id);
  
  const mockData = await getMockData();
  const foundItem = mockData.find(item => item.productId === id || item.planId === id);
  console.log("Found planning item:", foundItem);
  
  return foundItem;
};

export const create = async (param: Partial<Planning>) => {
  console.log("Create planning function called with param:", param);
  return param;
};

export const update = async (param: Partial<Planning>) => {
  console.log("Update planning function called with param:", param);
  return param;
};

export const remove = async (id: string) => {
  console.log("Remove planning function called for id:", id);
  return {};
};

export const upload = async (file: File) => {
  console.log("Upload planning function called with file:", file.name);
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ⭐ เพิ่ม functions สำหรับใช้ใน SearchField และ Form
export const getPlanningProductOptions = async () => {
  const mockData = await getMockData();
  const uniqueProductIds = [...new Set(mockData.map(item => item.productId))];
  return uniqueProductIds.map((productId, index) => ({ 
    id: `planning-prod-${index}`, 
    productId: productId 
  }));
};

export const getPlanningLineOptions = async () => {
  const mockData = await getMockData();
  const uniqueLineIds = [...new Set(mockData.map(item => item.lineId))];
  return uniqueLineIds.map((lineId, index) => ({ 
    id: `planning-line-${index}`, 
    lineId: lineId 
  }));
};

export const getPlanningLotOptions = async () => {
  const mockData = await getMockData();
  const uniqueLotNos = [...new Set(mockData.map(item => item.lotNo))];
  return uniqueLotNos.map((lotNo, index) => ({ 
    id: `planning-lot-${index}`, 
    lotNo: lotNo 
  }));
};

export const getPlanningPlanOptions = async () => {
  const mockData = await getMockData();
  const uniquePlanIds = [...new Set(mockData.map(item => item.planId))];
  return uniquePlanIds.map((planId, index) => ({ 
    id: `planning-plan-${index}`, 
    planId: planId 
  }));
};

// ⭐ เพิ่ม functions สำหรับ Form (SelectOption format)
export const getProductIdOptions = async () => {
  await loadMasterData();
  return cachedProductIds.map((productId, index) => ({
    label: productId,
    value: productId,
    id: `form-prod-${index}`
  }));
};

export const getLineIdOptions = async () => {
  await loadMasterData();
  return LINE_DATA.map((line, index) => ({
    label: `${line.name} (${line.id})`,
    value: line.id,
    id: `form-line-${index}`
  }));
};

// ⭐ เพิ่ม function สำหรับรีเซ็ต cache
export const resetCache = () => {
  cachedProductIds = [];
  cachedLineIds = [];
  mockDataPromise = null;
};