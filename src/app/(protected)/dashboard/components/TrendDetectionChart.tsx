import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
      <LineChart data={data} width={460} height={270}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: 'Quantity', angle: -90 }} />
        <Tooltip />
        <Legend 
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{ fontSize: '0.875rem' }}
        />
        <Line type="monotone" dataKey="MissingPart" stroke="#8884d8" />
        <Line type="monotone" dataKey="Misalignment" stroke="#82ca9d" />
        <Line type="monotone" dataKey="Dent" stroke="#ffc658" />
        <Line type="monotone" dataKey="Crack" stroke="#ff7300" />
        <Line type="monotone" dataKey="Scratch" stroke="#00c49f" />
      </LineChart>
    </div>
  );
}

