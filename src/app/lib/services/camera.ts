// src/app/lib/services/camera.ts
import { api } from '@/app/utils/api'
import type { Camera, ParamSearch } from "@/app/types/camera"
import { SelectOption } from "@/app/types/select-option";

const mockData: Camera[] = Array.from({ length: 20 }, (_, i) => ({
  cameraId: `CAM${i+1}`,
  cameraName: `Name${i+1}`,
  location: i % 2 === 0 ? 'location1' : 'location2',
  status: i % 2 === 0 ? 1 : 0,
  createdDate: new Date(),
  createdBy: 'admin',
  updatedDate: null,
  updatedBy: null,
}))

// ⭐ เพิ่ม mock data สำหรับ Camera Options
const mockCameraOptions: SelectOption[] = [
  { label: 'CAM 1 - Location A', value: 'CAM001' },
  { label: 'CAM 2 - Location A', value: 'CAM002' },
  { label: 'CAM 3 - Location B', value: 'CAM003' },
  { label: 'CAM 4 - Location B', value: 'CAM004' },
  { label: 'CAM 5 - Location C', value: 'CAM005' },
  { label: 'CAM 6 - Location C', value: 'CAM006' },
  { label: 'CAM 7 - Location D', value: 'CAM007' },
  { label: 'CAM 8 - Location D', value: 'CAM008' },
];

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined  : Number(param.status);

  return mockData.filter(item => {
    return (
      (!param.cameraId || item.cameraId.toLowerCase().includes(param.cameraId.toLowerCase())) &&
      (!param.cameraName || item.cameraName.toLowerCase().includes(param.cameraName.toLowerCase())) &&
      (!param.location || item.location.toLowerCase().includes(param.location.toLowerCase())) &&
      (parsedStatus === undefined || item.status === parsedStatus)
    );
  });
};

export const detail = async (id: string) => {
  return mockData.find(item => item.cameraId === id);
};

export const create = async (param: Partial<Camera>) => {
  return param;
};

export const update = async (param: Partial<Camera>) => {
  return param;
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ⭐ เพิ่ม function สำหรับดึงข้อมูล Camera Options
export const getCameraOptions = async (): Promise<SelectOption[]> => {
  try {
    // จำลองการเรียก API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCameraOptions;
    
    // ในการใช้งานจริง อาจจะดึงจาก mockData:
    // const cameras = await search(); // ดึงข้อมูลทั้งหมด
    // return cameras
    //   .filter(item => item.status === 1) // เฉพาะที่ active
    //   .map(item => ({
    //     label: `${item.cameraName} - ${item.location}`,
    //     value: item.cameraId
    //   }));
    
    // หรือเรียก API โดยตรง:
    // return await api.get<SelectOption[]>('/camera-options');
  } catch (error) {
    console.error('Failed to fetch camera options:', error);
    throw error;
  }
};