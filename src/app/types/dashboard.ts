export type DashboardFilters = {
  productId?: string;
  cameraId?: string;
  lineId?: string;
  dateRange?: string;
  startDate?: Date;
  endDate?: Date;
}

export type DashboardData = {
  totalProducts: number;
  goodCount: number;
  ngCount: number;
  trendData: TrendData[];
  defectsByType: DefectTypeData[];
  defectsByCamera: DefectCameraData[];
  ngDistribution: NgDistributionData[];
}

export type TrendData = {
  time: string;
  MissingPart: number;
  Misalignment: number;
  Dent: number;
  Crack: number;
  Scratch: number;
}

export type DefectTypeData = {
  type: string;
  Line1: number;
  Line2: number;
  Line3: number;
}

export type DefectCameraData = {
  camera: string;
  defects: number;
}

export type NgDistributionData = {
  time: string;
  A: number;
  B: number;
  C: number;
  D: number;
}