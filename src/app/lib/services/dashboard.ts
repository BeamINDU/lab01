import { api } from '@/app/utils/api'

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

// Mock data 
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


export const getProducts = async (): Promise<ProductOption[]> => {
  try {
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
    
    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockCameras;
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    throw error;
  }
}

/**
 * Get all lines for dropdown
 */
export const getLines = async (): Promise<LineOption[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockLines;
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    throw error;
  }
}