// src/app/libs/services/dashboard.ts
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

// 🎯 Realistic Product Data with Categories
const REALISTIC_PRODUCTS = [
  { id: 'PROD-BEV-001', name: 'Coca-Cola Classic 330ml Can', category: 'Beverage', line: 'LINE-A' },
  { id: 'PROD-BEV-002', name: 'Pepsi Cola 500ml Bottle', category: 'Beverage', line: 'LINE-A' },
  { id: 'PROD-BEV-003', name: 'Sprite Lemon 350ml Bottle', category: 'Beverage', line: 'LINE-A' },
  { id: 'PROD-BEV-004', name: 'Red Bull Energy Drink 250ml', category: 'Energy Drink', line: 'LINE-A' },
  { id: 'PROD-FOD-001', name: 'Mama Instant Noodle Cup', category: 'Food', line: 'LINE-B' },
  { id: 'PROD-FOD-002', name: 'KitKat Chocolate Bar 45g', category: 'Snack', line: 'LINE-B' },
  { id: 'PROD-FOD-003', name: 'Lactasoy Soy Milk 300ml', category: 'Dairy', line: 'LINE-B' },
  { id: 'PROD-COS-001', name: 'Nivea Body Lotion 400ml', category: 'Cosmetic', line: 'LINE-C' },
  { id: 'PROD-COS-002', name: 'Pantene Shampoo 170ml', category: 'Personal Care', line: 'LINE-C' },
  { id: 'PROD-MED-001', name: 'Paracetamol 500mg Tablets', category: 'Medicine', line: 'LINE-D' },
  { id: 'PROD-MED-002', name: 'Vitamin C 1000mg Tablets', category: 'Supplement', line: 'LINE-D' },
];

// 🎯 Realistic Camera Data
const REALISTIC_CAMERAS = [
  { id: 'CAM-LA-01', name: 'Line A - Input Inspection', location: 'Production Line A - Entry Point', line: 'LINE-A' },
  { id: 'CAM-LA-02', name: 'Line A - Label Check', location: 'Production Line A - Labeling Station', line: 'LINE-A' },
  { id: 'CAM-LA-03', name: 'Line A - Final QC', location: 'Production Line A - Final Quality Check', line: 'LINE-A' },
  { id: 'CAM-LB-01', name: 'Line B - Surface Check', location: 'Production Line B - Surface Inspection', line: 'LINE-B' },
  { id: 'CAM-LB-02', name: 'Line B - Barcode Verify', location: 'Production Line B - Barcode Station', line: 'LINE-B' },
  { id: 'CAM-LB-03', name: 'Line B - Packaging QC', location: 'Production Line B - Packaging Check', line: 'LINE-B' },
  { id: 'CAM-LC-01', name: 'Line C - Dimension Check', location: 'Production Line C - Dimension Control', line: 'LINE-C' },
  { id: 'CAM-LC-02', name: 'Line C - Color Inspection', location: 'Production Line C - Color Quality', line: 'LINE-C' },
  { id: 'CAM-LD-01', name: 'Line D - Pharma QC', location: 'Production Line D - Pharmaceutical Quality', line: 'LINE-D' },
  { id: 'CAM-PKG-01', name: 'Packaging - Final Check', location: 'Multi-Product Packaging Line', line: 'LINE-PKG' }
];

// 🎯 Realistic Production Lines
const REALISTIC_LINES = [
  { id: 'LINE-A', name: 'Beverage Production Line A', shortName: 'Beverage Line' },
  { id: 'LINE-B', name: 'Food & Snack Production Line B', shortName: 'Food Line' },
  { id: 'LINE-C', name: 'Personal Care Line C', shortName: 'Personal Care Line' },
  { id: 'LINE-D', name: 'Pharmaceutical Line D', shortName: 'Pharma Line' },
  { id: 'LINE-PKG', name: 'Multi-Product Packaging Line', shortName: 'Packaging Line' }
];

// Mock data for dropdowns
const mockProducts: ProductOption[] = REALISTIC_PRODUCTS.map(product => ({
  productId: product.id,
  productName: product.name
}));

const mockCameras: CameraOption[] = REALISTIC_CAMERAS.map(camera => ({
  cameraId: camera.id,
  cameraName: camera.name,
  location: camera.location
}));

const mockLines: LineOption[] = REALISTIC_LINES.map(line => ({
  lineId: line.id,
  lineName: line.name
}));

// 🎯 Smart dashboard data generator that responds to filters
const generateMockDashboardData = (filters: DashboardFilters): DashboardData => {
  // Get selected product info
  const selectedProduct = filters.productId ? REALISTIC_PRODUCTS.find(p => p.id === filters.productId) : null;
  const selectedCamera = filters.cameraId ? REALISTIC_CAMERAS.find(c => c.id === filters.cameraId) : null;
  const selectedLine = filters.lineId ? REALISTIC_LINES.find(l => l.id === filters.lineId) : null;

  // Determine which line(s) to show data for
  let relevantLines: typeof REALISTIC_LINES = [];
  if (selectedLine) {
    relevantLines = [selectedLine];
  } else if (selectedProduct) {
    const productLine = REALISTIC_LINES.find(l => l.id === selectedProduct.line);
    relevantLines = productLine ? [productLine] : REALISTIC_LINES;
  } else if (selectedCamera) {
    const cameraLine = REALISTIC_LINES.find(l => l.id === selectedCamera.line);
    relevantLines = cameraLine ? [cameraLine] : REALISTIC_LINES;
  } else {
    relevantLines = REALISTIC_LINES;
  }

  // Calculate production numbers
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
  const baseMultiplier = isWeekend ? 0.6 : 1.0;
  
  let baseTotal = 8500;
  if (selectedProduct) baseTotal = 3500; // Single product
  else if (selectedCamera) baseTotal = 5000; // Single camera coverage
  else if (selectedLine) baseTotal = 6000; // Single line

  const totalProducts = Math.floor(baseTotal * baseMultiplier);
  const defectRate = selectedLine?.id === 'LINE-D' ? 0.008 : 0.025; // Pharma has lower defect rate
  const ngCount = Math.floor(totalProducts * defectRate);
  const goodCount = totalProducts - ngCount;

  // 🎯 Smart trend data based on filters
  const getDefectTypesForContext = () => {
    if (selectedProduct?.category === 'Beverage') {
      return ['Label Missing', 'Cap Defect', 'Volume Error', 'Surface Scratch', 'Barcode Error'];
    } else if (selectedProduct?.category === 'Medicine' || selectedLine?.id === 'LINE-D') {
      return ['Tablet Crack', 'Weight Variance', 'Color Deviation', 'Packaging Seal', 'Label Error'];
    } else if (selectedProduct?.category === 'Cosmetic' || selectedLine?.id === 'LINE-C') {
      return ['Pump Defect', 'Label Shift', 'Container Dent', 'Color Match', 'Volume Check'];
    } else {
      return ['Label Misalign', 'Surface Scratch', 'Package Dent', 'Missing Part', 'Color Variance'];
    }
  };

  const defectTypes = getDefectTypesForContext();
  
  const trendData: TrendData[] = [
    { 
      time: '06:00', 
      MissingPart: Math.floor(Math.random() * 2) + 1, 
      Misalignment: Math.floor(Math.random() * 2) + 1, 
      Dent: Math.floor(Math.random() * 1), 
      Crack: Math.floor(Math.random() * 1), 
      Scratch: Math.floor(Math.random() * 1) + 1 
    },
    { 
      time: '09:00', 
      MissingPart: Math.floor(Math.random() * 3) + 2, 
      Misalignment: Math.floor(Math.random() * 3) + 2, 
      Dent: Math.floor(Math.random() * 2) + 1, 
      Crack: Math.floor(Math.random() * 2), 
      Scratch: Math.floor(Math.random() * 2) + 1 
    },
    { 
      time: '12:00', 
      MissingPart: Math.floor(Math.random() * 4) + 3, 
      Misalignment: Math.floor(Math.random() * 4) + 3, 
      Dent: Math.floor(Math.random() * 3) + 2, 
      Crack: Math.floor(Math.random() * 2) + 1, 
      Scratch: Math.floor(Math.random() * 3) + 2 
    },
    { 
      time: '15:00', 
      MissingPart: Math.floor(Math.random() * 3) + 2, 
      Misalignment: Math.floor(Math.random() * 3) + 2, 
      Dent: Math.floor(Math.random() * 2) + 1, 
      Crack: Math.floor(Math.random() * 2), 
      Scratch: Math.floor(Math.random() * 2) + 1 
    },
    { 
      time: '18:00', 
      MissingPart: Math.floor(Math.random() * 2) + 1, 
      Misalignment: Math.floor(Math.random() * 2) + 1, 
      Dent: Math.floor(Math.random() * 1), 
      Crack: Math.floor(Math.random() * 1), 
      Scratch: Math.floor(Math.random() * 1) + 1 
    }
  ];

  // 🎯 Smart defects by type - use actual line names
  const defectsByType: DefectTypeData[] = defectTypes.slice(0, 5).map(defectType => {
    const lineData: any = { type: defectType };
    
    if (relevantLines.length === 1) {
      // Single line selected - show only that line
      lineData[relevantLines[0].shortName] = Math.floor(Math.random() * 8) + 5;
    } else {
      // Multiple lines - show up to 3 relevant lines with proper names
      relevantLines.slice(0, 3).forEach((line, index) => {
        lineData[line.shortName] = Math.floor(Math.random() * 6) + 3;
      });
    }
    
    return lineData;
  });

  // 🎯 Smart camera defects - filter by selection
  let relevantCameras = REALISTIC_CAMERAS;
  if (selectedCamera) {
    relevantCameras = [selectedCamera];
  } else if (selectedLine) {
    relevantCameras = REALISTIC_CAMERAS.filter(c => c.line === selectedLine.id);
  } else if (selectedProduct) {
    relevantCameras = REALISTIC_CAMERAS.filter(c => c.line === selectedProduct.line);
  }

  const defectsByCamera: DefectCameraData[] = relevantCameras.slice(0, 6).map(camera => ({
    camera: camera.name.replace(/^Line [A-Z] - /, ''), // Shorten name for display
    defects: Math.floor(Math.random() * 20) + 10
  }));

  // 🎯 Smart NG distribution - adjust based on filters with proper category names
  const getProductCategories = () => {
    if (selectedProduct) {
      return [selectedProduct.category];
    } else if (selectedLine) {
      const lineProducts = REALISTIC_PRODUCTS.filter(p => p.line === selectedLine.id);
      return [...new Set(lineProducts.map(p => p.category))];
    } else {
      return ['Beverage', 'Food', 'Cosmetic', 'Medicine'];
    }
  };

  const categories = getProductCategories();
  const ngDistribution: NgDistributionData[] = [
    { 
      time: "06:00", 
      A: categories.length > 0 ? Math.floor(Math.random() * 3) + 2 : 0,
      B: categories.length > 1 ? Math.floor(Math.random() * 2) + 1 : 0,
      C: categories.length > 2 ? Math.floor(Math.random() * 2) + 1 : 0,
      D: categories.length > 3 ? Math.floor(Math.random() * 1) + 1 : 0
    },
    { 
      time: "09:00", 
      A: categories.length > 0 ? Math.floor(Math.random() * 4) + 3 : 0,
      B: categories.length > 1 ? Math.floor(Math.random() * 3) + 2 : 0,
      C: categories.length > 2 ? Math.floor(Math.random() * 3) + 2 : 0,
      D: categories.length > 3 ? Math.floor(Math.random() * 2) + 1 : 0
    },
    { 
      time: "12:00", 
      A: categories.length > 0 ? Math.floor(Math.random() * 5) + 4 : 0,
      B: categories.length > 1 ? Math.floor(Math.random() * 4) + 3 : 0,
      C: categories.length > 2 ? Math.floor(Math.random() * 3) + 2 : 0,
      D: categories.length > 3 ? Math.floor(Math.random() * 2) + 1 : 0
    },
    { 
      time: "15:00", 
      A: categories.length > 0 ? Math.floor(Math.random() * 4) + 3 : 0,
      B: categories.length > 1 ? Math.floor(Math.random() * 3) + 2 : 0,
      C: categories.length > 2 ? Math.floor(Math.random() * 3) + 2 : 0,
      D: categories.length > 3 ? Math.floor(Math.random() * 2) + 1 : 0
    },
    { 
      time: "18:00", 
      A: categories.length > 0 ? Math.floor(Math.random() * 3) + 2 : 0,
      B: categories.length > 1 ? Math.floor(Math.random() * 2) + 1 : 0,
      C: categories.length > 2 ? Math.floor(Math.random() * 2) + 1 : 0,
      D: categories.length > 3 ? Math.floor(Math.random() * 1) + 1 : 0
    }
  ];

  console.log('Generated dashboard data for filters:', {
    selectedProduct: selectedProduct?.name,
    selectedCamera: selectedCamera?.name,
    selectedLine: selectedLine?.name,
    totalProducts,
    defectsByType: defectsByType.map(d => d.type),
    relevantCameras: relevantCameras.map(c => c.name)
  });

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
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
}

export const getCameras = async (): Promise<CameraOption[]> => {
  try {
    // return await api.get<CameraOption[]>('/dashboard/cameras');
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return mockCameras;
  } catch (error) {
    console.error('Failed to fetch cameras:', error);
    throw error;
  }
}

export const getLines = async (): Promise<LineOption[]> => {
  try {
    // return await api.get<LineOption[]>('/dashboard/lines');
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return mockLines;
  } catch (error) {
    console.error('Failed to fetch lines:', error);
    throw error;
  }
}

export const getDashboardData = async (filters: DashboardFilters): Promise<DashboardData> => {
  try {
    console.log('Fetching dashboard data with filters:', filters);
    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    return generateMockDashboardData(filters);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
}