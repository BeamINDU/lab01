import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardData } from '@/app/types/dashboard';

interface GoodNGRatioChartProps {
  data: DashboardData | null;
}

const colors = ['#60a5fa', '#ef4444'];

export default function GoodNGRatioChart({ data }: GoodNGRatioChartProps) {
  const chartData = data ? [
    { name: "Good", value: data.goodCount },
    { name: "Not Good", value: data.ngCount },
  ] : [
    { name: "Good", value: 900 },
    { name: "Not Good", value: 100 },
  ];

  return (
    <div className="p-3 md:p-4 bg-white rounded-xl shadow w-full min-h-[200px] md:min-h-[220px]">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-1"> 
        Good / NG Ratio
      </h2>
      <div className="h-[140px] md:h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              labelLine={true}
              fontSize={15}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value.toLocaleString(), '']}
              contentStyle={{ fontSize: '11px' }}
            />
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