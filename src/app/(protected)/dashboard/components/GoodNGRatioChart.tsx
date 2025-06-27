'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { GoodNGRatioData } from '@/app/types/dashboard';

interface GoodNGRatioChartProps {
  data: GoodNGRatioData[] | null;
  loading?: boolean;
  error?: string;
}

const COLORS = ['#60a5fa', '#ef4444']

const getColorForData = (chartData: any[]) => {
  if (chartData.length === 1 && chartData[0].name === "No Data") {
    return ['#9ca3af']; 
  }
  return COLORS;
};

const GoodNGRatioChart = React.memo<GoodNGRatioChartProps>(({ data, loading, error }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { name: "No Data", value: 0 }
      ];
    }

    const totalOk = data.reduce((sum, item) => sum + (item.total_ok || 0), 0);
    const totalNg = data.reduce((sum, item) => sum + (item.total_ng || 0), 0);

    if (totalOk === 0 && totalNg === 0) {
      return [{ name: "No Data", value: 0 }];
    }

    return [
      { name: "Good", value: totalOk },
      { name: "Not Good", value: totalNg },
    ];
  }, [data]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // กำหนดสีตาม chartData
  const colors = getColorForData(chartData);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: any) => {
    if (value === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; 
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const color = name === 'Good' ? '#1e40af' : '#dc2626';

    return (
      <text 
        x={x} 
        y={y} 
        fill={color}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}  
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0.0';
      return (
        <div className="bg-black bg-opacity-80 text-white p-2 rounded text-xs">
          <p className="font-medium">{data.name}</p>
          <p>Count: {data.value.toLocaleString()}</p>
          <p>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const LoadingState = () => (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorState = () => (
    <div className="h-full flex items-center justify-center">
      <p className="text-red-500 text-center text-sm">{error}</p>
    </div>
  );

  console.log('Chart Data:', chartData, 'Total:', total);

  return (
    <div className="p-3 md:p-4 bg-white rounded-xl shadow w-full h-[220px]"> 
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-1"> 
        Good / NG Ratio
      </h2>
      
      <div className="h-[150px] relative"> 
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false} 
                label={renderCustomizedLabel}
                outerRadius={40} 
                innerRadius={20} 
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    stroke="#ffffff"
                    strokeWidth={2} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ 
                bottom: -4, 
                fontSize: '0.6rem',
                lineHeight: '1.2'
              }}
              iconSize={10}        
              layout="horizontal"  
              align="center"      
            />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
});

GoodNGRatioChart.displayName = 'GoodNGRatioChart';

export default GoodNGRatioChart;