// src/app/lib/services/defect-type.ts - Complete Realistic Mock Data
import { api } from '@/app/utils/api'
import type { DefectType, ParamSearch } from "@/app/types/defect-type"
import { SelectOption } from "@/app/types/select-option";

// ⭐ ประเภทความเสียหายจริงในโรงงาน
const DEFECT_CATEGORIES = [
  // Surface Defects
  { 
    id: 'SURF001', 
    name: 'Surface Scratch', 
    description: 'Visible scratches on product surface that affect appearance and quality',
    category: 'Surface',
    severity: 'Medium'
  },
  { 
    id: 'SURF002', 
    name: 'Surface Dent', 
    description: 'Physical indentations or depressions on product surface',
    category: 'Surface',
    severity: 'High'
  },
  { 
    id: 'SURF003', 
    name: 'Surface Contamination', 
    description: 'Foreign particles, dust, or chemical residues on surface',
    category: 'Surface',
    severity: 'Medium'
  },
  { 
    id: 'SURF004', 
    name: 'Surface Discoloration', 
    description: 'Unexpected color changes or color inconsistency',
    category: 'Surface',
    severity: 'Low'
  },
  
  // Dimensional Defects
  { 
    id: 'DIM001', 
    name: 'Oversized Product', 
    description: 'Product dimensions exceed specified tolerance limits',
    category: 'Dimensional',
    severity: 'High'
  },
  { 
    id: 'DIM002', 
    name: 'Undersized Product', 
    description: 'Product dimensions below specified tolerance limits',
    category: 'Dimensional',
    severity: 'High'
  },
  { 
    id: 'DIM003', 
    name: 'Shape Distortion', 
    description: 'Product shape deviates from specified design',
    category: 'Dimensional',
    severity: 'High'
  },
  
  // Structural Defects
  { 
    id: 'STRUCT001', 
    name: 'Crack Formation', 
    description: 'Visible cracks in product structure compromising integrity',
    category: 'Structural',
    severity: 'Critical'
  },
  { 
    id: 'STRUCT002', 
    name: 'Material Weakness', 
    description: 'Weak points in material structure that may lead to failure',
    category: 'Structural',
    severity: 'High'
  },
  { 
    id: 'STRUCT003', 
    name: 'Joint Failure', 
    description: 'Failure at connection points or joints',
    category: 'Structural',
    severity: 'Critical'
  },
  
  // Assembly Defects
  { 
    id: 'ASM001', 
    name: 'Missing Component', 
    description: 'Required component is missing from assembled product',
    category: 'Assembly',
    severity: 'Critical'
  },
  { 
    id: 'ASM002', 
    name: 'Wrong Component', 
    description: 'Incorrect component used in assembly',
    category: 'Assembly',
    severity: 'High'
  },
  { 
    id: 'ASM003', 
    name: 'Loose Assembly', 
    description: 'Components not properly secured in assembly',
    category: 'Assembly',
    severity: 'Medium'
  },
  { 
    id: 'ASM004', 
    name: 'Misalignment', 
    description: 'Components not properly aligned according to specifications',
    category: 'Assembly',
    severity: 'Medium'
  },
  
  // Packaging Defects
  { 
    id: 'PKG001', 
    name: 'Label Misplacement', 
    description: 'Product label positioned incorrectly',
    category: 'Packaging',
    severity: 'Low'
  },
  { 
    id: 'PKG002', 
    name: 'Seal Defect', 
    description: 'Packaging seal is incomplete or compromised',
    category: 'Packaging',
    severity: 'High'
  },
  { 
    id: 'PKG003', 
    name: 'Package Damage', 
    description: 'Physical damage to product packaging',
    category: 'Packaging',
    severity: 'Medium'
  },
  { 
    id: 'PKG004', 
    name: 'Incorrect Labeling', 
    description: 'Wrong information printed on product label',
    category: 'Packaging',
    severity: 'High'
  },
  
  // Print Quality Defects
  { 
    id: 'PRINT001', 
    name: 'Blurred Print', 
    description: 'Text or graphics appear blurred or unclear',
    category: 'Print Quality',
    severity: 'Medium'
  },
  { 
    id: 'PRINT002', 
    name: 'Incomplete Print', 
    description: 'Missing or partially printed text/graphics',
    category: 'Print Quality',
    severity: 'High'
  },
  { 
    id: 'PRINT003', 
    name: 'Color Variance', 
    description: 'Printed colors do not match specified standards',
    category: 'Print Quality',
    severity: 'Medium'
  },
];

// ⭐ สร้าง Mock Data
const mockData: DefectType[] = DEFECT_CATEGORIES.map((defect, i) => {
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 1095 * 24 * 60 * 60 * 1000)); // สุ่ม 3 ปีย้อนหลัง
  const hasUpdate = Math.random() > 0.8; // 20% โอกาสที่จะมีการอัพเดท
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 365 * 24 * 60 * 60 * 1000)) : null;

  return {
    defectTypeId: defect.id,
    defectTypeName: defect.name,
    description: defect.description,
    status: defect.severity === 'Critical' ? 1 : Math.random() > 0.05 ? 1 : 0, // Critical defects always active, others 95% active
    createdDate: createdDate,
    createdBy: i < 5 ? 'system' : ['admin', 'quality_manager', 'engineer'][Math.floor(Math.random() * 3)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'quality_manager', 'engineer'][Math.floor(Math.random() * 3)] : null,
  };
});

// ⭐ API-Ready Functions
export const search = async (param?: ParamSearch) => { 
  console.log('DefectType service received params:', param);
  
  // TODO: Replace with actual API call
  // const response = await api.get<DefectType[]>('/defect-types', { params: param });
  // return response;
  
  if (!param) return mockData;

  // ✅ จัดการ status parameter ให้ปลอดภัย
  let parsedStatus: number | undefined = undefined;
  if (param.status !== undefined && param.status !== null && param.status.toString().trim() !== '') {
    const statusNum = Number(param.status);
    if (!isNaN(statusNum)) {
      parsedStatus = statusNum;
    }
  }

  const filteredData = mockData.filter(item => {
    const defectTypeIdMatch = !param.defectTypeId || item.defectTypeId.toLowerCase().includes(param.defectTypeId.toLowerCase());
    const defectTypeNameMatch = !param.defectTypeName || item.defectTypeName.toLowerCase().includes(param.defectTypeName.toLowerCase());
    const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
    return defectTypeIdMatch && defectTypeNameMatch && statusMatch;
  });
  
  console.log('DefectType filtered results:', filteredData.length, 'items');
  return filteredData;
};

export const detail = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.get<DefectType>(`/defect-types/${id}`);
  
  return mockData.find(item => item.defectTypeId === id);
};

export const create = async (param: Partial<DefectType>) => {
  // TODO: Replace with actual API call
  // return await api.post<DefectType>('/defect-types', param);
  
  console.log('Creating defect type:', param);
  const newDefectType = {
    ...param,
    defectTypeId: param.defectTypeId || `DT${String(mockData.length + 1).padStart(3, '0')}`,
    status: param.status ?? 1,
    createdDate: new Date(),
    createdBy: param.createdBy || 'admin',
    updatedDate: null,
    updatedBy: null,
  };
  
  mockData.push(newDefectType as DefectType);
  return newDefectType;
};

export const update = async (param: Partial<DefectType>) => {
  // TODO: Replace with actual API call
  // return await api.put<DefectType>(`/defect-types/${param.defectTypeId}`, param);
  
  console.log('Updating defect type:', param);
  const index = mockData.findIndex(item => item.defectTypeId === param.defectTypeId);
  if (index !== -1) {
    mockData[index] = {
      ...mockData[index],
      ...param,
      updatedDate: new Date(),
      updatedBy: param.updatedBy || 'admin'
    };
    return mockData[index];
  }
  
  return {
    ...param,
    updatedDate: new Date(),
    updatedBy: param.updatedBy || 'admin'
  };
};

export const remove = async (id: string) => {
  // TODO: Replace with actual API call
  // return await api.delete(`/defect-types/${id}`);
  
  console.log('Deleting defect type:', id);
  const index = mockData.findIndex(item => item.defectTypeId === id);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
  return {};
};

export const upload = async (file: File) => {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // return await api.post('/defect-types/upload', formData);
  
  console.log('Uploading defect type file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'Defect type file uploaded successfully' };
};

// ⭐ เพิ่ม function สำหรับดึงข้อมูล Defect Type Options
export const getDefectTypeOptions = async (): Promise<SelectOption[]> => {
  // TODO: Replace with actual API call
  // return await api.get<SelectOption[]>('/defect-types/options');
  
  console.log('Loading DefectType options...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // ส่งเฉพาะ DefectType ที่ Active เท่านั้น
  const activeDefectTypes = mockData.filter(item => item.status === 1);
  
  const options = activeDefectTypes.map(item => ({
    label: item.defectTypeName,
    value: item.defectTypeId
  }));
  
  console.log('DefectType options loaded:', options.length, 'items');
  return options;
};