import { api } from '@/app/utils/api'
import type { Transaction, ParamSearch } from "@/app/types/transaction"
import { getProductOptions } from '@/app/libs/services/product';
import { search as getReportDefectSummary } from '@/app/libs/services/report-defect-summary';

let cachedProductIds: string[] = [];
let cachedLotNumbers: string[] = [];

//  ฟังก์ชันสำหรับโหลดข้อมูลจาก services อื่น
const loadMasterData = async () => {
  if (cachedProductIds.length === 0) {
    try {
      // โหลดข้อมูล Product IDs
      const productOptions = await getProductOptions();
      // สร้าง Product ID จากชื่อสินค้า
      cachedProductIds = productOptions.map((_, index) => `PROD${String(index + 1).padStart(4, '0')}`);
      
      // โหลดข้อมูล Lot Numbers จาก Report Defect Summary
      const defectSummaryData = await getReportDefectSummary();
      cachedLotNumbers = defectSummaryData.map(item => item.lotNo);
      
      console.log('Transaction master data loaded:', {
        productIds: cachedProductIds.length,
        lotNumbers: cachedLotNumbers.length
      });
    } catch (error) {
      console.error('Failed to load master data for transaction:', error);
      // Fallback ถ้าโหลดไม่ได้
      cachedProductIds = ['PROD0001', 'PROD0002', 'PROD0003', 'PROD0004'];
      cachedLotNumbers = ['LOT001', 'LOT002', 'LOT003', 'LOT004'];
    }
  }
};

//  สร้าง Mock Data โดยใช้ข้อมูลจาก services อื่น
const generateMockData = async (): Promise<Transaction[]> => {

  await loadMasterData();
  
  return Array.from({ length: 30 }, (_, i) => {

    const randomDaysAgo = Math.floor(Math.random() * 30);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - randomDaysAgo);
    

    const productionHours = Math.floor(Math.random() * 8) + 1;
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + productionHours);
    
    // สุ่มข้อมูลจาก master data
    const lotNo = cachedLotNumbers[Math.floor(Math.random() * cachedLotNumbers.length)];
    const productId = cachedProductIds[Math.floor(Math.random() * cachedProductIds.length)];
    const quantity = Math.floor(Math.random() * 5000) + 500; // 500-5500 ชิ้น

    return {
      runningNo: i + 1,
      startDate: startDate,
      endDate: endDate,
      lotNo: lotNo,
      productId: productId,
      quantity: quantity,
      createdDate: new Date(),
      createdBy: 'system',
      updatedDate: null,
      updatedBy: null,
    };
  });
};

//  สร้าง mock data (จะโหลดครั้งแรกเมื่อมีการเรียกใช้)
let mockDataPromise: Promise<Transaction[]> | null = null;

const getMockData = async (): Promise<Transaction[]> => {
  if (!mockDataPromise) {
    mockDataPromise = generateMockData();
  }
  const data = await mockDataPromise;
  return [...data].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
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
      (parsedStartDate ? removeTime(item.startDate) >= parsedStartDate : true) &&
      (parsedEndDate ? removeTime(item.endDate) <= parsedEndDate : true) &&
      (!param.productId || item.productId.toLowerCase().includes(param.productId.toLowerCase())) &&
      (!param.lotNo || item.lotNo.toLowerCase().includes(param.lotNo.toLowerCase()))
    );
  });
};

export const detail = async (id: string) => {
  const mockData = await getMockData();
  return mockData.find(item => item.lotNo === id);
};



// functions สำหรับใช้ใน SearchField
export const getTransactionLotOptions = async () => {
  const mockData = await getMockData();
  return mockData.map(item => ({ lotNo: item.lotNo }));
};

export const getTransactionProductOptions = async () => {
  const mockData = await getMockData();
  return mockData.map(item => ({ productId: item.productId }));
};