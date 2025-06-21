// src/app/(protected)/dashboard/components/TrendDetectionChart.tsx
'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { TrendData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TrendDetectionChartProps {
  data: TrendData[] | null;
  loading?: boolean;
  error?: string;
}

// สีสำหรับแต่ละ defect type (ใช้สีที่แตกต่างกันชัดเจน)
const getColorForDefectType = (index: number): string => {
  const colors = [
    'rgb(239, 68, 68)',    // Red
    'rgb(59, 130, 246)',   // Blue  
    'rgb(34, 197, 94)',    // Green
    'rgb(245, 158, 11)',   // Amber
    'rgb(168, 85, 247)',   // Purple
    'rgb(236, 72, 153)',   // Pink
    'rgb(20, 184, 166)',   // Teal
    'rgb(156, 163, 175)',  // Gray
  ];
  return colors[index % colors.length];
};

export default function TrendDetectionChart({ data, loading, error }: TrendDetectionChartProps) {
  const chartData = useMemo(() => {
    console.log('🔍 TrendDetection raw data:', data);

    if (!data || data.length === 0) {
      return {
        labels: ['9:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [{
          label: 'No Data',
          data: [0, 0, 0, 0, 0],
          borderColor: 'rgba(156, 163, 175, 0.8)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.4,
        }]
      };
    }

    // ✅ Step 1: สร้าง Map สำหรับ time slots และ defect types
    const timeSlotMap = new Map<string, Record<string, number>>();
    const defectTypesSet = new Set<string>();
    
    data.forEach(item => {
      // จัดการ hour_slot ให้เป็น format ที่อ่านง่าย
      const hourSlot = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      
      // สร้าง defect type key (รวม line ถ้ามี)
      const defectKey = item.line ? 
        `${item.defecttype} (${item.line})` : 
        item.defecttype;
      
      // เพิ่มเข้าใน Map
      if (!timeSlotMap.has(hourSlot)) {
        timeSlotMap.set(hourSlot, {});
      }
      
      const timeData = timeSlotMap.get(hourSlot)!;
      const currentQuantity = timeData[defectKey] || 0;
      timeData[defectKey] = currentQuantity + (item.quantity || 0);
      
      defectTypesSet.add(defectKey);
      
      console.log(`⏰ Processing: ${defectKey} at ${hourSlot} = ${item.quantity}`);
    });

    console.log('🕐 Time slots found:', Array.from(timeSlotMap.keys()));
    console.log('🏷️ Defect types found:', Array.from(defectTypesSet));

    // ✅ Step 2: เรียงลำดับ time slots และ limit defect types ที่ 5
    const sortedTimeSlots = Array.from(timeSlotMap.keys()).sort();
    
    // หา Top 5 defect types โดยรวม quantity ทั้งหมด
    const defectTotals = new Map<string, number>();
    defectTypesSet.forEach(defectType => {
      let total = 0;
      sortedTimeSlots.forEach(timeSlot => {
        total += timeSlotMap.get(timeSlot)?.[defectType] || 0;
      });
      defectTotals.set(defectType, total);
    });

    const top5DefectTypes = Array.from(defectTotals.entries())
      .sort((a, b) => b[1] - a[1]) // เรียงจากมากไปน้อย
      .slice(0, 5) // เอาแค่ 5 อันดับแรก
      .map(([defectType]) => defectType);

    console.log('🏆 Top 5 defect types:', top5DefectTypes);

    // ✅ Step 3: สร้าง datasets สำหรับแต่ละ defect type
    const datasets = top5DefectTypes.map((defectType, index) => {
      const color = getColorForDefectType(index);
      
      const dataPoints = sortedTimeSlots.map(timeSlot => {
        const value = timeSlotMap.get(timeSlot)?.[defectType] || 0;
        return value;
      });

      console.log(`📈 Dataset for ${defectType}:`, dataPoints);

      return {
        label: defectType,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: false,
      };
    });

    const result = {
      labels: sortedTimeSlots,
      datasets
    };

    console.log('✅ Final trend chart data:', result);
    return result;
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12 },
          padding: 10,
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F3F4F6',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        callbacks: {
          title: function(context: any) {
            return `Time: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
          afterBody: function(context: any) {
            const total = context.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
            return [``, `📊 Total: ${total}`];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (Hour)',
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          font: { size: 10 },
          color: '#6B7280',
          maxRotation: 45,
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Quantity',
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
        ticks: {
          font: { size: 10 },
          color: '#6B7280',
        },
        beginAtZero: true,
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutCubic' as const,
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
      line: {
        tension: 0.4,
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
          Trend of Top 5 Detection Types
        </h2>
        <div className="h-[200px] sm:h-[240px] md:h-[280px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
          Trend of Top 5 Detection Types
        </h2>
        <div className="h-[200px] sm:h-[240px] md:h-[280px] flex items-center justify-center">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Trend of Top 5 Detection Types
      </h2>
      <div className="h-[220px] sm:h-[260px] md:h-[330px]"> 
        <Line data={chartData} options={options} />
      </div>
      
      {/* Summary info */}

      {/* Debug Information - Development only */}
      {/* {process.env.NODE_ENV === 'development' && data && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-medium">🔍 Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Raw data length: {data.length}</div>
              <div>Chart time slots: {JSON.stringify(chartData.labels)}</div>
              <div>Chart datasets: {chartData.datasets.length}</div>
              {chartData.datasets.map((dataset, index) => (
                <div key={index} className="text-xs">
                  <strong>{dataset.label}:</strong> [{dataset.data.join(', ')}]
                </div>
              ))}
            </div>
          </details>
        </div>
      )} */}
    </div>
  );
}