// src/app/lib/services/camera.ts - ปรับปรุงข้อมูลให้สมจริง
import { api } from '@/app/utils/api'
import type { Camera, ParamSearch } from "@/app/types/camera"
import { SelectOption } from "@/app/types/select-option";

// ⭐ ข้อมูลที่หลากหลายและสมจริงขึ้น
const LOCATIONS = [
  'Production Line A', 'Production Line B', 'Production Line C',
  'Warehouse North', 'Warehouse South', 'Warehouse East', 'Warehouse West',
  'Loading Dock', 'Inspection Zone', 'Quality Control',
  'Maintenance Shop', 'Conference Room', 'Reception Area',
  'Packaging Area', 'Storage Room', 'Security Gate'
];

const CAMERA_NAMES = [
  'Camera A1', 'Camera A2', 'Camera B1', 'Camera B2',
  'Camera C1', 'Camera C2', 'Camera D1', 'Camera D2',
  'Camera E1', 'Camera E2', 'Camera F1', 'Camera F2',
  'Camera G1', 'Camera G2', 'Camera H1', 'Camera H2',
  'Camera I1', 'Camera I2', 'Camera J1', 'Camera J2'
];

// ⭐ Mock Data ที่สมจริงขึ้น
const mockData: Camera[] = Array.from({ length: 20 }, (_, i) => {
  const createdDate = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)); // แต่ละวันย้อนหลัง
  const hasUpdate = Math.random() > 0.3; // 70% โอกาสที่มีการอัพเดท
  const updateDate = hasUpdate 
    ? new Date(createdDate.getTime() + (Math.random() * 10 * 24 * 60 * 60 * 1000)) 
    : null;

  return {
    cameraId: `CAM${String(i+1).padStart(3, '0')}`, // CAM001, CAM002, etc.
    cameraName: CAMERA_NAMES[i % CAMERA_NAMES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    status: Math.random() > 0.3 ? 1 : 0, // 70% Active, 30% Inactive
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'manager'][i % 3],
    updatedDate: updateDate,
    updatedBy: hasUpdate ? ['admin', 'system', 'manager', 'technician'][i % 4] : null,
  };
});

export const search = async (param?: ParamSearch) => { 
  if (!param) return mockData;

  const parsedStatus = isNaN(Number(param.status)) ? undefined : Number(param.status);

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
  return {
    ...param,
    cameraId: `CAM${String(mockData.length + 1).padStart(3, '0')}`,
    createdDate: new Date(),
    status: param.status ?? 1
  };
};

export const update = async (param: Partial<Camera>) => {
  return {
    ...param,
    updatedDate: new Date()
  };
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

// ⭐ Camera Options สำหรับ SearchField
export const getCameraOptions = async (): Promise<SelectOption[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ดึงจาก mockData และสร้าง options
    return mockData
      .filter(item => item.status === 1) // เฉพาะที่ active
      .map(item => ({
        label: `${item.cameraName} - ${item.location}`,
        value: item.cameraId
      }));
  } catch (error) {
    console.error('Failed to fetch camera options:', error);
    throw error;
  }
};