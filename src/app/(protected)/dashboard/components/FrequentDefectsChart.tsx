import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DashboardData } from '@/app/types/dashboard';

interface FrequentDefectsChartProps {
  data: DashboardData | null;
}

export default function FrequentDefectsChart({ data }: FrequentDefectsChartProps) {
  const chartData = data?.defectsByType || [
    { type: 'Missing Part', Line1: 4, Line2: 1, Line3: 3 },
    { type: 'Misalignment', Line1: 4, Line2: 3, Line3: 2 },
    { type: 'Dent', Line1: 2, Line2: 2, Line3: 2 },
    { type: 'Crack', Line1: 3, Line2: 3, Line3: 1 },
    { type: 'Scratch', Line1: 2, Line2: 2, Line3: 1 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h2 className="text-xl font-semibold text-center mb-4">
        Top 5 Most Frequent Defect Types
      </h2>
      <div style={{ height: 270 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            barCategoryGap={24}
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="type" type="category" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: '0.75rem' }}
            />
            <Bar dataKey="Line3" fill="#bae6fd" name="Line 3" />
            <Bar dataKey="Line2" fill="#60a5fa" name="Line 2" />
            <Bar dataKey="Line1" fill="#1e3a8a" name="Line 1" /> 
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}