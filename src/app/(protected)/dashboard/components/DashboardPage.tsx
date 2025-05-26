// src/app/(protected)/dashboard/components/DashboardPage.tsx
'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { showError, showSuccess } from '@/app/utils/swal';
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

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
    console.log('Selected Product:', productId);
    //  API เพื่อดึงข้อมูลตาม product ที่เลือก
    refreshDashboardData();
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
    console.log('Selected Camera:', cameraId);
    //  API เพื่อดึงข้อมูลตาม camera ที่เลือก
    refreshDashboardData();
  };

  const handleLineChange = (lineId: string) => {
    setSelectedLine(lineId);
    console.log('Selected Line:', lineId);
    //  API เพื่อดึงข้อมูลตาม line ที่เลือก
    refreshDashboardData();
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    console.log('Selected Month:', month);
    refreshDashboardData();
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    console.log('Selected Year:', year);
    refreshDashboardData();
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
    refreshDashboardData();
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
    refreshDashboardData();
  };

  const refreshDashboardData = () => {
    //  API เพื่อดึงข้อมูล dashboard ใหม่ตาม filters ที่เลือก
    console.log('Refreshing dashboard with filters:', {
      product: selectedProduct,
      camera: selectedCamera,  
      line: selectedLine,
      month: selectedMonth,
      year: selectedYear,
      dateFrom: dateFrom,
      dateTo: dateTo
    });
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        {/* Left column: Total products and Good/NG Ratio stacked */}
        <div className="lg:col-span-1 space-y-6">
          <TotalProductsCard />
          <GoodNGRatioChart />
        </div>

        {/* Middle: Trend and Top Defects */}
        <div className="lg:col-span-2">
          <TrendDetectionChart />
        </div>
        <div className="lg:col-span-3">
          <FrequentDefectsChart />
        </div>

        {/* Bottom row: NG Distribution and Camera Defects */}
        <div className="lg:col-span-3">
          <NGDistributionChart />
        </div>
        <div className="lg:col-span-3">
          <DefectByCameraChart />
        </div>
      </div>
    </main>
  );
}