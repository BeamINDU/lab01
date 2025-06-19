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

// 🛡️ Completely safe gradient creation
const createSafeGradient = (ctx: CanvasRenderingContext2D, defectType: string, chartArea: any) => {
  // ✅ Comprehensive safety checks
  if (!ctx || !chartArea || 
      typeof chartArea.bottom !== 'number' || 
      typeof chartArea.top !== 'number' ||
      chartArea.bottom <= chartArea.top) {
    return getDefectTypeColor(defectType);
  }

  try {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    
    const colorPalette: Record<string, { start: string; end: string; }> = {
      'Crack': { start: 'rgba(239, 68, 68, 0.3)', end: 'rgba(239, 68, 68, 0.9)' },
      'Scratch': { start: 'rgba(59, 130, 246, 0.3)', end: 'rgba(59, 130, 246, 0.9)' },
      'Dent': { start: 'rgba(34, 197, 94, 0.3)', end: 'rgba(34, 197, 94, 0.9)' },
      'Missing': { start: 'rgba(245, 158, 11, 0.3)', end: 'rgba(245, 158, 11, 0.9)' },
      'Broken': { start: 'rgba(168, 85, 247, 0.3)', end: 'rgba(168, 85, 247, 0.9)' },
      'Dirty': { start: 'rgba(236, 72, 153, 0.3)', end: 'rgba(236, 72, 153, 0.9)' },
      'Deform': { start: 'rgba(20, 184, 166, 0.3)', end: 'rgba(20, 184, 166, 0.9)' },
    };
    
    const colors = colorPalette[defectType] || { 
      start: 'rgba(156, 163, 175, 0.3)', 
      end: 'rgba(156, 163, 175, 0.9)' 
    };
    
    gradient.addColorStop(0, colors.start);
    gradient.addColorStop(1, colors.end);
    
    return gradient;
  } catch (error) {
    console.warn('Gradient creation failed, using solid color:', error);
    return getDefectTypeColor(defectType);
  }
};

export default function NGDistributionChart({ data, loading, error }: NGDistributionChartProps) {
  const chartData = useMemo(() => {
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
      if (!item.hour_slot || !item.defecttype) return;
      
      const hour = new Date(item.hour_slot).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      
      if (!timeMap.has(hour)) {
        timeMap.set(hour, {});
      }
      
      const timeData = timeMap.get(hour)!;
      const defectType = item.defecttype;
      const count = item.defect_count || 0;
      
      timeData[defectType] = (timeData[defectType] || 0) + count;
      defectTypes.add(defectType);
    });

    // Step 2: Create sorted labels and types
    const labels = Array.from(timeMap.keys()).sort();
    const defectTypeArray = Array.from(defectTypes).sort();
    
    // Step 3: Create datasets with comprehensive error handling
    const datasets = defectTypeArray.map((defectType) => ({
      label: defectType,
      data: labels.map(hour => {
        const value = timeMap.get(hour)?.[defectType] || 0;
        // ✅ Ensure all values are valid numbers
        return typeof value === 'number' && !isNaN(value) ? value : 0;
      }),
      backgroundColor: function(context: any) {
        // ✅ Comprehensive context validation
        if (!context || !context.chart) {
          return getDefectTypeColor(defectType);
        }
        
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        
        if (!ctx || !chartArea) {
          return getDefectTypeColor(defectType);
        }
        
        return createSafeGradient(ctx, defectType, chartArea);
      },
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
    }));

    return { labels, datasets };
  }, [data]);

  // 🎨 Ultra-safe chart options
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
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
            family: "'Inter', 'Segoe UI', 'Roboto', sans-serif"
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
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          weight: 'normal' as const,
          family: "'Inter', sans-serif"
        },
        padding: 16,
        titleSpacing: 8,
        bodySpacing: 6,
        callbacks: {
          title: function(context: any) {
            // ✅ Safe context access
            if (!context || !context[0] || !context[0].label) return 'Time: --';
            return `🕐 Time: ${context[0].label}`;
          },
          label: function(context: any) {
            // ✅ Safe context access
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
            // ✅ Safe total calculation
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
            if (!context || 
                !context.parsed || 
                typeof context.parsed.y !== 'number' || 
                isNaN(context.parsed.y)) {
              return false;
            }
            return context.parsed.y > 0; // แสดงทุก bar ที่มีค่า
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
          size: 12, // เพิ่มขนาดให้เห็นชัดขึ้น
          family: "'Inter', sans-serif"
        },
        // ✅ แสดงค่าของแต่ละ bar พร้อม total บน bar สุดท้าย
        formatter: function(value: any, context: any) {
          try {
            if (!context || 
                !context.parsed || 
                typeof context.parsed.y !== 'number' || 
                isNaN(context.parsed.y) ||
                context.parsed.y <= 0) {
              return '';
            }

            const currentValue = context.parsed.y;
            const dataIndex = context.dataIndex;
            const chart = context.chart;
            
            // คำนวณ total ของ stack
            let stackTotal = 0;
            if (chart && chart.data && chart.data.datasets) {
              chart.data.datasets.forEach((dataset: any) => {
                if (dataset.data && dataset.data[dataIndex]) {
                  const val = dataset.data[dataIndex];
                  if (typeof val === 'number' && !isNaN(val) && val > 0) {
                    stackTotal += val;
                  }
                }
              });
            }

            // ตรวจสอบว่าเป็น bar สุดท้ายของ stack หรือไม่
            const datasetIndex = context.datasetIndex;
            const totalDatasets = chart.data.datasets.length;
            let isTopBar = true;
            
            // เช็คว่ามี dataset ใดที่อยู่เหนือขึ้นไปและมีค่า > 0 หรือไม่
            for (let i = datasetIndex + 1; i < totalDatasets; i++) {
              const dataset = chart.data.datasets[i];
              if (dataset.data && dataset.data[dataIndex] && dataset.data[dataIndex] > 0) {
                isTopBar = false;
                break;
              }
            }

            // แสดงผลแตกต่างกัน
            if (isTopBar && stackTotal > currentValue) {
              // Bar สุดท้าย: แสดง current value + total
              return `${currentValue}\n(${stackTotal})`;
            } else {
              // Bar อื่นๆ: แสดงแค่ current value
              return currentValue.toString();
            }
            
          } catch (error) {
            console.warn('Datalabels formatter failed:', error);
            return '';
          }
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.6)', // เพิ่ม contrast
        textStrokeWidth: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // เพิ่ม background
        borderRadius: 8,
        padding: {
          top: 6,
          bottom: 6,
          left: 8,
          right: 8
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: '🕐 Time (Hour)',
          font: { 
            size: 13, 
            weight: 'bold' as const,
            family: "'Inter', sans-serif"
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
            family: "'Inter', sans-serif"
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
          text: '📊 Defect Count',
          font: { 
            size: 13, 
            weight: 'bold' as const,
            family: "'Inter', sans-serif"
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
            family: "'Inter', sans-serif"
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
      duration: 1200, // Reduced from 1500 for stability
      easing: 'easeInOutCubic',
    },
    transitions: {
      active: {
        animation: {
          duration: 200 // Reduced for stability
        }
      }
    }
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
              // ✅ Safe total calculation
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
    </div>
  );
}