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

const getCameraColor = (cameraIndex: number): string => {
  const colorPalette = [
    'rgba(59, 130, 246, 0.8)',   
    'rgba(34, 197, 94, 0.8)',     
    'rgba(239, 68, 68, 0.8)',    
    'rgba(245, 158, 11, 0.8)',    
    'rgba(168, 85, 247, 0.8)',  
    'rgba(236, 72, 153, 0.8)',    
    'rgba(20, 184, 166, 0.8)',   
    'rgba(156, 163, 175, 0.8)',  
  ];
  return colorPalette[cameraIndex % colorPalette.length];
};

// เพิ่มฟังก์ชันเพื่อกำหนดสีให้ Defect Type แทน
const getDefectTypeColor = (defectType: string): string => {
  // คุณสามารถสร้างสีที่แตกต่างกันสำหรับแต่ละ defectType ได้ที่นี่
  // หรือใช้ hash function เพื่อสร้างสีจาก string
  const colors = {
    'Scratch': 'rgba(59, 130, 246, 0.8)',
    'Dent': 'rgba(34, 197, 94, 0.8)',
    'Discoloration': 'rgba(239, 68, 68, 0.8)',
    'Crack': 'rgba(245, 158, 11, 0.8)',
    'Bubble': 'rgba(168, 85, 247, 0.8)',
    'Unknown': 'rgba(156, 163, 175, 0.8)',
  };
  return colors[defectType] || getCameraColor(defectType.length);
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

 
    const datasets = defectTypes.map((defectType, index) => {
      const defectData = filteredData.filter(item => item.defecttype === defectType);

      const cameraDefectTotals = groupBy(defectData, item => item.cameraname || item.cameraid || 'Unknown Camera');

      const dataValues = topCameras.map(cameraName =>
        sumBy(cameraDefectTotals[cameraName] || [], 'totalng')
      );

      return {
        label: defectType, 
        data: dataValues,
        backgroundColor: getDefectTypeColor(defectType), // ใช้สีตาม Defect Type
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

  // Max value สำหรับแกน X (ในกรณีที่ไม่ได้ Stacked)
  const maxAxisValue = useMemo(() => {
    if (!chartData.datasets.length) return 0;
    // หาค่าสูงสุดของข้อมูลทั้งหมดในแต่ละ dataset
    return Math.max(...chartData.datasets.flatMap(dataset => dataset.data as number[]));
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
          title: (context: any) => `Camera: ${context[0].label}`,
          label: (context: any) => {
            try {
              const defectType = context.dataset.label;
              const count = context.parsed?.x || 0;
              return `${defectType}: ${count} defects`;
            } catch {
              return 'Invalid data';
            }
          },
          afterBody: (context: any) => {
            const cameraName = context[0].label;
            const totalDefectsForCamera = sumBy(data, item =>
                ((item.cameraname || item.cameraid) === cameraName) ? item.totalng : 0
            );
            return [``, `Total Defects for ${cameraName}: ${totalDefectsForCamera}`];
          }
        }
      },
      datalabels: {
        display: true,
        anchor: 'end', 
        align: 'end',  
        offset: 4,     
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
        beginAtZero: true,
        stacked: false, // ยังคงเป็น false สำหรับ grouped bar chart
        max: Math.ceil(maxAxisValue * 1.2), // ใช้ maxAxisValue
        title: {
          display: true,
          text: 'Quantity',
          font: { size: 11, weight: 'bold' as const }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: { size: 10 },
          callback: function(value: any) {
            return value;
          }
        }
      },
      y: {
        stacked: false, // ยังคงเป็น false สำหรับ grouped bar chart
        title: {
          display: true,
          text: 'Camera ID / Camera Name', // เปลี่ยน title ของแกน Y
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
     <div className="bg-white rounded-xl shadow p-3 md:p-4 h-[345px]">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Defects by Camera (Top 5 Cameras)
      </h2>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <div className="h-[240px] sm:h-[250px] md:h-[290px]">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
});

DefectByCameraChart.displayName = 'DefectByCameraChart';

export default DefectByCameraChart;