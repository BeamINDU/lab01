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

// สีสำหรับแต่ละ defect type
const getColorForDefectType = (defectType: string, index: number): string => {
  const colors = [
    'rgb(136, 132, 216)',
    'rgb(130, 202, 157)',
    'rgb(255, 198, 88)',
    'rgb(255, 115, 0)',
    'rgb(0, 196, 159)',
    'rgb(239, 68, 68)',
    'rgb(168, 85, 247)',
    'rgb(34, 197, 94)',
  ];
  return colors[index % colors.length];
};

export default function TrendDetectionChart({ data, loading, error }: TrendDetectionChartProps) {
  const chartData = useMemo(() => {
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

    // Group by hour_slot และ defecttype
    const timeMap = new Map<string, Record<string, number>>();
    const defectTypes = new Set<string>();
    
    data.forEach(item => {
      const hour = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      
      if (!timeMap.has(hour)) {
        timeMap.set(hour, {});
      }
      
      const timeData = timeMap.get(hour)!;
      timeData[item.defecttype] = (timeData[item.defecttype] || 0) + (item.quantity || 0);
      defectTypes.add(item.defecttype);
    });

    // สร้าง labels (sorted time)
    const labels = Array.from(timeMap.keys()).sort();
    const defectTypeArray = Array.from(defectTypes);
    
    // สร้าง datasets สำหรับแต่ละ defecttype
    const datasets = defectTypeArray.map((defectType, index) => {
      const color = getColorForDefectType(defectType, index);
      
      return {
        label: defectType,
        data: labels.map(hour => timeMap.get(hour)?.[defectType] || 0),
        borderColor: color,
        backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      };
    });

    return { labels, datasets };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 10 },
          padding: 8,
          usePointStyle: true,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          title: function(context: any) {
            return `Time: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
          afterBody: function(context: any) {
            const total = context.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
            return [`Total: ${total}`];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Quantity',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        beginAtZero: true,
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    animation: {
      duration: 1500,
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
      <div className="h-[200px] sm:h-[240px] md:h-[280px]">
        <Line data={chartData} options={options} />
      </div>
      
      {/* แสดงข้อมูลสรุป */}
      {data && data.length > 0 && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          Time periods: {chartData.labels.length} | 
          Defect types: {chartData.datasets.length} | 
          Total records: {data.length}
        </div>
      )}
    </div>
  );
}