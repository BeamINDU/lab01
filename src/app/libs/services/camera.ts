import { api } from '@/app/utils/api'
import type { Camera, ParamSearch } from "@/app/types/camera"
import { SelectOption } from "@/app/types/select-option";


const CAMERA_LOCATIONS = [
  // Production Lines
  { area: 'Production Line A', zone: 'Input Station', purpose: 'Product Identification' },
  { area: 'Production Line A', zone: 'Quality Check Point 1', purpose: 'Surface Inspection' },
  { area: 'Production Line A', zone: 'Quality Check Point 2', purpose: 'Dimension Check' },
  { area: 'Production Line A', zone: 'Final Inspection', purpose: 'Complete Product Check' },
  { area: 'Production Line A', zone: 'Packaging Station', purpose: 'Label Verification' },
  
  { area: 'Production Line B', zone: 'Input Station', purpose: 'Product Identification' },
  { area: 'Production Line B', zone: 'Quality Check Point 1', purpose: 'Color Inspection' },
  { area: 'Production Line B', zone: 'Quality Check Point 2', purpose: 'Defect Detection' },
  { area: 'Production Line B', zone: 'Final Inspection', purpose: 'Complete Product Check' },
  { area: 'Production Line B', zone: 'Packaging Station', purpose: 'Barcode Verification' },
  
  { area: 'Production Line C', zone: 'Input Station', purpose: 'Product Identification' },
  { area: 'Production Line C', zone: 'Assembly Check', purpose: 'Component Verification' },
  { area: 'Production Line C', zone: 'Quality Check Point', purpose: 'Surface Defect Detection' },
  { area: 'Production Line C', zone: 'Final Inspection', purpose: 'Complete Product Check' },
  
  // Warehouse & Storage
  { area: 'Warehouse A', zone: 'Receiving Dock', purpose: 'Incoming Inspection' },
  { area: 'Warehouse A', zone: 'Storage Area', purpose: 'Inventory Monitoring' },
  { area: 'Warehouse B', zone: 'Shipping Dock', purpose: 'Outgoing Verification' },
  { area: 'Warehouse B', zone: 'Loading Bay', purpose: 'Loading Verification' },
  
  // Special Areas
  { area: 'Quality Control Lab', zone: 'Sample Testing', purpose: 'Sample Verification' },
  { area: 'Maintenance Workshop', zone: 'Tool Inspection', purpose: 'Tool Condition Check' },
  { area: 'Raw Material Storage', zone: 'Incoming Area', purpose: 'Material Inspection' },
];

// ⭐ สร้าง Mock Data
const mockData: Camera[] = CAMERA_LOCATIONS.map((loc, i) => {
  const currentDate = new Date();
  const createdDate = new Date(currentDate.getTime() - (Math.random() * 365 * 24 * 60 * 60 * 1000)); 
  const hasUpdate = Math.random() > 0.6; 
  const updatedDate = hasUpdate ? new Date(createdDate.getTime() + (Math.random() * 180 * 24 * 60 * 60 * 1000)) : null;
  // สร้าง Camera ID 
  const areaCode = loc.area.includes('Line A') ? 'LA' : 
                   loc.area.includes('Line B') ? 'LB' : 
                   loc.area.includes('Line C') ? 'LC' :
                   loc.area.includes('Warehouse A') ? 'WA' :
                   loc.area.includes('Warehouse B') ? 'WB' :
                   loc.area.includes('Quality') ? 'QC' :
                   loc.area.includes('Maintenance') ? 'MT' : 'RM';
  
  const zoneNumber = String(i + 1).padStart(2, '0');

  return {
    cameraId: `CAM-${areaCode}-${zoneNumber}`,
    cameraName: `Camera ${areaCode}${zoneNumber} - ${loc.zone}`,
    location: `${loc.area} - ${loc.zone}`,
    status: Math.random() > 0.2 ? 1 : 0, 
    createdDate: createdDate,
    createdBy: ['admin', 'system', 'technician'][Math.floor(Math.random() * 3)],
    updatedDate: updatedDate,
    updatedBy: hasUpdate ? ['admin', 'technician', 'maintenance'][Math.floor(Math.random() * 3)] : null,
  };
});


export const search = async (param?: ParamSearch) => { 
  console.log('=== CAMERA SERVICE DEBUG ===');
  console.log('Received params:', param);
  console.log('Mock data total count:', mockData.length);
  console.log('Active cameras:', mockData.filter(c => c.status === 1).length);
  console.log('Inactive cameras:', mockData.filter(c => c.status === 0).length);
  

  if (!param) {
    console.log('No parameters provided, returning all cameras');
    return mockData;
  }

  console.log('Filtering with parameters...');
  

  let parsedStatus: number | undefined = undefined;
  if (param.status !== undefined && param.status !== null && param.status.toString().trim() !== '') {
    const statusNum = Number(param.status);
    if (!isNaN(statusNum)) {
      parsedStatus = statusNum;
    }
  }
  
  console.log('Parsed status:', parsedStatus, 'Type:', typeof parsedStatus);

  const filteredData = mockData.filter(item => {
    const cameraIdMatch = !param.cameraId || item.cameraId.toLowerCase().includes(param.cameraId.toLowerCase());
    const cameraNameMatch = !param.cameraName || item.cameraName.toLowerCase().includes(param.cameraName.toLowerCase());
    const locationMatch = !param.location || item.location.toLowerCase().includes(param.location.toLowerCase());
    const statusMatch = parsedStatus === undefined || item.status === parsedStatus;
    
    return cameraIdMatch && cameraNameMatch && locationMatch && statusMatch;
  });
  
  console.log('Filtered results:', filteredData.length, 'items');
  console.log('Sample results:', filteredData.slice(0, 3).map(c => ({id: c.cameraId, status: c.status})));
  
  return filteredData;
};

export const detail = async (id: string) => {

  return mockData.find(item => item.cameraId === id);
};

export const create = async (param: Partial<Camera>) => {

  console.log('Creating camera:', param);
  const newCamera = {
    ...param,
    cameraId: param.cameraId || `CAM-NEW-${String(mockData.length + 1).padStart(2, '0')}`,
    status: param.status ?? 1,
    createdDate: new Date(),
    createdBy: param.createdBy || 'admin',
    updatedDate: null,
    updatedBy: null,
  };
  
  mockData.push(newCamera as Camera);
  return newCamera;
};

export const update = async (param: Partial<Camera>) => {

  console.log('Updating camera:', param);
  const index = mockData.findIndex(item => item.cameraId === param.cameraId);
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

  console.log('Deleting camera:', id);
  const index = mockData.findIndex(item => item.cameraId === id);
  if (index !== -1) {
    mockData.splice(index, 1);
  }
  return {};
};

export const upload = async (file: File) => {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // return await api.post('/cameras/upload', formData);
  
  console.log('Uploading camera file:', file.name);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { message: 'Camera file uploaded successfully' };
};

export const getCameraOptions = async (): Promise<SelectOption[]> => {

  console.log('Loading Camera options for reports...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // ส่งเฉพาะกล้องที่ Active และเพิ่มข้อมูล location
  const activeCameras = mockData.filter(item => item.status === 1);
  
  const options = activeCameras.map(item => ({
    label: `${item.cameraName} - ${item.location}`,
    value: item.cameraName 
  }));
  
  console.log('Camera options loaded:', options.length, 'items');
  return options;
};

//  function สำหรับ Camera Search Options (สำหรับหน้า Camera )
export const getCameraSearchOptions = async (): Promise<SelectOption[]> => {
 
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockData.map(item => ({
    label: `${item.cameraName} (${item.cameraId})`,
    value: item.cameraName
  }));
};