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
  return date.toISOString().slice(0, 19);
};

// แก้ไข buildParams เพื่อรองรับ month และ year
const buildParams = (filters: DashboardFilters) => ({
  start: formatDateTime(filters.startDate!),
  end: formatDateTime(filters.endDate!),
  ...(filters.productId && { productname: filters.productId }),
  ...(filters.lineId && { prodline: filters.lineId }),
  ...(filters.cameraId && { cameraid: filters.cameraId }),
  ...(filters.month && { month: filters.month }),
  ...(filters.year && { year: filters.year }),
});

// Generic fetch function with error handling
const fetchDashboardData = async <T>(endpoint: string, filters: DashboardFilters): Promise<T[]> => {
  try {
    const params = buildParams(filters);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Fetching ${endpoint} with params:`, params);
    }
    
    const response = await api.get<T[]>(endpoint, params);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
};

// Dashboard data services - ✅ ใช้ API_ROUTES แล้ว
export const getTotalProducts = async (filters: DashboardFilters): Promise<TotalProductsData> => {
  const data = await fetchDashboardData<{ total_products: number }>(
    API_ROUTES.dashboard.total_products, 
    filters
  );
  return { total_products: data[0]?.total_products || 0 };
};

export const getGoodNGRatio = async (filters: DashboardFilters): Promise<GoodNGRatioData[]> => {
  const data = await fetchDashboardData<any>(API_ROUTES.dashboard.good_ng_ratio, filters);
  return data.map(item => ({
    prodname: item.prodname || '',
    cameraid: item.cameraid || '',
    prodlot: item.line || '',
    line: item.line || '',
    total_ok: Number(item.total_ok) || 0,
    total_ng: Number(item.total_ng) || 0,
    ok_ratio_percent: Number(item.ok_ratio_percent) || 0,
    ng_ratio_percent: Number(item.ng_ratio_percent) || 0
  }));
};

export const getTopDefects = async (filters: DashboardFilters): Promise<DefectTypeData[]> => {
  const data = await fetchDashboardData<any>(API_ROUTES.dashboard.top5_defects, filters);
  return data.map(item => ({
    defecttype: item.defecttype || '',
    line: item.line || '',
    quantity: Number(item.quantity) || 0,
    all_defect_times: Array.isArray(item.all_defect_times) ? item.all_defect_times : []
  }));
};

export const getTopTrends = async (filters: DashboardFilters): Promise<TrendData[]> => {
  const data = await fetchDashboardData<any>(API_ROUTES.dashboard.top5_trends, filters);
  return data.map(item => ({
    defecttype: item.defecttype || '',
    line: item.line || '',
    hour_slot: item.hour_slot || '',
    quantity: Number(item.quantity) || 0
  }));
};

export const getDefectsByCamera = async (filters: DashboardFilters): Promise<DefectCameraData[]> => {
  const data = await fetchDashboardData<any>(API_ROUTES.dashboard.defects_camera, filters); // ✅ ใช้ defects_camera
  return data.map(item => ({
    prodid: item.prodid || '',
    defectid: item.defectid || '',
    defecttype: item.defecttype || '',
    cameraid: item.cameraid || '',
    line: item.line || item.LINE || '',
    cameraname: item.cameraname || '',
    totalng: Number(item.totalng) || 0,
    defecttime: item.defecttime || ''
  }));
};

export const getNGDistribution = async (filters: DashboardFilters): Promise<NgDistributionData[]> => {
  const data = await fetchDashboardData<any>(API_ROUTES.dashboard.ng_distribution, filters);
  return data.map(item => ({
    defecttype: item.defecttype || '',
    prodname: item.prodname || '',
    line: item.line || '',
    hour_slot: item.hour_slot || '',
    defect_count: Number(item.defect_count) || 0
  }));
};

// Dropdown data services
export const getProducts = async (): Promise<ProductOption[]> => {
  try {
    const response = await api.get<any>(API_ROUTES.dashboard.products_list);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    const response = await api.get<any>(API_ROUTES.dashboard.cameras_list);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    return [];
  }
};

export const getLines = async (): Promise<LineOption[]> => {
  try {
    const response = await api.get<any>(API_ROUTES.dashboard.lines_list);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    return [];
  }
};

export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  if (!filters.startDate || !filters.endDate) {
    throw new Error('Start date and end date are required');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Fetching dashboard data with filters:', filters);
  }

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

  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard data fetched successfully:', result);
  }

  return result;
};