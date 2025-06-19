// src/app/(protected)/dashboard/components/DefectByCameraChart.tsx
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
import type { DefectCameraData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DefectByCameraChartProps {
  data: DefectCameraData[] | null;
  loading?: boolean;
  error?: string;
}

export default function DefectByCameraChart({ data, loading, error }: DefectByCameraChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Defects Count',
          data: [0],
          backgroundColor: ['rgba(156, 163, 175, 0.8)'],
          borderColor: ['rgba(156, 163, 175, 1)'],
          borderWidth: 2,
        }]
      };
    }

    // Group by camera และ sum totalng
    const cameraMap = new Map<string, number>();
    
    data.forEach(item => {
      const cameraName = item.cameraname || item.cameraid || 'Unknown Camera';
      const current = cameraMap.get(cameraName) || 0;
      cameraMap.set(cameraName, current + (item.totalng || 0));
    });

    // แปลงเป็น arrays สำหรับ chart
    const labels = Array.from(cameraMap.keys());
    const defectCounts = Array.from(cameraMap.values());

    // Generate gradient colors
    const generateColors = (count: number): string[] => {
      const colors: string[] = [];
      for (let i = 0; i < count; i++) {
        const hue = 200 + (40 * i / Math.max(count - 1, 1)); // Blue hues from 200 to 240
        colors.push(`hsla(${hue}, 85%, 60%, 0.8)`);
      }
      return colors;
    };

    const backgroundColors = generateColors(labels.length);
    const borderColors = backgroundColors.map((color: string) => color.replace('0.8', '1'));

    return {
      labels,
      datasets: [{
        label: 'Defects Count',
        data: defectCounts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: borderColors,
        hoverBorderWidth: 3,
      }]
    };
  }, [data]);

  // Custom plugin สำหรับแสดงค่าบน bar
  const valueDisplayPlugin = {
    id: 'valueDisplay',
    afterDatasetsDraw: (chart: any) => {
      const { ctx, data, scales: { x, y } } = chart;
      
      ctx.save();
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      data.datasets[0].data.forEach((value: number, index: number) => {
        if (value > 0) {
          const barX = x.getPixelForValue(value);
          const barY = y.getPixelForValue(index);
          
          // แสดงค่าด้านขวาของ bar
          ctx.fillText(value.toString(), barX + 8, barY);
        }
      });
      
      ctx.restore();
    }
  };

  const options = {
    indexAxis: 'y' as const, // Horizontal bar
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 40 // เพิ่มพื้นที่ด้านขวาสำหรับ labels
      }
    },
    plugins: {
      legend: {
        display: false, // Hide legend for single dataset
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            return `Defects: ${context.parsed.x}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 10 }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 9 },
          maxRotation: 0,
        }
      }
    },
    animation: {
      duration: 1200,
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
          Top 5 Defects Most Found by Cameras
        </h2>
        <div className="h-[200px] sm:h-[240px] md:h-[260px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
          Top 5 Defects Most Found by Cameras
        </h2>
        <div className="h-[200px] sm:h-[240px] md:h-[260px] flex items-center justify-center">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Top 5 Defects Most Found by Cameras
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar 
          data={chartData} 
          options={options}
          plugins={[valueDisplayPlugin]}
        />
      </div>
      
      {/* Debug info */}
      {data && (
        <div className="text-xs text-gray-500 mt-2">
          Data count: {data.length} cameras | 
          Total defects: {data.reduce((sum, item) => sum + (item.totalng || 0), 0)}
        </div>
      )}
    </div>
  );
}