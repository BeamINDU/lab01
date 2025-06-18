// src/app/(protected)/dashboard/components/GoodNGRatioChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardData } from '@/app/types/dashboard';
import { useMemo } from 'react';

interface GoodNGRatioChartProps {
  data: DashboardData | null;
}

const colors = ['#60a5fa', '#ef4444'];

export default function GoodNGRatioChart({ data }: GoodNGRatioChartProps) {

  const chartData = useMemo(() => {
    if (data) {
      return [
        { name: "Good", value: data.goodCount },
        { name: "Not Good", value: data.ngCount },
      ];
    }
    // Default fallback data
    return [
      { name: "Good", value: 900 },
      { name: "Not Good", value: 100 },
    ];
  }, [data]);

  const chartKey = useMemo(() => {
    return `pie-chart-${data?.goodCount || 0}-${data?.ngCount || 0}-${Date.now()}`;
  }, [data?.goodCount, data?.ngCount]);

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


    </div>
  );
}