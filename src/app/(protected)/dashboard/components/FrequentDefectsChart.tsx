import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DashboardData } from '@/app/types/dashboard';

interface FrequentDefectsChartProps {
  data: DashboardData | null;
}

export default function FrequentDefectsChart({ data }: FrequentDefectsChartProps) {
  const chartData = data?.defectsByType || [
    { type: 'Label Misalignment', Line1: 4, Line2: 1, Line3: 3 },
    { type: 'Surface Scratch', Line1: 4, Line2: 3, Line3: 2 },
    { type: 'Package Dent', Line1: 2, Line2: 2, Line3: 2 },
    { type: 'Missing Component', Line1: 3, Line2: 3, Line3: 1 },
    { type: 'Color Variance', Line1: 2, Line2: 2, Line3: 1 },
  ];


  const getAvailableLines = () => {
    if (!chartData || chartData.length === 0) return [];
    
    const firstItem = chartData[0];
    const lines = Object.keys(firstItem).filter(key => 
      key !== 'type' && 
      typeof firstItem[key] === 'number' && 
      firstItem[key] > 0
    );
    
    return lines;
  };

  const availableLines = getAvailableLines();


  const getBarColor = (lineKey: string, index: number) => {
    const colors = ['#1e3a8a', '#60a5fa', '#bae6fd', '#e0f2fe', '#f0f9ff'];
    return colors[index] || '#94a3b8';
  };

  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Top 5 Most Frequent Defect Types
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ 
              top: 5, 
              right: 10, 
              left: 40, 
              bottom: 5 
            }}
            barCategoryGap={20}
            barSize={16}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis 
              dataKey="type" 
              type="category" 
              tick={{ fontSize: 9 }}
              width={80}
            />
            <Tooltip 
              formatter={(value, name) => [value, name]}
              labelStyle={{ fontSize: '10px' }}
              contentStyle={{ fontSize: '10px' }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: '0.625rem', paddingTop: '5px' }}
            />

            {availableLines.map((lineKey, index) => (
              <Bar 
                key={lineKey}
                dataKey={lineKey} 
                fill={getBarColor(lineKey, index)}
                name={lineKey.includes('Line') ? lineKey : `${lineKey}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}