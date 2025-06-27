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
import type { DefectTypeData } from '@/app/types/dashboard';

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
  data: DefectTypeData[] | null;
  loading?: boolean;
  error?: string;
}

const getColorForLine = (lineIndex: number): string => {
  const colors = [
    'rgba(30, 58, 138, 0.8)',
    'rgba(96, 165, 250, 0.8)',
    'rgba(186, 230, 253, 0.8)',
    'rgba(224, 242, 254, 0.8)',
    'rgba(147, 197, 253, 0.8)',
  ];
  return colors[lineIndex % colors.length];
};

const FrequentDefectsChart = React.memo<FrequentDefectsChartProps>(({ data, loading, error }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data',
          data: [0],
          backgroundColor: 'rgba(156, 163, 175, 0.8)',
          borderColor: 'rgba(156, 163, 175, 1)',
          borderWidth: 1,
        }]
      };
    }

    const groupedByDefect = groupBy(data, 'defecttype');
    const linesSet = new Set(data.map(item => item.line || 'Unknown Line'));
    

    const defectTotals = Object.entries(groupedByDefect).map(([defectType, items]) => ({
      defectType,
      total: sumBy(items, 'quantity')
    }));


    const top5Defects = defectTotals
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(item => item.defectType);

    const linesArray = Array.from(linesSet).sort();
    

    const datasets = linesArray.map((line, index) => ({
      label: line,
      data: top5Defects.map(defectType => {
        const items = groupedByDefect[defectType] || [];
        return sumBy(items.filter(item => (item.line || 'Unknown Line') === line), 'quantity');
      }),
      backgroundColor: getColorForLine(index),
      borderColor: getColorForLine(index).replace('0.8', '1'),
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }));

    return { 
      labels: top5Defects, 
      datasets 
    };
  }, [data]);


  const maxStackedValue = useMemo(() => {
    if (!chartData.datasets.length) return 0;
    
    return Math.max(
      ...chartData.labels.map((_, labelIndex) => 
        chartData.datasets.reduce((sum, dataset) => 
          sum + (dataset.data[labelIndex] || 0), 0
        )
      )
    );
  }, [chartData]);

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { right: 50, left: 10, top: 10, bottom: 1 }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 10 },
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: (context: any) => `Defect: ${context[0].label}`,
          label: (context: any) => `${context.dataset.label}: ${context.parsed.x}`,
          afterBody: (context: any) => {
            const total = chartData.datasets.reduce((sum, dataset) => {
              return sum + (dataset.data[context[0].dataIndex] || 0);
            }, 0);
            return [`Total: ${total}`];
          }
        }
      },
      datalabels: {
        display: (context: any) => context.datasetIndex === chartData.datasets.length - 1,
        anchor: 'end',
        align: 'right',
        color: '#1f2937',
        font: { weight: 'bold', size: 10 },
        formatter: (value: number, context: any) => {
          const total = chartData.datasets.reduce((sum, dataset) => 
            sum + (dataset.data[context.dataIndex] || 0), 0
          );
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
        title: {
          display: true,
          text: 'Quantity',
          font: { size: 12, weight: 'bold' },
          color: '#374151',
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
        ticks: {
          font: { size: 10 },
          callback: (value: any) => value <= maxStackedValue ? value : ''
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Defect Types',
          font: { size: 12, weight: 'bold' },
          color: '#374151',
        },
        grid: { display: false },
        ticks: {
          font: { size: 9 },
          callback: function(value: any) {
            const label = this.getLabelForValue(value);
            return label && label.length > 20 ? label.substring(0, 17) + '...' : label;
          }
        }
      }
    },
    animation: { duration: 1200 }
  };



  const LoadingState = () => (
    <div className="h-[200px] sm:h-[240px] md:h-[260px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorState = () => (
    <div className="h-[200px] sm:h-[240px] md:h-[260px] flex items-center justify-center">
      <p className="text-red-500 text-center">{error}</p>
    </div>
  );



return (
   <div className="bg-white rounded-xl shadow p-3 md:p-4 h-[345px]">
    <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
      Top 5 Most Frequent Defect Types
    </h2>
    
    {loading ? (
      <div className="h-[240px] flex items-center justify-center"> 
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    ) : error ? (
      <div className="h-[240px] flex items-center justify-center"> 
        <p className="text-red-500 text-center">{error}</p>
      </div>
    ) : (
      <div className="h-[240px] sm:h-[250px] md:h-[280px]">
        <Bar data={chartData} options={options} />
      </div>
    )}
  </div>
);
});

FrequentDefectsChart.displayName = 'FrequentDefectsChart';

export default FrequentDefectsChart;