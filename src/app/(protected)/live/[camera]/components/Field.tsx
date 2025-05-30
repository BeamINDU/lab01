"use client";

type FieldProps = {
  label: string;
  value: string;
  loading: boolean;
};

export default function Field({ label, value, loading }: FieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <b>{label}</b>
      <span>:</span>
      <span
        className={
          loading
            ? "w-48 h-7 bg-gray-300 animate-pulse rounded"
            : ""
        }
      >
        {loading ? "\u00A0" : value}
      </span>
    </div>
  );
}
