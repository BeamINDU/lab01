// src/app/libs/services/dashboard.ts
import { api } from '@/app/utils/api'
import { extractErrorMessage } from '@/app/utils/errorHandler';

// Types
export interface ProductOption {
  id: string;
  name: string;
}

export interface CameraOption {
  id: string;
  name: string;
}

export interface LineOption {
  id: string;
  name: string;
}

export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedProduct?: ProductOption | null;
  selectedCamera?: CameraOption | null;
  selectedLine?: LineOption | null;
}

export interface DashboardData {
  totalProducts: number;
  goodCount: number;
  ngCount: number;
  trendData: Array<{
    time: string;
    [key: string]: string | number;
  }>;
  defectsByType: Array<{
    type: string;
    count: number;
  }>;
  defectsByCamera: Array<{
    camera: string;
    count: number;
  }>;
  ngDistribution: Array<{
    hour: string;
    count: number;
  }>;
}

// Mock data สำหรับ dropdown options (ใช้ชั่วคราวก่อนที่จะมี API สำหรับดึงข้อมูลเหล่านี้)
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

// Helper function to format datetime for API
const formatDateTimeForAPI = (date: Date): string => {
  return date.toISOString().slice(0, 19); // "2025-05-20T15:00:00"
};

// API Functions
export const getProducts = async (): Promise<ProductOption[]> => {
  try {
    // TODO: Replace with real API call when available
    // const response = await api.get('/products');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error(extractErrorMessage(error));
  }
}

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    // TODO: Replace with real API call when available
    // const response = await api.get('/cameras');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return mockCameras;
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    throw new Error(extractErrorMessage(error));
  }
}

export const getLines = async (): Promise<LineOption[]> => {
  try {
    // TODO: Replace with real API call when available
    // const response = await api.get('/lines');
    // return response.data;
    
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return mockLines;
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    throw new Error(extractErrorMessage(error));
  }
}

export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  try {
    console.log('Fetching dashboard data with filters:', filters);
    
    const start = formatDateTimeForAPI(filters.dateRange.start);
    const end = formatDateTimeForAPI(filters.dateRange.end);
    
    // Build query parameters
    const params = new URLSearchParams({
      start,
      end
    });
    
    // Add optional filters
    if (filters.selectedProduct?.name) {
      params.append('productname', filters.selectedProduct.name);
    }
    if (filters.selectedLine?.name) {
      params.append('prodline', filters.selectedLine.name);
    }
    if (filters.selectedCamera?.id) {
      params.append('cameraid', filters.selectedCamera.id);
    }

    console.log('API Parameters:', params.toString());

    // Fetch data from multiple endpoints
    const [
      totalProductsResponse,
      goodNgRatioResponse,
      top5DefectsResponse,
      top5TrendsResponse,
      defectsCameraResponse,
      ngDistributionResponse
    ] = await Promise.all([
      // Total Products
      fetch(`http://localhost:8080/totalprod?${params.toString()}`),
      
      // Good/NG Ratio
      fetch(`http://localhost:8080/goodngratio?${params.toString()}`),
      
      // Top 5 Defects
      fetch(`http://localhost:8080/top5defects?${params.toString()}`),
      
      // Top 5 Trends
      fetch(`http://localhost:8080/top5trends?${params.toString()}`),
      
      // Defects by Camera
      fetch(`http://localhost:8080/defects-camera?${params.toString()}`),
      
      // NG Distribution
      fetch(`http://localhost:8080/ngdistribution?${params.toString()}`)
    ]);

    // Check for errors
    if (!totalProductsResponse.ok) throw new Error('Failed to fetch total products');
    if (!goodNgRatioResponse.ok) throw new Error('Failed to fetch good/ng ratio');
    if (!top5DefectsResponse.ok) throw new Error('Failed to fetch top 5 defects');
    if (!top5TrendsResponse.ok) throw new Error('Failed to fetch trends');
    if (!defectsCameraResponse.ok) throw new Error('Failed to fetch camera defects');
    if (!ngDistributionResponse.ok) throw new Error('Failed to fetch ng distribution');

    // Parse responses
    const totalProductsData = await totalProductsResponse.json();
    const goodNgRatioData = await goodNgRatioResponse.json();
    const top5DefectsData = await top5DefectsResponse.json();
    const top5TrendsData = await top5TrendsResponse.json();
    const defectsCameraData = await defectsCameraResponse.json();
    const ngDistributionData = await ngDistributionResponse.json();

    console.log('API Responses:', {
      totalProducts: totalProductsData,
      goodNgRatio: goodNgRatioData,
      top5Defects: top5DefectsData,
      trends: top5TrendsData,
      camera: defectsCameraData,
      distribution: ngDistributionData
    });

    // Calculate totals
    const totalProducts = totalProductsData?.total_products || 0;
    
    // Calculate good/ng counts from ratio data
    let goodCount = 0;
    let ngCount = 0;
    
    if (goodNgRatioData && Array.isArray(goodNgRatioData)) {
      goodCount = goodNgRatioData.reduce((sum: number, item: any) => sum + (item.total_ok || 0), 0);
      ngCount = goodNgRatioData.reduce((sum: number, item: any) => sum + (item.total_ng || 0), 0);
    }

    // Process defects by type from top5DefectsData
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
      count: count as number
    }));

    // Process trend data from top5TrendsData
    const trendMap = new Map();
    if (top5TrendsData && Array.isArray(top5TrendsData)) {
      top5TrendsData.forEach((item: any) => {
        const hour = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        const defectType = item.defecttype || 'Unknown';
        
        if (!trendMap.has(hour)) {
          trendMap.set(hour, { time: hour });
        }
        
        const hourData = trendMap.get(hour);
        hourData[defectType] = (hourData[defectType] || 0) + (item.quantity || 0);
      });
    }
    
    const trendData = Array.from(trendMap.values()).sort((a, b) => 
      a.time.localeCompare(b.time)
    );

    // Process NG distribution
    const distributionMap = new Map();
    if (ngDistributionData && Array.isArray(ngDistributionData)) {
      ngDistributionData.forEach((item: any) => {
        const hour = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        const current = distributionMap.get(hour) || 0;
        distributionMap.set(hour, current + (item.defect_count || 0));
      });
    }
    
    const ngDistribution = Array.from(distributionMap.entries()).map(([hour, count]) => ({
      hour,
      count: count as number
    })).sort((a, b) => a.hour.localeCompare(b.hour));

    const result = {
      totalProducts,
      goodCount,
      ngCount,
      trendData,
      defectsByType,
      defectsByCamera,
      ngDistribution
    };

    console.log('Processed dashboard data:', result);
    return result;
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw new Error(extractErrorMessage(error));
  }
}