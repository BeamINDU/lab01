// src/app/lib/services/dashboard.ts
import { api } from '@/app/utils/api'
import { DashboardData, DashboardFilters, TrendData, DefectTypeData, DefectCameraData, NgDistributionData } from '@/app/types/dashboard'

export type ProductOption = {
  productId: string
  productName: string
}

export type CameraOption = {
  cameraId: string
  cameraName: string
  location: string
}

export type LineOption = {
  lineId: string
  lineName: string
}

// Mock data for dropdowns
const mockProducts: ProductOption[] = Array.from({ length: 10 }, (_, i) => ({
  productId: `PROD${i+1}`,
  productName: `Product ${String.fromCharCode(65 + i)}` // Product A, B, C...
}))

const mockCameras: CameraOption[] = Array.from({ length: 8 }, (_, i) => ({
  cameraId: `CAM${i+1}`,
  cameraName: `CAM ${String.fromCharCode(65 + Math.floor(i/2))}${(i%2)+1}`, // CAM A1, A2, B1, B2...
  location: `Location ${Math.floor(i/2)+1}`
}))

const mockLines: LineOption[] = Array.from({ length: 3 }, (_, i) => ({
  lineId: `LINE${i+1}`,
  lineName: `Line ${i+1}`
}))

// Mock dashboard data generator
const generateMockDashboardData = (filters: DashboardFilters): DashboardData => {
  // Generate different data based on filters
  const productMultiplier = filters.productId ? 0.8 : 1;
  const cameraMultiplier = filters.cameraId ? 0.6 : 1;
  const lineMultiplier = filters.lineId ? 0.7 : 1;
  
  const baseTotal = 5000;
  const totalProducts = Math.floor(baseTotal * productMultiplier * cameraMultiplier * lineMultiplier);
  const ngRate = 0.1 + (Math.random() * 0.05); // 10-15% NG rate
  const ngCount = Math.floor(totalProducts * ngRate);
  const goodCount = totalProducts - ngCount;

  // Generate trend data
  const trendData: TrendData[] = [
    { time: '9:00', MissingPart: Math.floor(Math.random() * 3) + 1, Misalignment: Math.floor(Math.random() * 3) + 1, Dent: Math.floor(Math.random() * 2) + 1, Crack: Math.floor(Math.random() * 2), Scratch: Math.floor(Math.random() * 2) + 1 },
    { time: '12:00', MissingPart: Math.floor(Math.random() * 3) + 1, Misalignment: Math.floor(Math.random() * 3) + 1, Dent: Math.floor(Math.random() * 3) + 1, Crack: Math.floor(Math.random() * 2) + 1, Scratch: Math.floor(Math.random() * 2) },
    { time: '15:00', MissingPart: Math.floor(Math.random() * 3) + 1, Misalignment: Math.floor(Math.random() * 3) + 1, Dent: Math.floor(Math.random() * 2) + 1, Crack: Math.floor(Math.random() * 3) + 1, Scratch: Math.floor(Math.random() * 2) + 1 },
    { time: '18:00', MissingPart: Math.floor(Math.random() * 2) + 1, Misalignment: Math.floor(Math.random() * 3) + 1, Dent: Math.floor(Math.random() * 1), Crack: Math.floor(Math.random() * 4) + 1, Scratch: Math.floor(Math.random() * 3) + 1 },
    { time: '21:00', MissingPart: Math.floor(Math.random() * 2) + 1, Misalignment: Math.floor(Math.random() * 4) + 1, Dent: Math.floor(Math.random() * 2) + 1, Crack: Math.floor(Math.random() * 2) + 1, Scratch: Math.floor(Math.random() * 4) + 1 }
  ];

  // Generate defects by type data
  const defectsByType: DefectTypeData[] = [
    { type: 'Missing Part', Line1: Math.floor(Math.random() * 3) + 2, Line2: Math.floor(Math.random() * 2) + 1, Line3: Math.floor(Math.random() * 3) + 1 },
    { type: 'Misalignment', Line1: Math.floor(Math.random() * 3) + 2, Line2: Math.floor(Math.random() * 3) + 1, Line3: Math.floor(Math.random() * 2) + 1 },
    { type: 'Dent', Line1: Math.floor(Math.random() * 2) + 1, Line2: Math.floor(Math.random() * 2) + 1, Line3: Math.floor(Math.random() * 2) + 1 },
    { type: 'Crack', Line1: Math.floor(Math.random() * 3) + 1, Line2: Math.floor(Math.random() * 3) + 1, Line3: Math.floor(Math.random() * 1) + 1 },
    { type: 'Scratch', Line1: Math.floor(Math.random() * 2) + 1, Line2: Math.floor(Math.random() * 2) + 1, Line3: Math.floor(Math.random() * 1) + 1 }
  ];

  // Generate defects by camera data
  const defectsByCamera: DefectCameraData[] = [
    { camera: 'CAM A1', defects: Math.floor(Math.random() * 30) + 30 },
    { camera: 'CAM A2', defects: Math.floor(Math.random() * 40) + 60 },
    { camera: 'CAM B1', defects: Math.floor(Math.random() * 20) + 40 },
    { camera: 'CAM B2', defects: Math.floor(Math.random() * 30) + 50 }
  ];

  // Generate NG distribution data
  const ngDistribution: NgDistributionData[] = [
    { time: "9:00", A: Math.floor(Math.random() * 2) + 1, B: Math.floor(Math.random() * 2) + 1, C: Math.floor(Math.random() * 2) + 1, D: Math.floor(Math.random() * 2) + 1 },
    { time: "12:00", A: Math.floor(Math.random() * 3) + 1, B: Math.floor(Math.random() * 3) + 1, C: Math.floor(Math.random() * 2) + 1, D: Math.floor(Math.random() * 3) + 1 },
    { time: "15:00", A: Math.floor(Math.random() * 3) + 1, B: Math.floor(Math.random() * 2) + 1, C: Math.floor(Math.random() * 3) + 1, D: Math.floor(Math.random() * 3) + 1 },
    { time: "18:00", A: Math.floor(Math.random() * 2) + 1, B: Math.floor(Math.random() * 2) + 1, C: Math.floor(Math.random() * 1) + 1, D: Math.floor(Math.random() * 2) + 1 },
    { time: "21:00", A: Math.floor(Math.random() * 4) + 1, B: Math.floor(Math.random() * 2) + 1, C: Math.floor(Math.random() * 3) + 1, D: Math.floor(Math.random() * 3) + 1 }
  ];

  return {
    totalProducts,
    goodCount,
    ngCount,
    trendData,
    defectsByType,
    defectsByCamera,
    ngDistribution
  };
};

// API Functions
export const getProducts = async (): Promise<ProductOption[]> => {
  try {
    // return await api.get<ProductOption[]>('/dashboard/products');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    // return await api.get<CameraOption[]>('/dashboard/cameras');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockCameras;
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    throw error;
  }
}

export const getLines = async (): Promise<LineOption[]> => {
  try {
    // return await api.get<LineOption[]>('/dashboard/lines');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockLines;
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    throw error;
  }
}

export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  try {
    // return await api.post<DashboardData>('/dashboard/data', filters);
    
    // Mock implementation
    console.log('Fetching dashboard data with filters:', filters);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    return generateMockDashboardData(filters);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
}