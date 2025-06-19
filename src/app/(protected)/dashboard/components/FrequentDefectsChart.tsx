// src/app/(protected)/dashboard/components/FrequentDefectsChart.tsx
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

// สีสำหรับแต่ละ line
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

export default function FrequentDefectsChart({ data, loading, error }: FrequentDefectsChartProps) {
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

    // Group by defecttype และ collect lines
    const defectMap = new Map<string, Record<string, number>>();
    const linesSet = new Set<string>();
    
    data.forEach(item => {
      if (!defectMap.has(item.defecttype)) {
        defectMap.set(item.defecttype, {});
      }
      
      const defectData = defectMap.get(item.defecttype)!;
      defectData[item.line] = (defectData[item.line] || 0) + (item.quantity || 0);
      linesSet.add(item.line);
    });

    // สร้าง labels (defect types) sorted by total quantity
    const defectTotals = new Map<string, number>();
    defectMap.forEach((lineData, defectType) => {
      const total = Object.values(lineData).reduce((sum, qty) => sum + qty, 0);
      defectTotals.set(defectType, total);
    });
    
    const labels = Array.from(defectTotals.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by total quantity desc
      .slice(0, 5) // Top 5
      .map(([defectType]) => defectType);

    const linesArray = Array.from(linesSet).sort();
    
    // สร้าง datasets สำหรับแต่ละ line
    const datasets = linesArray.map((line, index) => ({
      label: line,
      data: labels.map(defectType => defectMap.get(defectType)?.[line] || 0),
      backgroundColor: getColorForLine(index),
      borderColor: getColorForLine(index).replace('0.8', '1'),
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
    }));

    return { labels, datasets };
  }, [data]);

  const maxStackedValue = useMemo(() => {
    if (chartData.datasets.length === 0) return 0;
    
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
          title: function(context: any) {
            return `Defect: ${context[0].label}`;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.x}`;
          },
          afterBody: function(context: any) {
            const dataIndex = context[0].dataIndex;
            const total = chartData.datasets.reduce((sum, dataset) => {
              return sum + (dataset.data[dataIndex] || 0);
            }, 0);
            return [`Total: ${total}`];
          }
        }
      },
      datalabels: {
        display: function(context: any) {
          return context.datasetIndex === chartData.datasets.length - 1;
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
          const total = chartData.datasets.reduce((sum, dataset) => {
            return sum + (dataset.data[dataIndex] || 0);
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
          Top 5 Most Frequent Defect Types
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
          Top 5 Most Frequent Defect Types
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
        Top 5 Most Frequent Defect Types
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* แสดงข้อมูลสรุปด้านล่าง */}
      {data && data.length > 0 && (
        <div className="mt-2 text-xs text-gray-600 text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            {chartData.labels.slice(0, 3).map((defectType, index) => {
              const total = chartData.datasets.reduce((sum, dataset) => 
                sum + (dataset.data[index] || 0), 0
              );
              return (
                <span key={index} className="whitespace-nowrap">
                  <strong>{defectType}:</strong> {total}
                </span>
              );
            })}
          </div>
          <div className="mt-1">
            Lines: {chartData.datasets.length} | Total records: {data.length}
          </div>
        </div>
      )}
    </div>
  );
}