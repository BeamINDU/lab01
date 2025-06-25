'use client';

import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { groupBy, sumBy, orderBy } from 'lodash';
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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import type { TrendData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface TrendDetectionChartProps {
  data: TrendData[] | null;
  loading?: boolean;
  error?: string;
}


const getColorForDefectType = (index: number): string => {
  const colors = [
    'rgb(239, 68, 68)',    
    'rgb(59, 130, 246)',     
    'rgb(34, 197, 94)',    
    'rgb(245, 158, 11)',   
    'rgb(168, 85, 247)',   
    'rgb(236, 72, 153)',  
    'rgb(20, 184, 166)',   
    'rgb(156, 163, 175)',  
  ];
  return colors[index % colors.length];
};

const TrendDetectionChart = React.memo<TrendDetectionChartProps>(({ data, loading, error }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data',
          data: [0],
          borderColor: 'rgba(156, 163, 175, 0.8)',
          backgroundColor: 'rgba(156, 163, 175, 0.1)',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.4,
        }]
      };
    }


    const validData = data.filter(item => item.hour_slot && item.defecttype);


    const defectTotals = Object.entries(groupBy(validData, 'defecttype'))
      .map(([defectType, items]) => ({
        defectType,
        total: sumBy(items, 'quantity')
      }));

    const top5DefectTypes = orderBy(defectTotals, 'total', 'desc')
      .slice(0, 5)
      .map(item => item.defectType);


    const filteredData = validData.filter(item => 
      top5DefectTypes.includes(item.defecttype)
    );

 
    const timeSlots = [...new Set(filteredData.map(item => 
      new Date(item.hour_slot).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      })
    ))].sort();

    const datasets = top5DefectTypes.map((defectType, index) => {
      const color = getColorForDefectType(index);
      
      // Group data by time for this defect type
      const defectTimeData = groupBy(
        filteredData.filter(item => item.defecttype === defectType), 
        item => new Date(item.hour_slot).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        })
      );

      const dataPoints = timeSlots.map(timeSlot => 
        sumBy(defectTimeData[timeSlot] || [], 'quantity')
      );

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

    return { labels: timeSlots, datasets };
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
        align: 'center' as const,
        labels: {
          font: { size: 12 },
          padding: 8,
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
        titleFont: { size: 13, weight: 'bold' as const },
        bodyFont: { size: 12 },
        padding: 12,
        callbacks: {
          title: (context: any) => `Time: ${context[0].label}`,
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`,
          afterBody: (context: any) => {
            try {
              const total = context.reduce((sum: number, item: any) => 
                sum + (item.parsed?.y || 0), 0
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
        anchor: 'end' as const,
        align: 'top' as const,
        color: '#374151',
        font: { 
          weight: 'bold' as const, 
          size: 10 
        },
        formatter: (value: any) => {
          try {
            return (value && value > 0) ? value.toString() : '';
          } catch {
            return '';
          }
        },
        //backgroundColor: 'rgba(255, 255, 255, 0.8)',
        //borderColor: 'rgba(107, 114, 128, 0.3)',
        borderWidth: 1,
        borderRadius: 4,
        padding: { 
          top: 2, 
          bottom: 2, 
          left: 4, 
          right: 4 
        },
        offset: 3,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time (Hour)',
          font: { size: 12, weight: 'bold' as const },
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
          font: { size: 12, weight: 'bold' as const },
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
        suggestedMax: function(context: any) {
          const maxValue = Math.max(...context.chart.data.datasets.flatMap((dataset: any) => dataset.data));
          return Math.ceil(maxValue * 1.3); 
        },
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutCubic' as const,
    },
    elements: {
      point: { hoverRadius: 8 },
      line: { tension: 0.4 }
    }
  };

  const LoadingState = () => (
    <div className="h-[200px] sm:h-[240px] md:h-[280px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorState = () => (
    <div className="h-[200px] sm:h-[240px] md:h-[280px] flex items-center justify-center">
      <p className="text-red-500 text-center">{error}</p>
    </div>
  );

  return (
     <div className="bg-white rounded-xl shadow p-3 md:p-4 h-[345px]">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Trend of Top 5 Detection Types
      </h2>
      
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="h-[240px] sm:h-[250px] md:h-[280px]">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
});

TrendDetectionChart.displayName = 'TrendDetectionChart';

export default TrendDetectionChart;