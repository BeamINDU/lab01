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


  const getProductCategoryName = (key: string): string => {
    const categoryMap: Record<string, string> = {
      'A': 'Beverages',
      'B': 'Food & Snacks', 
      'C': 'Personal Care',
      'D': 'Pharmaceuticals'
    };
    return categoryMap[key] || `Product ${key}`;
  };


  const getActiveCategories = () => {
    if (!chartData || chartData.length === 0) return ['A', 'B', 'C', 'D'];
    
    const categories = ['A', 'B', 'C', 'D'];
    return categories.filter(cat => 
      chartData.some(item => item[cat] && item[cat] > 0)
    );
  };

  const activeCategories = getActiveCategories();

  return (
    <div className="p-3 md:p-6 bg-white rounded-xl shadow w-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-3 md:mb-6">
        Distribution of NG Found per Hour by Product Category
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ 
              top: 0, 
              right: 10, 
              left: 10, 
              bottom: 40 
            }}
            barCategoryGap="20%"
            barSize={16}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{
                value: "Time",
                position: "insideBottom",
                offset: -10,
                style: { fill: "#555", fontSize: 10 },
              }}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              label={{
                value: "NG Product Quantity",
                angle: -90,
                offset: 5,
                style: { fill: "#555", fontSize: 10 },
              }}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              formatter={(value, name) => [value, getProductCategoryName(name as string)]}
              labelStyle={{ fontSize: '10px' }}
              contentStyle={{ fontSize: '10px' }}
            />
            <Legend
              verticalAlign="top"
              wrapperStyle={{
                position: "absolute",
                bottom: -20,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: '0.625rem'
              }}
              iconType="circle" 
              height={30}
              formatter={(value) => getProductCategoryName(value)}
            />
            

            {activeCategories.includes('A') && (
              <Bar dataKey="A" stackId="a" fill="#bae6fd" name="A" />
            )}
            {activeCategories.includes('B') && (
              <Bar dataKey="B" stackId="a" fill="#60a5fa" name="B" />
            )}
            {activeCategories.includes('C') && (
              <Bar dataKey="C" stackId="a" fill="#3b82f6" name="C" />
            )}
            {activeCategories.includes('D') && (
              <Bar dataKey="D" stackId="a" fill="#1e3a8a" name="D" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
