// src/app/types/dashboard.ts - แก้ไขให้ตรงกับ API Response

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

// API Response Types (ตรงกับ mainsql2_1.py response)
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
  hour_slot: string;  // ISO datetime string
  quantity: number;
}

export interface DefectTypeData {
  defecttype: string;
  line: string;
  quantity: number;
  all_defect_times: string[];  // Array of ISO datetime strings
}

export interface DefectCameraData {
  prodid: string;
  defectid: string;
  defecttype: string;
  cameraid: string;
  line: string;        // ใช้ alias "LINE" จาก SQL
  cameraname: string;
  totalng: number;
  defecttime: string;  // ISO datetime string
}

export interface NgDistributionData {
  defecttype: string;
  prodname: string;
  line: string;        // เพิ่ม line field
  hour_slot: string;   // ISO datetime string
  defect_count: number;
}

// Combined Dashboard Data Interface
export interface DashboardData {
  totalProducts: TotalProductsData | null;
  goodNgRatio: GoodNGRatioData[] | null;
  trendData: TrendData[] | null;
  defectsByType: DefectTypeData[] | null;  // แก้ไขชื่อ field
  defectsByCamera: DefectCameraData[] | null;
  ngDistribution: NgDistributionData[] | null;
}

// Dropdown options (จาก /products, /cameras, /lines endpoints)
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

// Component States
export interface ComponentState {
  loading?: boolean;
  error?: string;
}

export interface DashboardState extends ComponentState {
  data: DashboardData | null;
  lastUpdated?: Date;
}