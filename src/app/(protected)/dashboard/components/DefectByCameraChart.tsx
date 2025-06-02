import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { DashboardData } from '@/app/types/dashboard';
import { generateBlueColor } from '@/app/utils/color';

interface DefectByCameraChartProps {
  data: DashboardData | null;
}

export default function DefectByCameraChart({ data }: DefectByCameraChartProps) {
  const chartData = data?.defectsByCamera || [
    { camera: 'Input Inspection', defects: 45 },
    { camera: 'Label Check', defects: 80 },
    { camera: 'Surface Check', defects: 60 },
    { camera: 'Barcode Verify', defects: 70 },
  ];


  const displayData = chartData.length > 0 ? chartData : [
    { camera: 'No Data', defects: 0 }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 h-full">
      <h2 className="text-lg md:text-xl font-semibold text-center mb-2 md:mb-4">
        Defects by Camera
      </h2>
      <div className="h-[200px] sm:h-[240px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={displayData} 
            layout="vertical"
            margin={{ 
              top: 5, 
              right: 10, 
              left: 80, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis 
              dataKey="camera" 
              type="category" 
              tick={{ fontSize: 9 }}
              width={80}
            />
            <Tooltip 
              contentStyle={{ fontSize: '10px' }}
              formatter={(value) => [`${value} defects`, 'Count']}
            />
            <Bar dataKey="defects" barSize={16}>
              {displayData.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={generateBlueColor(index, displayData.length)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      

      {chartData.length === 1 && (
        <div className="text-center text-xs text-gray-500 mt-2">
          Showing data for selected camera only
        </div>
      )}
    </div>
  );
}