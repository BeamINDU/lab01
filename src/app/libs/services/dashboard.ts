import { api } from '@/app/utils/api';
import { API_ROUTES } from "@/app/constants/endpoint";
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

const formatDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// Dashboard data services - ทำ data mapping ให้เสร็จ
export const getTotalProducts = async (filters: DashboardFilters): Promise<TotalProductsData> => {
  try {
    const params = {
      start: formatDateTime(filters.startDate!),
      end: formatDateTime(filters.endDate!),
      ...(filters.productId && { productname: filters.productId }),
      ...(filters.lineId && { prodline: filters.lineId }),
      ...(filters.cameraId && { cameraid: filters.cameraId }),
    };

    const response = await api.get<any>(API_ROUTES.dashboard.total_products, params);
    
    // Map data ให้เสร็จ - return format ที่ chart ต้องการ
    if (Array.isArray(response) && response.length > 0) {
      return { total_products: response[0].total_products || 0 };
    }
    return { total_products: 0 };
  } catch (error) {
    console.error('Failed to fetch total products:', error);
    return { total_products: 0 };
  }
};

export const getGoodNGRatio = async (filters: DashboardFilters): Promise<GoodNGRatioData[]> => {
  try {
    const params = {
      start: formatDateTime(filters.startDate!),
      end: formatDateTime(filters.endDate!),
      ...(filters.productId && { productname: filters.productId }),
      ...(filters.lineId && { prodline: filters.lineId }),
      ...(filters.cameraId && { cameraid: filters.cameraId }),
    };

    const response = await api.get<any[]>(API_ROUTES.dashboard.good_ng_ratio, params);
    
    // Map data ให้เสร็จ - return format ที่ chart ต้องการ
    if (Array.isArray(response)) {
      return response.map((item: any) => ({
        prodname: item.prodname || '',
        cameraid: item.cameraid || '',
        prodlot: item.line || '',
        line: item.line || '',
        total_ok: Number(item.total_ok) || 0,
        total_ng: Number(item.total_ng) || 0,
        ok_ratio_percent: Number(item.ok_ratio_percent) || 0,
        ng_ratio_percent: Number(item.ng_ratio_percent) || 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch good NG ratio:', error);
    return [];
  }
};

export const getTopDefects = async (filters: DashboardFilters): Promise<DefectTypeData[]> => {
  try {
    const params = {
      start: formatDateTime(filters.startDate!),
      end: formatDateTime(filters.endDate!),
      ...(filters.productId && { productname: filters.productId }),
      ...(filters.lineId && { prodline: filters.lineId }),
      ...(filters.cameraId && { cameraid: filters.cameraId }),
    };

    const response = await api.get<any[]>(API_ROUTES.dashboard.top5_defects, params);
    
    // Map data ให้เสร็จ - return format ที่ chart ต้องการ
    if (Array.isArray(response)) {
      return response.map((item: any) => ({
        defecttype: item.defecttype || '',
        line: item.line || '',
        quantity: Number(item.quantity) || 0,
        all_defect_times: Array.isArray(item.all_defect_times) ? item.all_defect_times : []
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch top defects:', error);
    return [];
  }
};

export const getTopTrends = async (filters: DashboardFilters): Promise<TrendData[]> => {
  try {
    const params = {
      start: formatDateTime(filters.startDate!),
      end: formatDateTime(filters.endDate!),
      ...(filters.productId && { productname: filters.productId }),
      ...(filters.lineId && { prodline: filters.lineId }),
      ...(filters.cameraId && { cameraid: filters.cameraId }),
    };

    const response = await api.get<any[]>(API_ROUTES.dashboard.top5_trends, params);
    
    // Map data ให้เสร็จ - return format ที่ chart ต้องการ
    if (Array.isArray(response)) {
      return response.map((item: any) => ({
        defecttype: item.defecttype || '',
        line: item.line || '',
        hour_slot: item.hour_slot || '',
        quantity: Number(item.quantity) || 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch top trends:', error);
    return [];
  }
};

export const getDefectsByCamera = async (filters: DashboardFilters): Promise<DefectCameraData[]> => {
  try {
    const params = {
      start: formatDateTime(filters.startDate!),
      end: formatDateTime(filters.endDate!),
      ...(filters.productId && { productname: filters.productId }),
      ...(filters.lineId && { prodline: filters.lineId }),
      ...(filters.cameraId && { cameraid: filters.cameraId }),
    };

    const response = await api.get<any[]>(API_ROUTES.dashboard.defects_camera, params);
    
    // Map data ให้เสร็จ - return format ที่ chart ต้องการ
    if (Array.isArray(response)) {
      return response.map((item: any) => ({
        prodid: item.prodid || '',
        defectid: item.defectid || '',
        defecttype: item.defecttype || '',
        cameraid: item.cameraid || '',
        line: item.line || '',
        cameraname: item.cameraname || '',
        totalng: Number(item.totalng) || 0,
        defecttime: item.defecttime || ''
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch defects by camera:', error);
    return [];
  }
};

export const getNGDistribution = async (filters: DashboardFilters): Promise<NgDistributionData[]> => {
  try {
    const params = {
      start: formatDateTime(filters.startDate!),
      end: formatDateTime(filters.endDate!),
      ...(filters.productId && { productname: filters.productId }),
      ...(filters.lineId && { prodline: filters.lineId }),
      ...(filters.cameraId && { cameraid: filters.cameraId }),
    };

    const response = await api.get<any[]>(API_ROUTES.dashboard.ng_distribution, params);
    
    // Map data ให้เสร็จ - return format ที่ chart ต้องการ
    if (Array.isArray(response)) {
      return response.map((item: any) => ({
        defecttype: item.defecttype || '',
        prodname: item.prodname || '',
        line: item.line || '',
        hour_slot: item.hour_slot || '',
        defect_count: Number(item.defect_count) || 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch NG distribution:', error);
    return [];
  }
};

// Dropdown data services
export const getProducts = async (): Promise<ProductOption[]> => {
  try {
    const response = await api.get<ProductOption[]>(API_ROUTES.dashboard.products_list);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [
      { id: "Tea Bottle", name: "Tea Bottle" },
      { id: "Coffee Cup", name: "Coffee Cup" },
      { id: "Water Bottle", name: "Water Bottle" },
      { id: "Juice Container", name: "Juice Container" }
    ];
  }
};

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    const response = await api.get<CameraOption[]>(API_ROUTES.dashboard.cameras_list);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    return [
      { id: "CAM001", name: "Production Line A Camera" },
      { id: "CAM002", name: "Production Line B Camera" },
      { id: "CAM003", name: "Quality Check Camera" },
      { id: "CAM004", name: "Cup Line production" }
    ];
  }
};

export const getLines = async (): Promise<LineOption[]> => {
  try {
    const response = await api.get<LineOption[]>(API_ROUTES.dashboard.lines_list);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    return [
      { id: "LOT12345", name: "LOT12345" },
      { id: "LOT12346", name: "LOT12346" },
      { id: "LOT12347", name: "LOT12347" },
      { id: "LOT12348", name: "LOT12348" }
    ];
  }
};

// Main function สำหรับดึงข้อมูล dashboard ทั้งหมด - data ออกมาพร้อมใช้เลย
export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  try {
    if (!filters.startDate || !filters.endDate) {
      throw new Error('Start date and end date are required');
    }

    console.log('🔄 Fetching dashboard data with filters:', filters);

    // Fetch all data in parallel - data ที่ได้จะพร้อมใช้เลย ไม่ต้อง map ใน page
    const [
      totalProducts,
      goodNgRatio, 
      defectsByType,
      trendData,
      defectsByCamera,
      ngDistribution
    ] = await Promise.all([
      getTotalProducts(filters),
      getGoodNGRatio(filters),
      getTopDefects(filters),
      getTopTrends(filters),
      getDefectsByCamera(filters),
      getNGDistribution(filters)
    ]);

    const result: DashboardData = {
      totalProducts,
      goodNgRatio,
      defectsByType,
      trendData,
      defectsByCamera,
      ngDistribution
    };

    console.log('✅ Dashboard data fetched successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to fetch dashboard data:', error);
    
    // Return mock data ที่พร้อมใช้ เหมือนกัน
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
        }
      ],
      defectsByType: [
        {
          defecttype: "Crack",
          line: "LOT12346",
          quantity: 15,
          all_defect_times: ["2025-06-19T09:00:00"]
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
  }
};