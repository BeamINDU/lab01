import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { time: '9:00', MissingPart: 1, Misalignment: 2, Dent: 1, Crack: 0, Scratch: 1 },
  { time: '12:00', MissingPart: 1, Misalignment: 1, Dent: 2, Crack: 1, Scratch: 0 },
  { time: '15:00', MissingPart: 2, Misalignment: 1, Dent: 1, Crack: 2, Scratch: 1 },
  { time: '18:00', MissingPart: 1, Misalignment: 2, Dent: 0, Crack: 3, Scratch: 2 },
  { time: '21:00', MissingPart: 1, Misalignment: 3, Dent: 1, Crack: 1, Scratch: 3 }
];

export default function TrendDetectionChart() {
  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h2 className="text-xl font-semibold text-center mb-4">
        Trend of Top 5 Detection Types
      </h2>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis 
              label={{ 
                value: 'Quantity', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} 
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ 
                fontSize: '0.875rem',
                paddingTop: '10px'
              }} 
            />
            <Line type="monotone" dataKey="MissingPart" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="Misalignment" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="Dent" stroke="#ffc658" strokeWidth={2} />
            <Line type="monotone" dataKey="Crack" stroke="#ff7300" strokeWidth={2} />
            <Line type="monotone" dataKey="Scratch" stroke="#00c49f" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}