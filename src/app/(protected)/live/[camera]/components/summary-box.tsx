"use client";

type SummaryBoxProps = {
  label: string;
  value: string | number;
  loading: boolean;
};

export default function SummaryBox({ label, value, loading }: SummaryBoxProps) {
  return (
    <div className="bg-gray-200 p-4 text-center rounded">
      <div className="text-4xl font-bold">
        {loading ? (
          <span className="inline-block w-24 h-9 bg-gray-300 animate-pulse rounded text-transparent"></span>
        ) : (
          value
        )}
      </div>
      <div className="text-lg mt-2">{label}</div>
    </div>
  );
}