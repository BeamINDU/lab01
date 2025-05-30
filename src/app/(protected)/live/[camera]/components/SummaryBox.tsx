"use client";

type SummaryBoxProps = {
  label: string;
  value: string | number;
  loading: boolean;
};

export default function SummaryBox({ label, value, loading }: SummaryBoxProps) {
  return (
    <div className="bg-gray-200 p-9 text-center rounded">
      <div className={`text-5xl font-semibold ${loading ? "animate-pulse bg-gray-300 text-transparent rounded h-20" : ""}`}>
        {value}
      </div>
      <div className="text-lg mt-2">{label}</div>
    </div>
  );
}
