// src/app/(protected)/dashboard/components/NGDistributionChart.tsx
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

interface NGDistributionChartProps {
  data: DashboardData | null;
}

export default function NGDistributionChart({ data }: NGDistributionChartProps) {
  const chartData = data?.ngDistribution || [
    { time: "9:00", A: 2, B: 1, C: 2, D: 1 },
    { time: "12:00", A: 2, B: 3, C: 2, D: 3 },
    { time: "15:00", A: 3, B: 1, C: 3, D: 3 },
    { time: "18:00", A: 1, B: 1, C: 1, D: 2 },
    { time: "21:00", A: 4, B: 2, C: 3, D: 3 },
  ];

  const categoryNames = {
    'A': 'Beverages',
    'B': 'Food & Snacks', 
    'C': 'Personal Care',
    'D': 'Pharmaceuticals'
  };

  // Get active categories
  const getActiveCategories = () => {
    if (!chartData || chartData.length === 0) return ['A', 'B', 'C', 'D'];
    const categories = ['A', 'B', 'C', 'D'];
    return categories.filter(cat => 
      chartData.some(item => item[cat] && item[cat] > 0)
    );
  };

  const activeCategories = getActiveCategories();
  const colors = [
    'rgba(186, 230, 253, 0.8)', // Light blue
    'rgba(96, 165, 250, 0.8)',  // Medium blue
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(30, 58, 138, 0.8)',   // Dark blue
  ];

  const datasets = activeCategories.map((category, index) => ({
    label: categoryNames[category as keyof typeof categoryNames],
    data: chartData.map(item => item[category] || 0),
    backgroundColor: colors[index],
    borderColor: colors[index]?.replace('0.8', '1'),
    borderWidth: 1,
    borderRadius: 4,
    borderSkipped: false,
  }));

  const stackedBarData = {
    labels: chartData.map(item => item.time),
    datasets
  };

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
          text: 'NG Product Quantity',
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

  return (
    <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
        Top 5 Product NGs by Hour
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar data={stackedBarData} options={options} />
      </div>
    </div>
  );
}