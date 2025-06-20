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
  }, []);

  // Debounced refresh function
  const debouncedRefreshDashboardData = useCallback(
    debounce(async (filters: DashboardFilters) => {
      try {
        setLoading(true);
        setError(null);

        // เรียกใช้ service ที่ทำ data mapping ให้เสร็จแล้ว
        const data = await getDashboardData(filters);
        setDashboardData(data);
        
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
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
      // ส่ง filters ไปเลย ไม่ต้อง build parameters
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

    return () => {
      debouncedRefreshDashboardData.cancel();
    };
  }, [selectedProduct, selectedCamera, selectedLine, selectedMonth, selectedYear, dateFrom, dateTo, debouncedRefreshDashboardData]);

  // Event handlers - เก็บ state อย่างเดียว
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
            data={dashboardData?.defectsByType || null}
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
    </main>
  );
}