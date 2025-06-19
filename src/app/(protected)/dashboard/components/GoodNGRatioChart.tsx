// src/app/(protected)/dashboard/components/GoodNGRatioChart.tsx
'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { GoodNGRatioData } from '@/app/types/dashboard';

interface GoodNGRatioChartProps {
  data: GoodNGRatioData[] | null;
  loading?: boolean;
  error?: string;
}

const colors = ['#60a5fa', '#ef4444'];

export default function GoodNGRatioChart({ data, loading, error }: GoodNGRatioChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Default fallback data
      return [
        { name: "Good", value: 900 },
        { name: "Not Good", value: 100 },
      ];
    }

    // Aggregate total_ok และ total_ng จากทุก LOT
    const totalOk = data.reduce((sum, item) => sum + (item.total_ok || 0), 0);
    const totalNg = data.reduce((sum, item) => sum + (item.total_ng || 0), 0);

    return [
      { name: "Good", value: totalOk },
      { name: "Not Good", value: totalNg },
    ];
  }, [data]);

  const chartKey = useMemo(() => {
    return `pie-chart-${chartData[0].value}-${chartData[1].value}-${Date.now()}`;
  }, [chartData]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const goodPercentage = total > 0 ? ((chartData[0].value / total) * 100).toFixed(1) : '0.0';
  const ngPercentage = total > 0 ? ((chartData[1].value / total) * 100).toFixed(1) : '0.0';

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    
    const isSmall = percent < 0.1;
    const radius = outerRadius + (isSmall ? 25 : 15);
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
        fontSize={isSmall ? 10 : 11}
        fontWeight="bold"
        style={{ 
          textShadow: '1px 1px 2px rgba(255,255,255,0.9)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
        }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip
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

  if (loading) {
    return (
      <div className="p-3 md:p-4 bg-white rounded-xl shadow w-full min-h-[200px] md:min-h-[220px]">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-1"> 
          Good / NG Ratio
        </h2>
        <div className="h-[160px] md:h-[170px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 md:p-4 bg-white rounded-xl shadow w-full min-h-[200px] md:min-h-[220px]">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-1"> 
          Good / NG Ratio
        </h2>
        <div className="h-[160px] md:h-[170px] flex items-center justify-center">
          <p className="text-red-500 text-center text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 bg-white rounded-xl shadow w-full min-h-[200px] md:min-h-[220px]">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-1"> 
        Good / NG Ratio
      </h2>
      
      <div className="h-[160px] md:h-[170px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={chartKey}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true} 
              label={renderCustomizedLabel}
              outerRadius={50} 
              innerRadius={22} 
              fill="#8884d8"
              dataKey="value"
              animationBegin={0} 
              animationDuration={800}
              minAngle={5} 
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}-${entry.value}`} 
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
                bottom: -5,
                fontSize: '0.625rem'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* แสดงข้อมูลสรุป */}
      {data && data.length > 0 && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          Total LOTs: {data.length} | Good: {chartData[0].value} | NG: {chartData[1].value}
        </div>
      )}
    </div>
  );
}