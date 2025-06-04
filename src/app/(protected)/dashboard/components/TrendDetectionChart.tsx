'use client';

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
import { DashboardData } from '@/app/types/dashboard';

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
  data: DashboardData | null;
}

export default function TrendDetectionChart({ data }: TrendDetectionChartProps) {
  const chartData = data?.trendData || [
    { time: '9:00', MissingPart: 1, Misalignment: 2, Dent: 1, Crack: 0, Scratch: 1 },
    { time: '12:00', MissingPart: 1, Misalignment: 1, Dent: 2, Crack: 1, Scratch: 0 },
    { time: '15:00', MissingPart: 2, Misalignment: 1, Dent: 1, Crack: 2, Scratch: 1 },
    { time: '18:00', MissingPart: 1, Misalignment: 2, Dent: 0, Crack: 3, Scratch: 2 },
    { time: '21:00', MissingPart: 1, Misalignment: 3, Dent: 1, Crack: 1, Scratch: 3 }
  ];

  const lineChartData = {
    labels: chartData.map(item => item.time),
    datasets: [
      {
        label: 'Missing Part',
        data: chartData.map(item => item.MissingPart),
        borderColor: 'rgb(136, 132, 216)',
        backgroundColor: 'rgba(136, 132, 216, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Misalignment',
        data: chartData.map(item => item.Misalignment),
        borderColor: 'rgb(130, 202, 157)',
        backgroundColor: 'rgba(130, 202, 157, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Dent',
        data: chartData.map(item => item.Dent),
        borderColor: 'rgb(255, 198, 88)',
        backgroundColor: 'rgba(255, 198, 88, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Crack',
        data: chartData.map(item => item.Crack),
        borderColor: 'rgb(255, 115, 0)',
        backgroundColor: 'rgba(255, 115, 0, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Scratch',
        data: chartData.map(item => item.Scratch),
        borderColor: 'rgb(0, 196, 159)',
        backgroundColor: 'rgba(0, 196, 159, 0.1)',
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: false,
      }
    ]
  };

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

  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Trend of Top 5 Detection Types
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[280px]">
        <Line data={lineChartData} options={options} />
      </div>
    </div>
  );
}
