// src/app/(protected)/dashboard/components/NGDistributionChart.tsx
'use client';

import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { NgDistributionData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface NGDistributionChartProps {
  data: NgDistributionData[] | null;
  loading?: boolean;
  error?: string;
}

// สีสำหรับแต่ละ defect type
const getStackedColors = (index: number): string => {
  const colors = [
    'rgba(186, 230, 253, 0.8)', // Light blue
    'rgba(96, 165, 250, 0.8)',  // Medium blue
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(30, 58, 138, 0.8)',   // Dark blue
    'rgba(239, 68, 68, 0.8)',   // Red
    'rgba(34, 197, 94, 0.8)',   // Green
    'rgba(168, 85, 247, 0.8)',  // Purple
    'rgba(245, 158, 11, 0.8)',  // Amber
  ];
  return colors[index % colors.length];
};

export default function NGDistributionChart({ data, loading, error }: NGDistributionChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['9:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [{
          label: 'No Data',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(156, 163, 175, 0.8)',
          borderColor: 'rgba(156, 163, 175, 1)',
          borderWidth: 1,
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
      timeData[item.defecttype] = (timeData[item.defecttype] || 0) + (item.defect_count || 0);
      defectTypes.add(item.defecttype);
    });

    // สร้าง labels (sorted time)
    const labels = Array.from(timeMap.keys()).sort();
    const defectTypeArray = Array.from(defectTypes);
    
    // สร้าง datasets สำหรับแต่ละ defecttype
    const datasets = defectTypeArray.map((defectType, index) => ({
      label: defectType,
      data: labels.map(hour => timeMap.get(hour)?.[defectType] || 0),
      backgroundColor: getStackedColors(index),
      borderColor: getStackedColors(index).replace('0.8', '1'),
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }));

    return { labels, datasets };
  }, [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 10 },
          padding: 12,
          usePointStyle: true,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: function(context: any) {
            return `Time: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
          afterBody: function(context: any) {
            const total = context.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
            return [`Total Defects: ${total}`];
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 10 }
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Defect Count',
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 10 }
        },
        beginAtZero: true,
      }
    },
    animation: {
      duration: 1200,
    }
  };

  if (loading) {
    return (
      <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
          Defect Distribution by Hour
        </h2>
        <div className="h-[200px] sm:h-[240px] md:h-[260px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
          Defect Distribution by Hour
        </h2>
        <div className="h-[200px] sm:h-[240px] md:h-[260px] flex items-center justify-center">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
        Defect Distribution by Hour
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* แสดงข้อมูลสรุป */}
      {data && data.length > 0 && (
        <div className="text-xs text-gray-500 mt-2 text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            Time periods: {chartData.labels.length} | 
            Defect types: {chartData.datasets.length} | 
            Total records: {data.length}
          </div>
        </div>
      )}
    </div>
  );
}