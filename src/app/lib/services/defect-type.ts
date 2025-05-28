// src/app/lib/services/defect-type.ts
import { api } from '@/app/utils/api'
import type { DefectType, ParamSearch } from "@/app/types/defect-type"
import { SelectOption } from "@/app/types/select-option";

const mockData: DefectType[] = Array.from({ length: 20 }, (_, i) => ({
  defectTypeId: `DT${i+1}`,
  defectTypeName: `DTName${i+1}`,
  description: 'description description description description',
  status: i % 2 === 0 ? 1 : 0,
  createdDate: new Date(),
  createdBy: 'Admin',
  updatedDate: null,
  updatedBy: null,
}))

// ⭐ เพิ่ม mock data สำหรับ Defect Type Options
const mockDefectTypeOptions: SelectOption[] = [
  { label: 'Missing Part', value: 'missing-part' },
  { label: 'Misalignment', value: 'misalignment' },
  { label: 'Dent', value: 'dent' },
  { label: 'Crack', value: 'crack' },
  { label: 'Scratch', value: 'scratch' },
  { label: 'Color Defect', value: 'color-defect' },
  { label: 'Size Variation', value: 'size-variation' },
  { label: 'Surface Contamination', value: 'surface-contamination' },
  { label: 'Print Quality Issue', value: 'print-quality-issue' },
  { label: 'Seal Defect', value: 'seal-defect' },
  { label: 'Shape Distortion', value: 'shape-distortion' },
  { label: 'Label Placement', value: 'label-placement' },
];

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  // ⭐ เพิ่มการจัดการ status parameter
  const parsedStatus = isNaN(Number(param.status)) ? undefined : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.defectTypeId || item.defectTypeId.toLowerCase().includes(param.defectTypeId.toLowerCase())) &&
      (!param.defectTypeName || item.defectTypeName.toLowerCase().includes(param.defectTypeName.toLowerCase())) &&
      (parsedStatus === undefined || item.status === parsedStatus) // 
    );
  });
};

export const detail = async (id: string) => {
  return mockData.find(item => item.defectTypeId === id);
};

export const create = async (param: Partial<DefectType>) => {
  return param;
};

export const update = async (param: Partial<DefectType>) => {
  return param;
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ⭐ เพิ่ม function สำหรับดึงข้อมูล Defect Type Options
export const getDefectTypeOptions = async (): Promise<SelectOption[]> => {
  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDefectTypeOptions;
    
    // ในการใช้งานจริง อาจจะดึงจาก mockData:
    // const defectTypes = await search(); // ดึงข้อมูลทั้งหมด
    // return defectTypes.map(item => ({
    //   label: item.defectTypeName,
    //   value: item.defectTypeId
    // }));
    
    // หรือเรียก API โดยตรง:
    // return await api.get<SelectOption[]>('/defect-type-options');
  } catch (error) {
    console.error('Failed to fetch defect type options:', error);
    throw error;
  }
};