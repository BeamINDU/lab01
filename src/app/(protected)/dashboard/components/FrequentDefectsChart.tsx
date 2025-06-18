// src/app/(protected)/dashboard/components/FrequentDefectsChart.tsx
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
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface FrequentDefectsChartProps {
  data: DashboardData | null;
}

export default function FrequentDefectsChart({ data }: FrequentDefectsChartProps) {
  const chartData = data?.defectsByType || [
    { type: 'Label Misalignment', Line1: 4, Line2: 1, Line3: 3 },
    { type: 'Surface Scratch', Line1: 4, Line2: 3, Line3: 2 },
    { type: 'Package Dent', Line1: 2, Line2: 2, Line3: 2 },
    { type: 'Missing Component', Line1: 3, Line2: 3, Line3: 1 },
    { type: 'Color Variance', Line1: 2, Line2: 2, Line3: 1 },
  ];

  const getAvailableLines = () => {
    if (!chartData || chartData.length === 0) return [];
    const firstItem = chartData[0];
    return Object.keys(firstItem).filter(key =>
      key !== 'type' && typeof firstItem[key] === 'number'
    );
  };

  const availableLines = getAvailableLines();
  const colors = [
    'rgba(30, 58, 138, 0.8)',
    'rgba(96, 165, 250, 0.8)',
    'rgba(186, 230, 253, 0.8)',
    'rgba(224, 242, 254, 0.8)',
  ];

  const datasets = availableLines.map((lineKey, index) => ({
    label: lineKey,
    data: chartData.map(item => item[lineKey] || 0),
    backgroundColor: colors[index] || 'rgba(148, 163, 184, 0.8)',
    borderColor: colors[index]?.replace('0.8', '1') || 'rgba(148, 163, 184, 1)',
    borderWidth: 1,
    borderRadius: 4,
    borderSkipped: false,
  }));

  const barChartData = {
    labels: chartData.map(item => item.type),
    datasets
  };

  const maxValue = Math.max(
    ...chartData.flatMap(item => 
      availableLines.map(line => item[line] || 0)
    ).map(values => 
      Array.isArray(values) ? Math.max(...values) : values
    )
  );

  const maxStackedValue = Math.max(
    ...chartData.map(item => 
      availableLines.reduce((sum, line) => sum + (item[line] || 0), 0)
    )
  );

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 50, 
        left: 10,
        top: 10,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 10 },
          padding: 8,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.x}`;
          },
          afterLabel: function(context: any) {
            const dataIndex = context.dataIndex;
            const total = availableLines.reduce((sum, line) => {
              return sum + (chartData[dataIndex][line] || 0);
            }, 0);
            return `Total: ${total}`;
          }
        }
      },
      datalabels: {
        display: function(context: any) {
          return context.datasetIndex === availableLines.length - 1;
        },
        anchor: 'end',
        align: 'right',
        color: '#1f2937',
        font: {
          weight: 'bold',
          size: 10,
        },
        formatter: function(value: number, context: any) {
          const dataIndex = context.dataIndex;
          const total = availableLines.reduce((sum, line) => {
            return sum + (chartData[dataIndex][line] || 0);
          }, 0);
          return total;
        },
        offset: 8, 
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        max: Math.ceil(maxStackedValue * 1.2),
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 10 },
          callback: function(value: any) {
            return value <= maxStackedValue ? value : '';
          }
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 9 },
          callback: function(value: any, index: number) {
            const label = this.getLabelForValue(value);
            if (label && label.length > 20) {
              return label.substring(0, 17) + '...';
            }
            return label;
          }
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
        Top 5 Defects Most Found by Cameras
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar data={barChartData} options={options} />
      </div>
      
      {/* แสดงข้อมูลสรุปด้านล่าง */}
      <div className="mt-2 text-xs text-gray-600 text-center">
        <div className="flex justify-center gap-4 flex-wrap">
          {chartData.slice(0, 3).map((item, index) => {
            const total = availableLines.reduce((sum, line) => sum + (item[line] || 0), 0);
            return (
              <span key={index} className="whitespace-nowrap">
                <strong>{item.type}:</strong> {total}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}