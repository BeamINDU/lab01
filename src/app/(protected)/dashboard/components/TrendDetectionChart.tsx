import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardData } from '@/app/types/dashboard';

interface TrendDetectionChartProps {
  data: DashboardData | null;
}

export default function TrendDetectionChart({ data }: TrendDetectionChartProps) {
  const chartData = data?.trendData || [
    { time: '9:00', MissingPart: 1, Misalignment: 2, Dent: 1, Crack: 0, Scratch: 1 },
    { time: '12:00', MissingPart: 1, Misalignment: 1, Dent: 2, Crack: 1, Scratch: 0 },
    { time: '15:00', MissingPart: 2, Misalignment: 1, Dent: 1, Crack: 2, Scratch: 1 },
    { time: '18:00', MissingPart: 1, Misalignment: 2, Dent: 0, Crack: 3, Scratch: 2 },
    { time: '21:00', MissingPart: 1, Misalignment: 3, Dent: 1, Crack: 1, Scratch: 3 }
  ];

  return (
    <div className="bg-white p-3 md:p-4 rounded shadow w-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Trend of Top 5 Detection Types
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ 
              top: 5, 
              right: 10, 
              left: 10, 
              bottom: 20 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <YAxis 
              label={{ 
                value: 'Quantity', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '10px' }
              }}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ fontSize: '10px' }}
              labelStyle={{ fontSize: '10px' }}
            />
            <Legend 
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ 
                fontSize: '0.625rem',
                paddingTop: '5px'
              }}
            />
            <Line type="monotone" dataKey="MissingPart" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Misalignment" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Dent" stroke="#ffc658" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Crack" stroke="#ff7300" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="Scratch" stroke="#00c49f" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
