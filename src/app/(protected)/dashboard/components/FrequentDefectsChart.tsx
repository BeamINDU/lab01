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

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
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
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#333',
        font: {
          weight: 'bold',
          size: 9,
        },
        formatter: (value: number) => value,
        clamp: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 10 }
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 9 }
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
        Top 5 Most Frequent Defect Types
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar data={barChartData} options={options} />
      </div>
    </div>
  );
}
