// src/app/libs/services/dashboard.ts - แก้ไขการ map ข้อมูล
import { extractErrorMessage } from '@/app/utils/errorHandler';
import type {
  DashboardFilters,
  DashboardData,
  TotalProductsData,
  GoodNGRatioData,
  DefectTypeData,
  TrendData,
  DefectCameraData,
  NgDistributionData,
  ProductOption,
  CameraOption,
  LineOption
} from '@/app/types/dashboard';

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
  
  // ตรวจสอบ parameter ที่ส่งไป API ตามคู่มือ
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const url = `${baseUrl}${endpoint}?${params.toString()}`;
  
  console.log('🌐 Fetching:', url);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`📊 ${endpoint} Response:`, data);
  
  return data;
};

// Mock data (fallback)
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

// API Functions with proper error handling
export const getProducts = async (): Promise<ProductOption[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(`${baseUrl}/products`);
    
    if (!response.ok) {
      console.warn('Products API failed, using fallback data');
      return mockProducts;
    }
    
    const data = await response.json();
    console.log('Products API response:', data);
    
    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Products API returned non-array, using fallback');
      return mockProducts;
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return mockProducts;
  }
};

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(`${baseUrl}/cameras`);
    
    if (!response.ok) {
      console.warn('Cameras API failed, using fallback data');
      return mockCameras;
    }
    
    const data = await response.json();
    console.log('Cameras API response:', data);
    
    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Cameras API returned non-array, using fallback');
      return mockCameras;
    }
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    return mockCameras;
  }
};

export const getLines = async (): Promise<LineOption[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await fetch(`${baseUrl}/lines`);
    
    if (!response.ok) {
      console.warn('Lines API failed, using fallback data');
      return mockLines;
    }
    
    const data = await response.json();
    console.log('Lines API response:', data);
    
    if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Lines API returned non-array, using fallback');
      return mockLines;
    }
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    return mockLines;
  }
};

export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  try {
    if (!filters.startDate || !filters.endDate) {
      throw new Error('Start date and end date are required');
    }

    const params = buildParams(filters);
    console.log('🔗 API Parameters:', params.toString());

    // Fetch all data in parallel - ใช้ endpoint names ตามที่กำหนดใน Python
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

    console.log('📊 All API Responses:', { 
      totalProductsData, 
      goodNgRatioData, 
      top5DefectsData, 
      top5TrendsData, 
      defectsCameraData, 
      ngDistributionData 
    });

    // แก้ไข: ตรวจสอบ structure ของข้อมูลก่อน map
    const result: DashboardData = {
      totalProducts: totalProductsData,
      goodNgRatio: Array.isArray(goodNgRatioData) ? goodNgRatioData : [],
      trendData: Array.isArray(top5TrendsData) ? top5TrendsData : [],
      defectsByType: Array.isArray(top5DefectsData) ? top5DefectsData : [],  // แก้ไขชื่อ field
      defectsByCamera: Array.isArray(defectsCameraData) ? defectsCameraData : [],
      ngDistribution: Array.isArray(ngDistributionData) ? ngDistributionData : []
    };

    console.log('✅ Final dashboard data:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to fetch dashboard data:', error);
    
    // Return mock data for development
    console.log('🔄 Using fallback mock data');
    return getMockDashboardData();
  }
};

// Mock data function
const getMockDashboardData = (): DashboardData => {
  return {
    totalProducts: { total_products: 1500 },
    goodNgRatio: [
      {
        prodname: "Tea Bottle",
        cameraid: "CAM004",
        prodlot: "LOT12346", 
        line: "LOT12346",
        total_ok: 450,
        total_ng: 50,
        ok_ratio_percent: 90.0,
        ng_ratio_percent: 10.0
      }
    ],
    trendData: [
      {
        defecttype: "Crack",
        line: "LOT12346",
        hour_slot: "2025-06-19T09:00:00",
        quantity: 2
      },
      {
        defecttype: "Scratch", 
        line: "LOT12346",
        hour_slot: "2025-06-19T12:00:00",
        quantity: 1
      }
    ],
    defectsByType: [
      {
        defecttype: "Crack",
        line: "LOT12346",
        quantity: 15,
        all_defect_times: ["2025-06-19T09:00:00"]
      },
      {
        defecttype: "Scratch",
        line: "LOT12347", 
        quantity: 8,
        all_defect_times: ["2025-06-19T10:00:00"]
      }
    ],
    defectsByCamera: [
      {
        prodid: "P001",
        defectid: "DEF001",
        defecttype: "Crack",
        cameraid: "CAM001",
        line: "LOT12346",
        cameraname: "Production Line A Camera",
        totalng: 5,
        defecttime: "2025-06-19T09:00:00"
      }
    ],
    ngDistribution: [
      {
        defecttype: "Crack",
        prodname: "Tea Bottle", 
        line: "LOT12346",
        hour_slot: "2025-06-19T09:00:00",
        defect_count: 3
      }
    ]
  };
};