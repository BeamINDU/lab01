'use client';

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
import { DashboardData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DefectByCameraChartProps {
  data: DashboardData | null;
}

export default function DefectByCameraChart({ data }: DefectByCameraChartProps) {
  const chartData = data?.defectsByCamera || [
    { camera: 'Input Inspection', defects: 45 },
    { camera: 'Label Check', defects: 80 },
    { camera: 'Surface Check', defects: 60 },
    { camera: 'Barcode Verify', defects: 70 },
  ];

  const displayData = chartData.length > 0 ? chartData : [
    { camera: 'No Data', defects: 0 }
  ];

  // Generate gradient colors
  const generateColors = (count: number): string[] => {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = 200 + (40 * i / count); // Blue hues from 200 to 240
      colors.push(`hsla(${hue}, 85%, 60%, 0.8)`);
    }
    return colors;
  };

  const backgroundColors = generateColors(displayData.length);
  const borderColors = backgroundColors.map((color: string) => color.replace('0.8', '1'));

  const barChartData = {
    labels: displayData.map(item => item.camera),
    datasets: [
      {
        label: 'Defects Count',
        data: displayData.map(item => item.defects),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: borderColors,
        hoverBorderWidth: 3,
        // ปิด default labels
        datalabels: {
          display: false
        }
      }
    ]
  };

  // Custom plugin สำหรับแสดงค่าบน bar (built-in Chart.js)
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
      },
      // ปิด datalabels plugin หากมี
      datalabels: {
        display: false
      }
    },
    elements: {
      bar: {
        // ปิด default labels ใน bar element
        borderSkipped: false,
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

  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Defects by Camera
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar 
          data={barChartData} 
          options={options}
          plugins={[valueDisplayPlugin]}
        />
      </div>
      
      {chartData.length === 1 && (
        <div className="text-center text-xs text-gray-500 mt-2">
          Showing data for selected camera only
        </div>
      )}
    </div>
  );
}