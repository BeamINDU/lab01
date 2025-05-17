import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { camera: 'CAM A1', defects: 45 },
  { camera: 'CAM A2', defects: 80 },
  { camera: 'CAM B1', defects: 60 },
  { camera: 'CAM B2', defects: 70 },
];

const colors = ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'];

export default function DefectByCameraChart() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h2 className="text-lg font-semibold text-center mb-4">
        Defects by Camera
      </h2>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="camera" type="category" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: '11px' }} />
            <Bar 
              
              dataKey="defects" 
              barSize={25}>
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
