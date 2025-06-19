// src/app/(protected)/dashboard/components/DashboardPage.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { showError } from '@/app/utils/swal';
import { getDashboardData } from '@/app/libs/services/dashboard';
import type { DashboardData, DashboardFilters } from '@/app/types/dashboard';
import HeaderFilters from './HeaderFilters';
import TotalProductsCard from './TotalProductsCard';
import GoodNGRatioChart from './GoodNGRatioChart';
import TrendDetectionChart from './TrendDetectionChart';
import FrequentDefectsChart from './FrequentDefectsChart';
import NGDistributionChart from './NGDistributionChart';
import DefectByCameraChart from './DefectByCameraChart';

export default function DashboardPage() {
  // Filter states
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

  // Debounced refresh function
  const debouncedRefreshDashboardData = useCallback(
    debounce(async (filters: DashboardFilters) => {
      try {
        setLoading(true);
        setError(null);

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
    }, 500),
    []
  );

  // Load dashboard data when filters change
  useEffect(() => {
    if (dateFrom && dateTo) {
      const filters: DashboardFilters = {
        productId: selectedProduct || undefined,
        cameraId: selectedCamera || undefined,
        lineId: selectedLine || undefined,
        startDate: new Date(dateFrom),
        endDate: new Date(dateTo),
        month: selectedMonth || undefined,
        year: selectedYear || undefined,
      };

      debouncedRefreshDashboardData(filters);
    }

    // Cleanup
    return () => {
      debouncedRefreshDashboardData.cancel();
    };
  }, [selectedProduct, selectedCamera, selectedLine, selectedMonth, selectedYear, dateFrom, dateTo, debouncedRefreshDashboardData]);

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

  // Manual refresh function
  const handleRefresh = () => {
    if (dateFrom && dateTo) {
      const filters: DashboardFilters = {
        productId: selectedProduct || undefined,
        cameraId: selectedCamera || undefined,
        lineId: selectedLine || undefined,
        startDate: new Date(dateFrom),
        endDate: new Date(dateTo),
        month: selectedMonth || undefined,
        year: selectedYear || undefined,
      };

      debouncedRefreshDashboardData(filters);
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
  if (error && !dashboardData) {
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
              onClick={handleRefresh}
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

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Left column: Total products and Good/NG Ratio stacked */}
        <div className="lg:col-span-1 space-y-6">
          <TotalProductsCard 
            data={dashboardData?.totalProducts || null} 
            loading={loading}
            error={error}
          />
          <GoodNGRatioChart 
            data={dashboardData?.goodNgRatio || null}
            loading={loading}
            error={error}
          />
        </div>

        {/* Middle: Trend and Top Defects */}
        <div className="lg:col-span-2">
          <TrendDetectionChart 
            data={dashboardData?.trendData || null}
            loading={loading}
            error={error}
          />
        </div>
        <div className="lg:col-span-3">
          <FrequentDefectsChart 
            data={dashboardData?.frequentDefects || null}
            loading={loading}
            error={error}
          />
        </div>

        {/* Bottom row: NG Distribution and Camera Defects */}
        <div className="lg:col-span-3">
          <NGDistributionChart 
            data={dashboardData?.ngDistribution || null}
            loading={loading}
            error={error}
          />
        </div>
        <div className="lg:col-span-3">
          <DefectByCameraChart 
            data={dashboardData?.defectsByCamera || null}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Debug Information (แสดงในโหมด development) */}
      {process.env.NODE_ENV === 'development' && dashboardData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Debug Information:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Total Products: {dashboardData.totalProducts?.total_products || 0}</div>
            <div>Good/NG Ratio Records: {dashboardData.goodNgRatio?.length || 0}</div>
            <div>Frequent Defects Records: {dashboardData.frequentDefects?.length || 0}</div>
            <div>Trend Data Records: {dashboardData.trendData?.length || 0}</div>
            <div>Camera Defects Records: {dashboardData.defectsByCamera?.length || 0}</div>
            <div>NG Distribution Records: {dashboardData.ngDistribution?.length || 0}</div>
            <div>Last Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </main>
  );
}