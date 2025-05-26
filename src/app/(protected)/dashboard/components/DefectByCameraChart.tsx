import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { DashboardData } from '@/app/types/dashboard';

interface DefectByCameraChartProps {
  data: DashboardData | null;
}

const colors = ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'];

export default function DefectByCameraChart({ data }: DefectByCameraChartProps) {
  const chartData = data?.defectsByCamera || [
    { camera: 'CAM A1', defects: 45 },
    { camera: 'CAM A2', defects: 80 },
    { camera: 'CAM B1', defects: 60 },
    { camera: 'CAM B2', defects: 70 },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h2 className="text-xl font-semibold text-center mb-4">
        Defects by Camera
      </h2>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="camera" type="category" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: '11px' }} />
            <Bar dataKey="defects" barSize={25}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}