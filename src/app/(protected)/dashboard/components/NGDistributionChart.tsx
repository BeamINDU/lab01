// src/app/(protected)/dashboard/components/NGDistributionChart.tsx
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
import type { NgDistributionData } from '@/app/types/dashboard';

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

// 🎨 Modern Color Palette
const getDefectTypeColor = (defectType: string, opacity: number = 0.85): string => {
  const colorPalette: Record<string, string> = {
    'Crack': `rgba(239, 68, 68, ${opacity})`,     // Red
    'Scratch': `rgba(59, 130, 246, ${opacity})`,  // Blue  
    'Dent': `rgba(34, 197, 94, ${opacity})`,      // Green
    'Missing': `rgba(245, 158, 11, ${opacity})`,  // Amber
    'Broken': `rgba(168, 85, 247, ${opacity})`,   // Purple
    'Dirty': `rgba(236, 72, 153, ${opacity})`,    // Pink
    'Deform': `rgba(20, 184, 166, ${opacity})`,   // Teal
  };
  
  return colorPalette[defectType] || `rgba(156, 163, 175, ${opacity})`;
};

export default function NGDistributionChart({ data, loading, error }: NGDistributionChartProps) {
  const chartData = useMemo(() => {
    console.log('🔍 NGDistribution raw data:', data);

    if (!data || data.length === 0) {
      return {
        labels: ['9:00', '12:00', '15:00', '18:00', '21:00'],
        datasets: [{
          label: 'No Data Available',
          data: [0, 0, 0, 0, 0],
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgba(156, 163, 175, 0.8)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    // Step 1: Process data
    const timeMap = new Map<string, Record<string, number>>();
    const defectTypes = new Set<string>();
    
    data.forEach(item => {
      // Handle potential null/undefined values
      if (!item.hour_slot || !item.defecttype) {
        console.warn('⚠️ Skipping item with missing data:', item);
        return;
      }
      
      const hour = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      
      console.log(`⏰ Processing: ${item.defecttype} at ${hour} with count ${item.defect_count}`);
      
      if (!timeMap.has(hour)) {
        timeMap.set(hour, {});
      }
      
      const timeData = timeMap.get(hour)!;
      const defectType = item.defecttype;
      const count = item.defect_count || 0;
      
      timeData[defectType] = (timeData[defectType] || 0) + count;
      defectTypes.add(defectType);
    });

    console.log('📊 Processed timeMap:', Object.fromEntries(timeMap));
    console.log('🏷️ Defect types found:', Array.from(defectTypes));

    // Step 2: Create sorted labels and types
    const labels = Array.from(timeMap.keys()).sort();
    const defectTypeArray = Array.from(defectTypes).sort();
    
    console.log('🕐 Time labels:', labels);
    console.log('📋 Defect type array:', defectTypeArray);

    // Step 3: Create datasets
    const datasets = defectTypeArray.map((defectType) => {
      const dataValues = labels.map(hour => {
        const value = timeMap.get(hour)?.[defectType] || 0;
        return typeof value === 'number' && !isNaN(value) ? value : 0;
      });

      console.log(`📈 Dataset for ${defectType}:`, dataValues);

      return {
        label: defectType,
        data: dataValues,
        backgroundColor: getDefectTypeColor(defectType, 0.8),
        borderColor: getDefectTypeColor(defectType, 1),
        borderWidth: 2,
        borderRadius: {
          topLeft: 8,
          topRight: 8,
          bottomLeft: 8,
          bottomRight: 8,
        },
        borderSkipped: false,
        hoverBackgroundColor: getDefectTypeColor(defectType, 0.95),
        hoverBorderColor: getDefectTypeColor(defectType, 1),
        hoverBorderWidth: 3,
      };
    });

    const result = { labels, datasets };
    console.log('✅ Final chart data:', result);
    return result;
  }, [data]);

  // 🎨 Simplified but effective chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        labels: {
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 12,
          boxHeight: 12,
          color: '#374151',
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F3F4F6',
        borderColor: 'rgba(75, 85, 99, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
          weight: 'normal' as const,
        },
        padding: 16,
        titleSpacing: 8,
        bodySpacing: 6,
        callbacks: {
          title: function(context: any) {
            if (!context || !context[0] || !context[0].label) return 'Time: --';
            return `Time: ${context[0].label}`;
          },
          label: function(context: any) {
            if (!context || !context.dataset || typeof context.parsed?.y !== 'number') {
              return 'Invalid data';
            }
            
            const defectType = context.dataset.label || 'Unknown';
            const count = context.parsed.y;
            const emoji = defectType === 'Crack' ? '🔴' : 
                         defectType === 'Scratch' ? '🔵' : 
                         defectType === 'Dent' ? '🟢' : 
                         defectType === 'Missing' ? '🟡' : 
                         defectType === 'Broken' ? '🟣' : 
                         defectType === 'Dirty' ? '🌸' : 
                         defectType === 'Deform' ? '🟦' : '⚪';
            return `${emoji} ${defectType}: ${count} defects`;
          },
          afterBody: function(context: any) {
            if (!context || !Array.isArray(context)) return ['📊 Total: 0'];
            
            const total = context.reduce((sum: number, item: any) => {
              const value = item?.parsed?.y;
              return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
            }, 0);
            return [``, `📊 Total Defects: ${total}`];
          }
        }
      },
      datalabels: {
        // ✅ แสดง labels สำหรับทุก bar ที่มีค่า > 0
        display: function(context: any) {
          try {
            if (!context?.parsed || typeof context.parsed.y !== 'number' || isNaN(context.parsed.y)) {
              return false;
            }
            console.log(`🏷️ Datalabel check for value: ${context.parsed.y}`);
            return context.parsed.y > 0;
          } catch (error) {
            console.warn('Datalabels display check failed:', error);
            return false;
          }
        },
        anchor: 'center',
        align: 'center',
        color: '#FFFFFF',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        // ✅ แสดงค่าแบบง่ายๆ
        formatter: function(value: any, context: any) {
          try {
            if (!context?.parsed || typeof context.parsed.y !== 'number' || 
                isNaN(context.parsed.y) || context.parsed.y <= 0) {
              return '';
            }

            const currentValue = context.parsed.y;
            console.log(`🏷️ Displaying label: ${currentValue}`);
            return currentValue.toString();
            
          } catch (error) {
            console.warn('Datalabels formatter failed:', error);
            return '';
          }
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.8)',
        textStrokeWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 4,
        padding: {
          top: 4,
          bottom: 4,
          left: 6,
          right: 6
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Time (Hour)',
          font: { 
            size: 13, 
            weight: 'bold' as const,
          },
          color: '#374151',
          padding: { top: 15 }
        },
        grid: {
          display: false,
        },
        ticks: {
          font: { 
            size: 12,
            weight: 'normal' as const,
          },
          color: '#6B7280',
          maxRotation: 0,
          padding: 8,
        },
        border: {
          color: 'rgba(229, 231, 235, 0.8)',
          width: 2,
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Defect Count',
          font: { 
            size: 13, 
            weight: 'bold' as const,
          },
          color: '#374151',
          padding: { bottom: 15 }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.4)',
          lineWidth: 1,
          drawTicks: false,
        },
        ticks: {
          font: { 
            size: 12,
            weight: 'normal' as const,
          },
          color: '#6B7280',
          padding: 8,
          stepSize: 1,
        },
        border: {
          color: 'rgba(229, 231, 235, 0.8)',
          width: 2,
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

  if (loading) {
    return (
      <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
          Defect Distribution by Hour
        </h2>
        <div className="h-[240px] sm:h-[280px] md:h-[320px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
          Defect Distribution by Hour
        </h2>
        <div className="h-[240px] sm:h-[280px] md:h-[320px] flex items-center justify-center">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
      {/* Header */}
      <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
        Defect Distribution by Hour
      </h2>
      
      {/* Chart Container */}
      <div className="h-[240px] sm:h-[280px] md:h-[320px]">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Summary */}
      {data && data.length > 0 && (
        <div className="text-xs text-gray-500 mt-3 text-center">
          <div className="flex justify-center gap-4 flex-wrap">
            <span>Time periods: {chartData.labels.length}</span>
            <span>Defect types: {chartData.datasets.length}</span>
            <span>Total records: {data.length}</span>
          </div>
          
          {/* แสดงสรุปแต่ละ defect type */}
          <div className="flex justify-center gap-4 flex-wrap mt-1">
            {chartData.datasets.map((dataset, index) => {
              const total = dataset.data.reduce((sum: number, value: any) => {
                const num = typeof value === 'number' && !isNaN(value) ? value : 0;
                return sum + num;
              }, 0);
              
              const emoji = dataset.label === 'Crack' ? '🔴' : 
                           dataset.label === 'Scratch' ? '🔵' : 
                           dataset.label === 'Dent' ? '🟢' : 
                           dataset.label === 'Missing' ? '🟡' : 
                           dataset.label === 'Broken' ? '🟣' : 
                           dataset.label === 'Dirty' ? '🌸' : 
                           dataset.label === 'Deform' ? '🟦' : '⚪';
              
              return (
                <span key={index} className="whitespace-nowrap">
                  <span className="text-sm">{emoji}</span>
                  <strong>{dataset.label}:</strong> {total}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Raw data length: {data?.length || 0}</div>
              <div>Chart labels: {JSON.stringify(chartData.labels)}</div>
              <div>Datasets count: {chartData.datasets.length}</div>
              {chartData.datasets.map((dataset, index) => (
                <div key={index}>
                  {dataset.label}: [{dataset.data.join(', ')}]
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}