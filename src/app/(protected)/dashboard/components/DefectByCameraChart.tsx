'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { groupBy, sumBy, orderBy } from 'lodash';
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


const getDefectTypeColor = (defectType: string): string => {
  const colorPalette: Record<string, string> = {
    'Crack': 'rgba(239, 68, 68, 0.8)',
    'Scratch': 'rgba(59, 130, 246, 0.8)',
    'Dent': 'rgba(34, 197, 94, 0.8)',
    'Missing': 'rgba(245, 158, 11, 0.8)',
    'Missing Part': 'rgba(245, 158, 11, 0.8)',
    'Broken': 'rgba(168, 85, 247, 0.8)',
    'Dirty': 'rgba(236, 72, 153, 0.8)',
    'Deform': 'rgba(20, 184, 166, 0.8)',
    'Misalignment': 'rgba(156, 163, 175, 0.8)',
  };
  return colorPalette[defectType] || 'rgba(156, 163, 175, 0.8)';
};

const DefectByCameraChart = React.memo<DefectByCameraChartProps>(({ data, loading, error }) => {
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


    const validData = data.filter(item => 
      (item.cameraname || item.cameraid) && item.defecttype
    );


    const cameraTotals = Object.entries(groupBy(validData, item => 
      item.cameraname || item.cameraid || 'Unknown Camera'
    )).map(([cameraName, items]) => ({
      cameraName,
      total: sumBy(items, 'totalng')
    }));

    const topCameras = orderBy(cameraTotals, 'total', 'desc')
      .slice(0, 5)
      .map(item => item.cameraName);


    const filteredData = validData.filter(item => {
      const cameraName = item.cameraname || item.cameraid || 'Unknown Camera';
      return topCameras.includes(cameraName);
    });


    const defectTypes = [...new Set(filteredData.map(item => item.defecttype))].sort();


    const datasets = defectTypes.map(defectType => {
      const defectData = filteredData.filter(item => item.defecttype === defectType);
      const cameraDefectData = groupBy(defectData, item => 
        item.cameraname || item.cameraid || 'Unknown Camera'
      );

      const dataValues = topCameras.map(cameraName => 
        sumBy(cameraDefectData[cameraName] || [], 'totalng')
      );

      return {
        label: defectType,
        data: dataValues,
        backgroundColor: getDefectTypeColor(defectType),
        borderColor: getDefectTypeColor(defectType).replace('0.8', '1'),
        borderWidth: 1,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 4,
          bottomRight: 4,
        },
        borderSkipped: false,
        hoverBackgroundColor: getDefectTypeColor(defectType).replace('0.8', '0.95'),
        hoverBorderColor: getDefectTypeColor(defectType).replace('0.8', '1'),
        hoverBorderWidth: 2,
      };
    });

    return { labels: topCameras, datasets };
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
      padding: { right: 50, left: 10, top: 10, bottom: 10 }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 10 },
          padding: 10,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          title: (context: any) => `Camera: ${context[0].label}`,
          label: (context: any) => {
            try {
              const defectType = context.dataset.label;
              const count = context.parsed?.x || 0;
              const emoji = defectType === 'Crack' ? '🔴' : 
                           defectType === 'Scratch' ? '🔵' : 
                           defectType === 'Dent' ? '🟢' : 
                           defectType === 'Missing' || defectType === 'Missing Part' ? '🟡' : 
                           defectType === 'Broken' ? '🟣' : 
                           defectType === 'Dirty' ? '🌸' : 
                           defectType === 'Deform' ? '🟦' : '⚪';
              return `${emoji} ${defectType}: ${count} defects`;
            } catch {
              return 'Invalid data';
            }
          },
          afterBody: (context: any) => {
            try {
              const total = context.reduce((sum: number, item: any) => {
                const value = item?.parsed?.x;
                return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
              }, 0);
              return [``, `Total Defects: ${total}`];
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
        color: '#0000',
        font: { 
          size: 11 
        },
        formatter: (value: any) => {
          try {
            return (value && value > 0) ? value.toString() : '';
          } catch {
            return '';
          }
        },
        borderRadius: 3,
        padding: { 
          top: 2, 
          bottom: 2, 
          left: 3, 
          right: 3 
        },
        textStrokeColor: 'rgba(0, 0, 0, 0.8)',
        textStrokeWidth: 1,
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
          callback: function(value: any) {
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
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Top 5 Defects Most Found by Cameras
      </h2>
      
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="h-[240px] sm:h-[280px] md:h-[340px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
});

DefectByCameraChart.displayName = 'DefectByCameraChart';

export default DefectByCameraChart;