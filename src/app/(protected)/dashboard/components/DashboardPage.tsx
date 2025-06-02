// src/app/(protected)/dashboard/components/DashboardPage.tsx
'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { showError, showSuccess } from '@/app/utils/swal';
import { getDashboardData } from '@/app/libs/services/dashboard';
import { DashboardData, DashboardFilters } from '@/app/types/dashboard';
import HeaderFilters from './HeaderFilters';
import TotalProductsCard from './TotalProductsCard';
import GoodNGRatioChart from './GoodNGRatioChart';
import TrendDetectionChart from './TrendDetectionChart';
import FrequentDefectsChart from './FrequentDefectsChart';
import NGDistributionChart from './NGDistributionChart';
import DefectByCameraChart from './DefectByCameraChart';

export default function DashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize default date range
  useEffect(() => {
    const today = dayjs();
    const startOfDay = today.startOf('day').format('YYYY-MM-DD HH:mm'); 
    const endOfDay = today.endOf('day').format('YYYY-MM-DD HH:mm');     
    
    setDateFrom(startOfDay);
    setDateTo(endOfDay);
    
    console.log('Default date range set:', {
      from: startOfDay,
      to: endOfDay
    });
  }, []);

  // Load dashboard data when filters change
  useEffect(() => {
    if (dateFrom && dateTo) {
      refreshDashboardData();
    }
  }, [selectedProduct, selectedCamera, selectedLine, selectedMonth, selectedYear, dateFrom, dateTo]);

  const refreshDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: DashboardFilters = {
        productId: selectedProduct || undefined,
        cameraId: selectedCamera || undefined,
        lineId: selectedLine || undefined,
        startDate: dateFrom ? new Date(dateFrom) : undefined,
        endDate: dateTo ? new Date(dateTo) : undefined,
      };

      console.log('Refreshing dashboard with filters:', filters);
      
      const data = await getDashboardData(filters);
      setDashboardData(data);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    console.log('Selected Product:', productId);
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
    console.log('Selected Camera:', cameraId);
  };

  const handleLineChange = (lineId: string) => {
    setSelectedLine(lineId);
    console.log('Selected Line:', lineId);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected Month:', month);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    console.log('Selected Year:', year);
  };

  const handleDateFromChange = (date: string | null) => {
    if (date) {
      setDateFrom(date);
      
      // ตรวจสอบว่า From Date ไม่เกิน To Date
      if (dateTo && dayjs(date).isAfter(dayjs(dateTo))) {
        // ถ้า From Date มากกว่า To Date ให้ปรับ To Date เป็นวันเดียวกันเวลา 23:59
        const newToDate = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm');
        setDateTo(newToDate);
        console.log('Auto-adjusted To Date to:', newToDate);
      }
      
      console.log('Selected Date From:', date);
    } else {
      setDateFrom('');
    }
  };

  const handleDateToChange = (date: string | null) => {
    if (date) {
      // ตรวจสอบว่า To Date ไม่น้อยกว่า From Date
      if (dateFrom && dayjs(date).isBefore(dayjs(dateFrom))) {
        showError('To Date cannot be earlier than From Date');
        return; 
      }
      
      setDateTo(date);
      console.log('Selected Date To:', date);
    } else {
      setDateTo('');
    }
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <main className="p-2">
        <HeaderFilters 
          selectedProduct={selectedProduct}
          selectedCamera={selectedCamera}
          selectedLine={selectedLine}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onProductChange={handleProductChange}
          onCameraChange={handleCameraChange}
          onLineChange={handleLineChange}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onDateFromChange={handleDateFromChange}
          onDateToChange={handleDateToChange}
        />
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="p-2">
        <HeaderFilters 
          selectedProduct={selectedProduct}
          selectedCamera={selectedCamera}
          selectedLine={selectedLine}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onProductChange={handleProductChange}
          onCameraChange={handleCameraChange}
          onLineChange={handleLineChange}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onDateFromChange={handleDateFromChange}
          onDateToChange={handleDateToChange}
        />
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={refreshDashboardData}
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-2">
      <HeaderFilters 
        selectedProduct={selectedProduct}
        selectedCamera={selectedCamera}
        selectedLine={selectedLine}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onProductChange={handleProductChange}
        onCameraChange={handleCameraChange}
        onLineChange={handleLineChange}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
      />

      {/* Loading overlay during refresh */}
      {loading && dashboardData && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Updating data...</p>
          </div>
        </div>
      )}

      {/* 📱 RESPONSIVE GRID LAYOUT */}
      <div className="space-y-4 md:space-y-6">
        
        {/* 📱 Mobile: Stack all cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          <TotalProductsCard data={dashboardData} />
          <GoodNGRatioChart data={dashboardData} />
          <TrendDetectionChart data={dashboardData} />
          <FrequentDefectsChart data={dashboardData} />
          <NGDistributionChart data={dashboardData} />
          <DefectByCameraChart data={dashboardData} />
        </div>

        {/* 💻 Tablet & Desktop: Responsive grid */}
        <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-6">
          
          {/* Left column: Summary cards (Mobile: full width, Desktop: 1 column) */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            <TotalProductsCard data={dashboardData} />
            <GoodNGRatioChart data={dashboardData} />
          </div>

          {/* Middle & Right: Charts (Mobile: full width, Desktop: 5 columns) */}
          <div className="lg:col-span-5 space-y-4 lg:space-y-6">
            
            {/* Top row: Trend + Defects (Mobile: stack, Desktop: side by side) */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
              <div className="xl:col-span-2">
                <TrendDetectionChart data={dashboardData} />
              </div>
              <div className="xl:col-span-3">
                <FrequentDefectsChart data={dashboardData} />
              </div>
            </div>

            {/* Bottom row: Distribution + Camera (Mobile: stack, Desktop: side by side) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <NGDistributionChart data={dashboardData} />
              <DefectByCameraChart data={dashboardData} />
            </div>
            
          </div>
        </div>

      </div>
    </main>
  );
}