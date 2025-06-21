// DefectByCameraChart.tsx - เปลี่ยนเป็น Chart.js stacked bar chart

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
import type { DefectCameraData } from '@/app/types/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DefectByCameraChartProps {
  data: DefectCameraData[] | null;
  loading?: boolean;
  error?: string;
}

// สีสำหรับแต่ละ defect type
const getDefectTypeColor = (defectType: string, opacity: number = 0.85): string => {
  const colorPalette: Record<string, string> = {
    'Crack': `rgba(239, 68, 68, ${opacity})`,     // Red
    'Scratch': `rgba(59, 130, 246, ${opacity})`,  // Blue  
    'Dent': `rgba(34, 197, 94, ${opacity})`,      // Green
    'Missing': `rgba(245, 158, 11, ${opacity})`,  // Amber
    'Broken': `rgba(168, 85, 247, ${opacity})`,   // Purple
    'Dirty': `rgba(236, 72, 153, ${opacity})`,    // Pink
    'Deform': `rgba(20, 184, 166, ${opacity})`,   // Teal
    'Missing Part': `rgba(245, 158, 11, ${opacity})`, // Amber
    'Misalignment': `rgba(156, 163, 175, ${opacity})`, // Gray
  };
  
  return colorPalette[defectType] || `rgba(156, 163, 175, ${opacity})`;
};

export default function DefectByCameraChart({ data, loading, error }: DefectByCameraChartProps) {
  const chartData = useMemo(() => {
    console.log('🔍 DefectByCameraChart raw data:', data);

    if (!data || data.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data Available',
          data: [0],
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgba(156, 163, 175, 0.8)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      };
    }

    // Step 1: Group by camera และ defect type
    const cameraMap = new Map<string, Record<string, number>>();
    const defectTypes = new Set<string>();
    
    data.forEach(item => {
      if (!item.cameraname && !item.cameraid) {
        console.warn('⚠️ Skipping item with missing camera data:', item);
        return;
      }
      
      const cameraName = item.cameraname || item.cameraid || 'Unknown Camera';
      const defectType = item.defecttype || 'Unknown Defect';
      const count = item.totalng || 0;
      
      console.log(`⏰ Processing: ${defectType} at ${cameraName} with count ${count}`);
      
      if (!cameraMap.has(cameraName)) {
        cameraMap.set(cameraName, {});
      }
      
      const cameraData = cameraMap.get(cameraName)!;
      cameraData[defectType] = (cameraData[defectType] || 0) + count;
      defectTypes.add(defectType);
    });

    console.log('📊 Processed cameraMap:', Object.fromEntries(cameraMap));
    console.log('🏷️ Defect types found:', Array.from(defectTypes));

    // Step 2: Get top 5 cameras by total defects
    const cameraTotals = new Map<string, number>();
    cameraMap.forEach((defectData, cameraName) => {
      const total = Object.values(defectData).reduce((sum, count) => sum + count, 0);
      cameraTotals.set(cameraName, total);
    });
    
    const topCameras = Array.from(cameraTotals.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by total defects DESC
      .slice(0, 5) // Top 5
      .map(([cameraName]) => cameraName);

    console.log('🏆 Top 5 cameras:', topCameras);

    // Step 3: Create labels และ datasets
    const labels = topCameras;
    const defectTypeArray = Array.from(defectTypes).sort();
    
    console.log('🕐 Camera labels:', labels);
    console.log('📋 Defect type array:', defectTypeArray);

    // Step 4: Create datasets สำหรับแต่ละ defect type
    const datasets = defectTypeArray.map((defectType) => {
      const dataValues = labels.map(cameraName => {
        const value = cameraMap.get(cameraName)?.[defectType] || 0;
        return typeof value === 'number' && !isNaN(value) ? value : 0;
      });

      console.log(`📈 Dataset for ${defectType}:`, dataValues);

      return {
        label: defectType,
        data: dataValues,
        backgroundColor: getDefectTypeColor(defectType, 0.8),
        borderColor: getDefectTypeColor(defectType, 1),
        borderWidth: 1,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 4,
          bottomRight: 4,
        },
        borderSkipped: false,
        hoverBackgroundColor: getDefectTypeColor(defectType, 0.95),
        hoverBorderColor: getDefectTypeColor(defectType, 1),
        hoverBorderWidth: 2,
      };
    });

    const result = { labels, datasets };
    console.log('✅ Final camera chart data:', result);
    return result;
  }, [data]);

  // คำนวณค่าสูงสุดของ stacked bars
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
        top: 10, // ✅ ลดจาก 60 เป็น 20
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          font: { 
            size: 13, //  ลดขนาดตัวอักษร legend
            weight: 'bold' as const,
          },
          padding: 8, //  ลด padding ระหว่าง legend items
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8, //  ลดขนาด icon
          boxHeight: 8,
          color: '#374151',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: function(context: any) {
            if (!context || !context[0] || !context[0].label) return 'Camera: --';
            return `Camera: ${context[0].label}`;
          },
          label: function(context: any) {
            if (!context || !context.dataset || typeof context.parsed?.x !== 'number') {
              return 'Invalid data';
            }
            
            const defectType = context.dataset.label || 'Unknown';
            const count = context.parsed.x;
            const emoji = defectType === 'Crack' ? '🔴' : 
                         defectType === 'Scratch' ? '🔵' : 
                         defectType === 'Dent' ? '🟢' : 
                         defectType === 'Missing' || defectType === 'Missing Part' ? '🟡' : 
                         defectType === 'Broken' ? '🟣' : 
                         defectType === 'Dirty' ? '🌸' : 
                         defectType === 'Deform' ? '🟦' : '⚪';
            return `${emoji} ${defectType}: ${count} defects`;
          },
          afterBody: function(context: any) {
            if (!context || !Array.isArray(context)) return ['📊 Total: 0'];
            
            const total = context.reduce((sum: number, item: any) => {
              const value = item?.parsed?.x;
              return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
            }, 0);
            return [``, `📊 Total Defects: ${total}`];
          }
        }
      },
      datalabels: {
        // แสดง total สำหรับแต่ละ camera
        display: function(context: any) {
          return context.datasetIndex === chartData.datasets.length - 1;
        },
        anchor: 'end',
        align: 'right',
        color: '#1f2937',
        font: {
          weight: 'bold' as const,
          size: 10,
        },
        formatter: function(value: any, context: any) {
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
        title: {
          display: true,
          text: 'Defects Count',
          font: { size: 11, weight: 'bold' as const }
        },
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
        title: {
          display: true,
          text: 'Cameras',
          font: { size: 11, weight: 'bold' as const }
        },
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 9 },
          callback: function(value: any, index: number) {
            const label = this.getLabelForValue(value);
            if (label && label.length > 15) {
              return label.substring(0, 12) + '...';
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
          Top 5 Defects Most Found by Cameras
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
          Top 5 Defects Most Found by Cameras
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
        Top 5 Defects Most Found by Cameras
      </h2>
      <div className="h-[240px] sm:h-[280px] md:h-[320px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}