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

export default function CameraBox({ items, loading = false }: Props) {

  return (
    <div className="grid md:grid-cols-2 gap-3 text-sm font-medium">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isOdd = items.length % 2 !== 0;
        const isFullWidth = isLast && isOdd;

        return (
          <div
            key={idx}
            className={`bg-white border-l-8 p-2 rounded shadow transition
          ${loading
                ? "border-gray-300"
                : item.status === "OK"
                  ? "border-green-500"
                  : "border-[#FF5050]"}
          ${isFullWidth ? "md:col-span-2" : ""}
        `}
          >
            <div className="text-md text-gray-600 font-semibold px-1 py-2">{item.title}</div>

            <div
              className={`text-3xl font-bold px-1 py-2 h-[42px] ${loading ? "animate-pulse bg-gray-300 text-transparent rounded " : ""
                }`}
            >
              {!loading && item.value}
            </div>

            <div className="text-gray-800 text-xl px-1 py-1">
              <span className="text-gray-600">
                Expected:{" "}
              </span>
              <span
                className={`${loading
                    ? "animate-pulse bg-gray-300 text-transparent inline-block w-20 h-8 rounded"
                    : "h-20"
                  }`}
              >
                {!loading && item.expected}
              </span>
              <span className="text-gray-600">
                 {" "} | Confident:{" "}
              </span>
              <span
                className={`${loading
                    ? "animate-pulse bg-gray-300 text-transparent inline-block w-12 h-5 rounded"
                    : ""
                  }`}
              >
                {!loading && item.confident}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

}