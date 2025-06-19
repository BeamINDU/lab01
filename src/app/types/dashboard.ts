// src/app/types/dashboard.ts - Updated Types to match API

export interface DashboardFilters {
  productId?: string;
  cameraId?: string;
  lineId?: string;
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
  month?: string;
  year?: string;
}

// API Response Types (ตรงกับ API จริง)
export interface TotalProductsData {
  total_products: number;
}

export interface GoodNGRatioData {
  prodname: string;
  cameraid: string;
  prodlot: string;
  line: string;
  total_ok: number;
  total_ng: number;
  ok_ratio_percent: number;
  ng_ratio_percent: number;
}

export interface TrendData {
  defecttype: string;
  line: string;
  hour_slot: string;
  quantity: number;
}

export interface DefectTypeData {
  defecttype: string;
  line: string;
  quantity: number;
  all_defect_times: string[];
}

export interface DefectCameraData {
  prodid: string;
  defectid: string;
  defecttype: string;
  cameraid: string;
  line: string;
  cameraname: string;
  totalng: number;
  defecttime: string;
}

export interface NgDistributionData {
  defecttype: string;
  prodname: string;
  hour_slot: string;
  defect_count: number;
}

// Combined Dashboard Data Interface
export interface DashboardData {
  totalProducts: TotalProductsData | null;
  goodNgRatio: GoodNGRatioData[] | null;
  trendData: TrendData[] | null;
  defectsByType: DefectTypeData[] | null;
  defectsByCamera: DefectCameraData[] | null;
  ngDistribution: NgDistributionData[] | null;
}

// Additional helper types
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

// Chart data interfaces (processed from API data)
export interface ProcessedChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    [key: string]: any;
  }>;
}

export interface PieChartData {
  name: string;
  value: number;
}

// Error and Loading states
export interface ComponentState {
  loading?: boolean;
  error?: string;
}

export interface DashboardState extends ComponentState {
  data: DashboardData | null;
  lastUpdated?: Date;
}