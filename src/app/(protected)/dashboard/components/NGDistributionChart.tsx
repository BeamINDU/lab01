import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { DashboardData } from '@/app/types/dashboard';

interface NGDistributionChartProps {
  data: DashboardData | null;
}

export default function NGDistributionChart({ data }: NGDistributionChartProps) {
  const chartData = data?.ngDistribution || [
    { time: "9:00", A: 2, B: 1, C: 2, D: 1 },
    { time: "12:00", A: 2, B: 3, C: 2, D: 3 },
    { time: "15:00", A: 3, B: 1, C: 3, D: 3 },
    { time: "18:00", A: 1, B: 1, C: 1, D: 2 },
    { time: "21:00", A: 4, B: 2, C: 3, D: 3 },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-6">
        Distribution of NG Found per Hour by Product
      </h2>
      <div style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 0, right: 20, left: 20, bottom: 40 }}
            barCategoryGap="20%"
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -10,
                style: { fill: "#555",fontSize: 12 },
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: "NG Product Quantity",
                angle: -90,
                offset: 5,
                style: { fill: "#555", fontSize: 12  },
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend
              verticalAlign="top"
              wrapperStyle={{
                position: "absolute",
                bottom: -20,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: '0.75rem'
              }}
              iconType="circle" 
              height={40}
            />
            <Bar dataKey="A" stackId="a" fill="#bae6fd" name="Product A" />
            <Bar dataKey="B" stackId="a" fill="#60a5fa" name="Product B" />
            <Bar dataKey="C" stackId="a" fill="#3b82f6" name="Product C" />
            <Bar dataKey="D" stackId="a" fill="#1e3a8a" name="Product D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}