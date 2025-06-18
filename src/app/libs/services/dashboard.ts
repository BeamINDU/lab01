// src/app/libs/services/dashboard.ts
import { extractErrorMessage } from '@/app/utils/errorHandler';

// Types
export interface ProductOption { id: string; name: string; }
export interface CameraOption { id: string; name: string; }
export interface LineOption { id: string; name: string; }

export interface DashboardFilters {
  productId?: string;
  cameraId?: string;
  lineId?: string;
  startDate?: Date;
  endDate?: Date;
  month?: string;
  year?: string;
}

export interface DashboardData {
  totalProducts: number;
  goodCount: number;
  ngCount: number;
  trendData: Array<{ time: string; [key: string]: string | number; }>;
  defectsByType: Array<{ type: string; count: number; }>;
  defectsByCamera: Array<{ camera: string; defects: number; }>;
  ngDistribution: Array<{ time: string; A: number; B: number; C: number; D: number; }>;
}

// Mock data
const mockProducts: ProductOption[] = [
  { id: "1", name: "Tea Bottle" },
  { id: "2", name: "Coffee Cup" },
  { id: "3", name: "Water Bottle" },
  { id: "4", name: "Juice Container" }
];

const mockCameras: CameraOption[] = [
  { id: "CAM001", name: "Production Line A Camera" },
  { id: "CAM002", name: "Production Line B Camera" },
  { id: "CAM003", name: "Quality Check Camera" },
  { id: "CAM004", name: "Cup Line production" }
];

const mockLines: LineOption[] = [
  { id: "1", name: "LOT12345" },
  { id: "2", name: "LOT12346" },
  { id: "3", name: "LOT12347" },
  { id: "4", name: "LOT12348" }
];

// Helper functions
const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const buildParams = (filters: DashboardFilters): URLSearchParams => {
  const params = new URLSearchParams({
    start: formatDateTime(filters.startDate!),
    end: formatDateTime(filters.endDate!)
  });
  
  if (filters.productId) {
    const product = mockProducts.find(p => p.id === filters.productId);
    if (product) params.append('productname', product.name);
  }
  if (filters.lineId) {
    const line = mockLines.find(l => l.id === filters.lineId);
    if (line) params.append('prodline', line.name);
  }
  if (filters.cameraId) params.append('cameraid', filters.cameraId);
  
  return params;
};

const fetchAPI = async (endpoint: string, params: URLSearchParams) => {
  const response = await fetch(`http://localhost:8080${endpoint}?${params.toString()}`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

const processTimeData = (data: any[], timeField: string = 'hour_slot') => {
  const timeMap = new Map();
  data.forEach(item => {
    const hour = new Date(item[timeField]).toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit', hour12: false 
    });
    
    if (item.defecttype) {
      // สำหรับ trend data
      if (!timeMap.has(hour)) timeMap.set(hour, { time: hour });
      const hourData = timeMap.get(hour);
      hourData[item.defecttype] = (hourData[item.defecttype] || 0) + (item.quantity || item.defect_count || 0);
    } else {
      // สำหรับ ng distribution - รวมจำนวนทั้งหมด
      const currentCount = timeMap.get(hour) || 0;
      timeMap.set(hour, currentCount + (item.defect_count || 0));
    }
  });
  return timeMap;
};

// API Functions
export const getProducts = async (): Promise<ProductOption[]> => {
  try {
    const response = await fetch('http://localhost:8080/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // Fallback to mock data if API fails
    return mockProducts;
  }
};

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    const response = await fetch('http://localhost:8080/cameras');
    if (!response.ok) throw new Error('Failed to fetch cameras');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    // Fallback to mock data if API fails
    return mockCameras;
  }
};

export const getLines = async (): Promise<LineOption[]> => {
  try {
    const response = await fetch('http://localhost:8080/lines');
    if (!response.ok) throw new Error('Failed to fetch lines');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    // Fallback to mock data if API fails
    return mockLines;
  }
};

export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  try {
    if (!filters.startDate || !filters.endDate) {
      throw new Error('Start date and end date are required');
    }

    const params = buildParams(filters);
    console.log('API Parameters:', params.toString());

    // Fetch all data in parallel
    const [
      totalProductsData,
      goodNgRatioData,
      top5DefectsData,
      top5TrendsData,
      defectsCameraData,
      ngDistributionData
    ] = await Promise.all([
      fetchAPI('/totalprod', params),
      fetchAPI('/goodngratio', params),
      fetchAPI('/top5defects', params),
      fetchAPI('/top5trends', params),
      fetchAPI('/defects-camera', params),
      fetchAPI('/ngdistribution', params)
    ]);

    console.log('API Responses:', { totalProductsData, goodNgRatioData, top5DefectsData, top5TrendsData, defectsCameraData, ngDistributionData });

    // Process data
    const totalProducts = totalProductsData?.total_products || 0;
    const goodCount = goodNgRatioData?.reduce((sum: number, item: any) => sum + (item.total_ok || 0), 0) || 0;
    const ngCount = goodNgRatioData?.reduce((sum: number, item: any) => sum + (item.total_ng || 0), 0) || 0;

    const defectsByType = top5DefectsData?.slice(0, 5).map((item: any) => ({
      type: item.defecttype || 'Unknown',
      count: item.quantity || 0
    })) || [];

    // Process defects by camera
    const cameraDefects = new Map();
    if (defectsCameraData && Array.isArray(defectsCameraData)) {
      defectsCameraData.forEach((item: any) => {
        const camera = item.cameraname || item.cameraid || 'Unknown';
        const current = cameraDefects.get(camera) || 0;
        cameraDefects.set(camera, current + (item.totalng || 0));
      });
    }
    
    const defectsByCamera = Array.from(cameraDefects.entries()).map(([camera, count]) => ({
      camera,
      defects: count as number  // เปลี่ยนจาก 'count' เป็น 'defects'
    }));

    const trendMap = processTimeData(top5TrendsData || []);
    const trendData = Array.from(trendMap.values()).sort((a, b) => a.time.localeCompare(b.time));

    // แก้ไข ng distribution processing ให้ตรงกับ NGDistributionChart
    const distributionMap = new Map();
    if (ngDistributionData && Array.isArray(ngDistributionData)) {
      ngDistributionData.forEach((item: any) => {
        const hour = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
          hour: '2-digit', minute: '2-digit', hour12: false 
        });
        const current = distributionMap.get(hour) || 0;
        distributionMap.set(hour, current + (item.defect_count || 0));
      });
    }
    
    // แปลงเป็นรูปแบบที่ NGDistributionChart ต้องการ
    const ngDistribution = Array.from(distributionMap.entries()).map(([time, count]) => ({
      time,
      A: count as number,  // ใช้ A เป็น category หลัก
      B: 0,                // categories อื่นเป็น 0
      C: 0,
      D: 0
    })).sort((a, b) => a.time.localeCompare(b.time));

    const result = { totalProducts, goodCount, ngCount, trendData, defectsByType, defectsByCamera, ngDistribution };
    console.log('Processed dashboard data:', result);
    console.log('🔍 ngDistribution:', ngDistribution);
    console.log('🔍 defectsByCamera:', defectsByCamera);
    console.log('🔍 Raw defectsCameraData:', defectsCameraData);
    return result;
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw new Error(extractErrorMessage(error));
  }
};