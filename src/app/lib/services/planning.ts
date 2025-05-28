import { api } from '@/app/utils/api'
import type { Planning, ParamSearch } from "@/app/types/planning"

// แก้ไขข้อมูล mock ให้มีรูปแบบวันที่ที่ชัดเจน
const mockData: Planning[] = Array.from({ length: 20 }, (_, i) => {
  // สร้างวันที่แบบชัดเจนเป็น string ที่ตรงกับรูปแบบที่เราใช้
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - i); // วันที่ย้อนหลัง i วัน
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - i + 7); // วันที่ย้อนหลัง i วัน + 7 วัน
  
  return {
    productId: `PRD${i+1}`,
    planId: `PLAN-${i+1}`,
    lotNo: `LOT-${i+1}`,
    lineId:`Line ${i+1}`,
    quantity: i,
    startDate: startDate.toISOString(), 
    endDate: endDate.toISOString(),
    createdDate: new Date().toISOString(),
    createdBy: 'admin',
    updatedDate: new Date().toISOString(),
    updatedBy: 'admin',
  }
})

const removeTime = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const search = async (param?: ParamSearch) => { 
  console.log("Search function called with params:", param);
  
  if (!param) {
    console.log("No params provided, returning all mock data");
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
  console.log("Detail function called for id:", id);
  
  const foundItem = mockData.find(item => item.productId === id || item.planId === id);
  console.log("Found item:", foundItem);
  
  return foundItem;
};

export const create = async (param: Partial<Planning>) => {
  console.log("Create function called with param:", param);
  return param;
};

export const update = async (param: Partial<Planning>) => {
  console.log("Update function called with param:", param);
  return param;
};

export const remove = async (id: string) => {
  console.log("Remove function called for id:", id);
  return {};
};

export const upload = async (file: File) => {
  console.log("Upload function called with file:", file.name);
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};