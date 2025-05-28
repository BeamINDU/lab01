import { api } from '@/app/utils/api'
import type { Camera, ParamSearch } from "@/app/types/camera"
import { SelectOption } from "@/app/types/select-option";


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


const mockData: Camera[] = Array.from({ length: 20 }, (_, i) => {
  const createdDate = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
  const hasUpdate = Math.random() > 0.3; 
  const updateDate = hasUpdate 
    ? new Date(createdDate.getTime() + (Math.random() * 10 * 24 * 60 * 60 * 1000)) 
    : null;

  return {
    cameraId: `CAM${String(i+1).padStart(3, '0')}`, 
    cameraName: CAMERA_NAMES[i % CAMERA_NAMES.length],
    location: LOCATIONS[i % LOCATIONS.length],
    status: i % 5 === 0 ? 0 : 1, 
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'manager'][i % 3],
    updatedDate: updateDate,
    updatedBy: hasUpdate ? ['admin', 'system', 'manager', 'technician'][i % 4] : null,
  };
});

export const search = async (param?: ParamSearch) => { 
  console.log('Camera service received params:', param);
  
  if (!param) return mockData;

  const filteredData = mockData.filter(item => {
    const cameraIdMatch = !param.cameraId || item.cameraId.toLowerCase().includes(param.cameraId.toLowerCase());
    const cameraNameMatch = !param.cameraName || item.cameraName.toLowerCase().includes(param.cameraName.toLowerCase());
    const locationMatch = !param.location || item.location.toLowerCase().includes(param.location.toLowerCase());
    

    let statusMatch = true;
    if (param.status !== undefined && param.status !== null && param.status !== '') {
      const searchStatus = typeof param.status === 'string' ? parseInt(param.status, 10) : param.status;
      if (!isNaN(searchStatus)) {
        statusMatch = item.status === searchStatus;
      }
    }
    
    console.log(`Camera ${item.cameraId} matches:`, {
      cameraIdMatch,
      cameraNameMatch,
      locationMatch,
      statusMatch,
      searchStatus: param.status,
      itemStatus: item.status
    });
    
    return cameraIdMatch && cameraNameMatch && locationMatch && statusMatch;
  });
  
  console.log('Camera filtered results:', filteredData.length, 'items');
  return filteredData;
};

export const detail = async (id: string) => {
  return mockData.find(item => item.cameraId === id);
};

export const create = async (param: Partial<Camera>) => {
  return {
    ...param,
    cameraId: param.cameraId || `CAM${String(mockData.length + 1).padStart(3, '0')}`,
    createdDate: new Date(),
    createdBy: 'admin',
    status: param.status ?? 1
  };
};

export const update = async (param: Partial<Camera>) => {
  return {
    ...param,
    updatedDate: new Date(),
    updatedBy: 'admin'
  };
};

export const remove = async (id: string) => {
  return {};
};

export const upload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return {};
};

