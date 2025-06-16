"use client";

import { LiveInspectionView } from "@/app/types/live";

interface detectionInfo {
  title: string;
  value: string;
  expected: string;
  confident: number;
  status: "OK" | "NG" | string;
}

interface Props {
  items: detectionInfo[];
  loading?: boolean;
}

export default function CameraBox({  items, loading = false }: Props) {

   return (
    <div className="grid md:grid-cols-2 gap-4 text-sm font-medium">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`bg-white border-l-8 p-2 rounded shadow transition
            ${loading
              ? "border-gray-300"
              : item.status === "OK"
                ? "border-green-500"
                : "border-red-500"}
          `}
        >
          <div className="text-lg font-semibold px-1 py-1">{item.title}</div>

          <div
            className={`text-3xl font-bold px-1 ${
              loading ? "animate-pulse bg-gray-300 text-transparent rounded h-[36px]" : ""
            }`}
          >
            {!loading && item.value}
          </div>

          <div className="text-gray-800 text-lg px-1 py-1">
            Expected:{" "}
            <span className={`${loading ? "animate-pulse bg-gray-300 text-transparent inline-block w-20 h-5 rounded" : ""}`}>
              {!loading && item.expected}
            </span>{" "}
            | Confident:{" "}
            <span className={`${loading ? "animate-pulse bg-gray-300 text-transparent inline-block w-12 h-5 rounded" : ""}`}>
              {!loading && item.confident}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );

}