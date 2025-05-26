import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { generateBlueColor } from "@/app/utils/color"

const data = [
  { name: "Good", value: 900 },
  { name: "Not Good", value: 100 },
];

const colors = ['#60a5fa', '#1d4ed8'];

export default function GoodNgDonut() {
  return (
    <div className="bg-white p-2 rounded shadow w-full">
      <h2 className="text-xl font-semibold text-center mb-2 mt-2">
        Good / NG Ratio
      </h2>
      <div className="w-full h-[170px]">
        <ResponsiveContainer width="100%" height="100%">
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
                bottom: 12,
                fontSize: '0.8rem' 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
