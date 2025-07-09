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
  // States
  const [filters, setFilters] = useState({
    product: '',
    camera: '',
    line: '',
    month: '',
    year: '',
    dateFrom: '',
    dateTo: ''
  });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentFiltersRef = useRef<DashboardFilters>({});

  // Initialize dates with current year only (All Months)
  useEffect(() => {
    const today = dayjs();
    const currentYear = today.year().toString(); // 2025
    
    setFilters(prev => ({
      ...prev,
      month: '', // เริ่มต้นเป็น All Months
      year: currentYear,
      dateFrom: today.startOf('year').format('YYYY-MM-DD HH:mm'), // Start of current year
      dateTo: today.endOf('year').format('YYYY-MM-DD HH:mm')       // End of current year
    }));
  }, []);

  // Build current filters
  const buildFilters = useCallback((): DashboardFilters => ({
    productId: filters.product || undefined,
    cameraId: filters.camera || undefined,
    lineId: filters.line || undefined,
    startDate: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    endDate: filters.dateTo ? new Date(filters.dateTo) : undefined,
    month: filters.month || undefined,
    year: filters.year || undefined,
  }), [filters]);

  // Data fetching
  const fetchData = useCallback(async (filterData: DashboardFilters, isAuto = false) => {
    try {
      if (!isAuto) {
        setLoading(true);
        setError(undefined);
      }
      const data = await getDashboardData(filterData);
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
      if (!isAuto) showError('Failed to load dashboard data');
    } finally {
      if (!isAuto) setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((filterData: DashboardFilters) => fetchData(filterData), 500),
    [fetchData]
  );

  // Update filters ref and fetch data
  useEffect(() => {
    if (!filters.dateFrom || !filters.dateTo) return;
    
    const filterData = buildFilters();
    currentFiltersRef.current = filterData;
    debouncedFetch(filterData);
  }, [filters, buildFilters, debouncedFetch]);

  // Auto-refresh
  useEffect(() => {
    if (!isAutoRefresh) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const currentFilters = currentFiltersRef.current;
      if (currentFilters && Object.keys(currentFilters).length > 0) {
        fetchData(currentFilters, true);
      }
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoRefresh, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  // Filter handlers
  const updateFilter = useCallback((key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value || '' }));
  }, []);

  // Special handlers for Month/Year - auto-adjust date range and sync UI
  const handleMonthChange = useCallback((month: string) => {
    const currentYear = filters.year || dayjs().year().toString();
    
    if (month) {
      // เลือกเดือนเฉพาะ → แสดงเดือนนั้น
      const startOfMonth = dayjs(`${currentYear}-${month}-01`).startOf('month');
      const endOfMonth = dayjs(`${currentYear}-${month}-01`).endOf('month');
      
      setFilters(prev => ({
        ...prev,
        month,
        dateFrom: startOfMonth.format('YYYY-MM-DD HH:mm'),
        dateTo: endOfMonth.format('YYYY-MM-DD HH:mm')
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Month changed to ${month}, showing month:`, {
          from: startOfMonth.format('YYYY-MM-DD'),
          to: endOfMonth.format('YYYY-MM-DD')
        });
      }
    } else {
      // เลือก "All Months" → แสดงทั้งปี
      const startOfYear = dayjs(`${currentYear}-01-01`).startOf('year');
      const endOfYear = dayjs(`${currentYear}-12-31`).endOf('year');
      
      setFilters(prev => ({
        ...prev,
        month: '',
        dateFrom: startOfYear.format('YYYY-MM-DD HH:mm'),
        dateTo: endOfYear.format('YYYY-MM-DD HH:mm')
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Month changed to "All Months", showing year ${currentYear}:`, {
          from: startOfYear.format('YYYY-MM-DD'),
          to: endOfYear.format('YYYY-MM-DD')
        });
      }
    }
  }, [filters.year]);

  const handleYearChange = useCallback((year: string) => {
    if (year) {
      if (filters.month) {
        // มีเดือนอยู่แล้ว → แสดงเดือนนั้นในปีใหม่
        const startOfMonth = dayjs(`${year}-${filters.month}-01`).startOf('month');
        const endOfMonth = dayjs(`${year}-${filters.month}-01`).endOf('month');
        
        setFilters(prev => ({
          ...prev,
          year,
          dateFrom: startOfMonth.format('YYYY-MM-DD HH:mm'),
          dateTo: endOfMonth.format('YYYY-MM-DD HH:mm')
        }));
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Year changed to ${year}, keeping month ${filters.month}`);
        }
      } else {
        // ไม่มีเดือน (All Months) → แสดงทั้งปีใหม่
        const startOfYear = dayjs(`${year}-01-01`).startOf('year');
        const endOfYear = dayjs(`${year}-12-31`).endOf('year');
        
        setFilters(prev => ({
          ...prev,
          year,
          dateFrom: startOfYear.format('YYYY-MM-DD HH:mm'),
          dateTo: endOfYear.format('YYYY-MM-DD HH:mm')
        }));
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Year changed to ${year}, showing all months:`, {
            from: startOfYear.format('YYYY-MM-DD'),
            to: endOfYear.format('YYYY-MM-DD')
          });
        }
      }
    }
  }, [filters.month]);

  const handleDateFromChange = useCallback((date: string | null) => {
    if (date && filters.dateTo && dayjs(date).isAfter(dayjs(filters.dateTo))) {
      const newToDate = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm');
      setFilters(prev => ({ ...prev, dateFrom: date, dateTo: newToDate }));
    } else {
      updateFilter('dateFrom', date);
    }
  }, [filters.dateTo, updateFilter]);

  const handleDateToChange = useCallback((date: string | null) => {
    if (date && filters.dateFrom && dayjs(date).isBefore(dayjs(filters.dateFrom))) {
      return;
    }
    updateFilter('dateTo', date);
  }, [filters.dateFrom, updateFilter]);

  // Loading state
  if (loading && !dashboardData) {
    return (
      <main className="p-2">
        <HeaderFilters {...filters} 
          onProductChange={(v) => updateFilter('product', v)}
          onCameraChange={(v) => updateFilter('camera', v)}
          onLineChange={(v) => updateFilter('line', v)}
          onMonthChange={(v) => updateFilter('month', v)}
          onYearChange={(v) => updateFilter('year', v)}
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
        <HeaderFilters {...filters}
          onProductChange={(v) => updateFilter('product', v)}
          onCameraChange={(v) => updateFilter('camera', v)}
          onLineChange={(v) => updateFilter('line', v)}
          onMonthChange={(v) => updateFilter('month', v)}
          onYearChange={(v) => updateFilter('year', v)}
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
        selectedProduct={filters.product}
        selectedCamera={filters.camera}
        selectedLine={filters.line}
        selectedMonth={filters.month}
        selectedYear={filters.year}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onProductChange={(v) => updateFilter('product', v)}
        onCameraChange={(v) => updateFilter('camera', v)}
        onLineChange={(v) => updateFilter('line', v)}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
      />

      {loading && dashboardData && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Updating data...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <TotalProductsCard data={dashboardData?.totalProducts || null} loading={loading && !dashboardData} error={error} />
          <GoodNGRatioChart data={dashboardData?.goodNgRatio || null} loading={loading && !dashboardData} error={error} />
        </div>
        <div className="lg:col-span-2">
          <FrequentDefectsChart data={dashboardData?.defectsByType || null} loading={loading && !dashboardData} error={error} />
        </div>
        <div className="lg:col-span-3">
          <DefectByCameraChart data={dashboardData?.defectsByCamera || null} loading={loading && !dashboardData} error={error} />
        </div>
        <div className="lg:col-span-3">
          <NGDistributionChart data={dashboardData?.ngDistribution || null} loading={loading && !dashboardData} error={error} />
        </div>
        <div className="lg:col-span-3">
          <TrendDetectionChart data={dashboardData?.trendData || null} loading={loading && !dashboardData} error={error} />
        </div>
      </div>
    </main>
  );
}