import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import { generateBlueColor } from "@/app/utils/color"

const data = [
  { type: 'Missing Part', Line1: 4, Line2: 1, Line3: 3 },
  { type: 'Misalignment', Line1: 4, Line2: 3, Line3: 2 },
  { type: 'Dent', Line1: 2, Line2: 2, Line3: 2 },
  { type: 'Crack', Line1: 3, Line2: 3, Line3: 1 },
  { type: 'Scratch', Line1: 2, Line2: 2, Line3: 1 },
];

export default function FrequentDefectsChart() {
  const keys = Object.keys(data[0]).filter(key => key !== 'type');

  return (
    <div className="bg-white rounded-xl shadow p-4 h-full">
      <h2 className="text-xl font-semibold text-center mb-4">
        Top 5 Most Frequent Defect Types
      </h2>
      <div style={{ height: 270 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
            barCategoryGap={24}
            barSize={25}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: '11px' }}  />
            <YAxis dataKey="type" type="category" tick={{ fontSize: '11px' }} />
            <Tooltip contentStyle={{ fontSize: '11px' }} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: '0.75rem' }}
            />
            {keys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={generateBlueColor(index, keys.length)}
                name={`Line ${key.replace('Line', '')}`}
              >
                <LabelList dataKey={key} position="right" style={{ fontSize: '11px' }} />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
