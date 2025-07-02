"use client";

type SummaryBoxProps = {
  label: string;
  value: string | number;
  loading: boolean;
};

export default function SummaryBox({ label, value, loading }: SummaryBoxProps) {
  return (
    <div className="bg-gray-200 p-6 text-center rounded">
      <div className="text-5xl font-bold">
        {loading ? (
          <span className="inline-block w-24 h-7 bg-gray-300 animate-pulse rounded text-transparent"></span>
        ) : (
          value
        )}
      </div>
      <div className="text-gray-600 text-lg mt-0">{label}</div>
    </div>
  );
}