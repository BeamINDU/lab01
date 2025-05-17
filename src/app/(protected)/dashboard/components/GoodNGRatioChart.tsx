import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Good", value: 900 },
  { name: "Not Good", value: 100 },
];

const colors = ['#60a5fa', '#1d4ed8'];

export default function GoodNgDonut() {
  return (
    <div className="p-4 bg-white rounded-xl shadow max-w-xs mx-auto">
      <h2 className="text-base font-semibold text-center mb-2">
        Good / NG Ratio
      </h2>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            dataKey="value"
            label={({ value, percent }) =>
              `${value}, ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ 
              bottom: -5,
              fontSize: '0.75rem' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
