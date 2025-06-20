'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [error, setError] = useState<string | undefined>(undefined);
  
  //  Auto-refresh states
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize default date range
  useEffect(() => {
    const today = dayjs();
    const startOfDay = today.startOf('day').format('YYYY-MM-DD HH:mm'); 
    const endOfDay = today.endOf('day').format('YYYY-MM-DD HH:mm');     
    
    setDateFrom(startOfDay);
    setDateTo(endOfDay);
  }, []);

  // 🚀 Enhanced refresh function
  const refreshDashboardData = useCallback(async (filters: DashboardFilters, isAutoRefresh = false) => {
    try {
      if (!isAutoRefresh) {
        setLoading(true);
        setError(null);
      }

      const data = await getDashboardData(filters);
      setDashboardData(data);
      setLastUpdated(new Date());
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Dashboard ${isAutoRefresh ? 'auto-' : ''}refreshed at:`, new Date().toLocaleTimeString());
      }
      
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      if (!isAutoRefresh) {
        showError('Failed to load dashboard data');
      }
    } finally {
      if (!isAutoRefresh) {
        setLoading(false);
      }
    }
  }, []);

  // Debounced refresh for manual changes
  const debouncedRefreshDashboardData = useCallback(
    debounce((filters: DashboardFilters) => refreshDashboardData(filters, false), 500),
    [refreshDashboardData]
  );

  // 🔄 Auto-refresh setup
  useEffect(() => {
    if (!dateFrom || !dateTo) return;

    const filters: DashboardFilters = {
      productId: selectedProduct || undefined,
      cameraId: selectedCamera || undefined,
      lineId: selectedLine || undefined,
      startDate: new Date(dateFrom),
      endDate: new Date(dateTo),
      month: selectedMonth || undefined,
      year: selectedYear || undefined,
    };

    // Initial load
    debouncedRefreshDashboardData(filters);

    // 🕐 Setup auto-refresh interval (1 minute = 60,000ms)
    if (isAutoRefresh) {
      intervalRef.current = setInterval(() => {
        refreshDashboardData(filters, true); // Auto-refresh without loading state
      }, 60000); // 1 minute

      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Auto-refresh enabled: Every 1 minute');
      }
    }

    // Cleanup interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      debouncedRefreshDashboardData.cancel();
    };
  }, [selectedProduct, selectedCamera, selectedLine, selectedMonth, selectedYear, dateFrom, dateTo, isAutoRefresh, debouncedRefreshDashboardData, refreshDashboardData]);

  // 🔄 Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setIsAutoRefresh(prev => !prev);
    if (!isAutoRefresh) {
      setLastUpdated(new Date());
    }
  };

  // 🔄 Manual refresh
  const handleManualRefresh = () => {
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
      refreshDashboardData(filters, false);
    }
  };

  // Event handlers
  const handleProductChange = (productId: string) => setSelectedProduct(productId);
  const handleCameraChange = (cameraId: string) => setSelectedCamera(cameraId);
  const handleLineChange = (lineId: string) => setSelectedLine(lineId);
  const handleMonthChange = (month: string) => setSelectedMonth(month);
  const handleYearChange = (year: string) => setSelectedYear(year);

  const handleDateFromChange = (date: string | null) => {
    if (date) {
      setDateFrom(date);
      if (dateTo && dayjs(date).isAfter(dayjs(dateTo))) {
        const newToDate = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm');
        setDateTo(newToDate);
      }
    } else {
      setDateFrom('');
    }
  };

  const handleDateToChange = (date: string | null) => {
    if (date) {
      if (dateFrom && dayjs(date).isBefore(dayjs(dateFrom))) {
        showError('To Date cannot be earlier than From Date');
        return; 
      }
      setDateTo(date);
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
          </div>
        </div>
      </main>
    );
  }

// ใน DashboardPage.tsx - แทนที่ส่วน Header + Auto-refresh Controls เดิม

return (
  <main className="p-2">
    {/* Header แบบง่าย - ไม่มี Auto-refresh Controls */}
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

    {/* Dashboard Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
      {/* Left column: Total products and Good/NG Ratio stacked */}
      <div className="lg:col-span-1 space-y-6">
        <TotalProductsCard 
          data={dashboardData?.totalProducts || null} 
          loading={loading && !dashboardData}
          error={error}
        />
        <GoodNGRatioChart 
          data={dashboardData?.goodNgRatio || null}
          loading={loading && !dashboardData}
          error={error}
        />
      </div>

      {/* Middle: Trend and Top Defects */}
      <div className="lg:col-span-2">
        <TrendDetectionChart 
          data={dashboardData?.trendData || null}
          loading={loading && !dashboardData}
          error={error}
        />
      </div>
      <div className="lg:col-span-3">
        <FrequentDefectsChart 
          data={dashboardData?.defectsByType || null}
          loading={loading && !dashboardData}
          error={error}
        />
      </div>

      {/* Bottom row: NG Distribution and Camera Defects */}
      <div className="lg:col-span-3">
        <NGDistributionChart 
          data={dashboardData?.ngDistribution || null}
          loading={loading && !dashboardData}
          error={error}
        />
      </div>
      <div className="lg:col-span-3">
        <DefectByCameraChart 
          data={dashboardData?.defectsByCamera || null}
          loading={loading && !dashboardData}
          error={error}
        />
      </div>
    </div>
  </main>
);
}