import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardData } from '@/app/types/dashboard';

interface GoodNGRatioChartProps {
  data: DashboardData | null;
}

const colors = ['#60a5fa', '#1d4ed8'];

export default function GoodNGRatioChart({ data }: GoodNGRatioChartProps) {
  const chartData = data ? [
    { name: "Good", value: data.goodCount },
    { name: "Not Good", value: data.ngCount },
  ] : [
    { name: "Good", value: 900 },
    { name: "Not Good", value: 100 },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-xs mx-auto">
      <h2 className="text-xl font-semibold text-center mb-1"> 
        Good / NG Ratio
      </h2>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            dataKey="value"
            label={({ value, percent }) =>
              `${value}, ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ 
              bottom: -5,
              fontSize: '0.75rem' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}