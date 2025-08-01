'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { groupBy, sumBy } from 'lodash';
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
import type { NgDistributionData } from '@/app/types/dashboard';
import { ChartColorSystem } from '@/app/utils/colorSystem';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface NGDistributionChartProps {
  data: NgDistributionData[] | null;
  loading?: boolean;
  error?: string;
}


const NGDistributionChart = React.memo<NGDistributionChartProps>(({ data, loading, error }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data',
          data: [0],
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgba(156, 163, 175, 0.8)',
          borderWidth: 2,
          borderRadius: 8,
        }]
      };
    }

    const validData = data.filter(item => item.hour_slot && item.defecttype);
    const defectTypes = [...new Set(validData.map(item => item.defecttype))].sort();
    const colors = ChartColorSystem.getColorsForKeys(defectTypes, 'business');

    const groupedByHour = groupBy(validData, item =>
      new Date(item.hour_slot).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );

    const timeLabels = Object.keys(groupedByHour).sort();

    const datasets = defectTypes.map((defectType, index) => ({
      label: defectType,
      data: timeLabels.map(hour => {
        const hourData = groupedByHour[hour] || [];
        return sumBy(
          hourData.filter(item => item.defecttype === defectType),
          'defect_count'
        );
      }),
      backgroundColor: colors[index].background,
      borderColor: colors[index].border,
      hoverBackgroundColor: colors[index].hover,
      borderWidth: 1,
      borderRadius: 0,
      borderSkipped: false,
    }));

    return { labels: timeLabels, datasets };
  }, [data]);


  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 20, bottom: 10, left: 10, right: 10 }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 10},
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F3F4F6',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: (context: any) => `Time: ${context[0].label}`,
          label: (context: any) => {
            try {
              const defectType = context.dataset.label;
              const count = context.parsed?.y || 0;
              return `${defectType}: ${count}`;
            } catch {
              return 'Invalid data';
            }
          },
          afterBody: (context: any) => {
            try {
              const total = context.reduce((sum: number, item: any) => 
                sum + (item?.parsed?.y || 0), 0
              );
              return [``, `Total: ${total}`];
            } catch {
              return [`Total: --`];
            }
          }
        }
      },
      datalabels: {
        display: true,
        anchor: 'center', 
        align: 'center', 
        color: '#000000',
        font: { 
          size: 11,
          weight: 'bold'
        },
        formatter: (value: any) => {
          try {
            return (value && value > 0) ? value.toString() : '';
          } catch {
            return '';
          }
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Time (Hour)',
          font: { size: 12, weight: 'bold' },
          color: '#374151',
        },
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          color: '#6B7280',
          maxRotation: 45,
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Defect Count',
          font: { size: 12, weight: 'bold' },
          color: '#374151',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
          lineWidth: 1,
        },
        ticks: {
          font: { size: 11 },
          color: '#6B7280',
          stepSize: 1,
        },
        beginAtZero: true,
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic',
    },
  };

  const LoadingState = () => (
    <div className="h-[240px] sm:h-[280px] md:h-[320px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorState = () => (
    <div className="h-[240px] sm:h-[280px] md:h-[320px] flex items-center justify-center">
      <p className="text-red-500 text-center">{error}</p>
    </div>
  );

  return (
     <div className="bg-white rounded-xl shadow p-3 md:p-4 h-[345px]">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
        Defect Distribution by Hour
      </h2>
      
      <div className="h-[240px] sm:h-[250px] md:h-[280px]">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
});

NGDistributionChart.displayName = 'NGDistributionChart';

export default NGDistributionChart;