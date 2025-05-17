import { useEffect, useState } from 'react';
import { CalendarIcon } from "lucide-react";

export default function HeaderFilters() {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
      {/* LEFT SECTION */}
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-3xl font-bold mr-4">Dashboard</h1>

        <select className="bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1">
          <option>Product</option>
          <option>Product A</option>
          <option>Product B</option>
        </select>

        <select className="bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1">
          <option>Camera</option>
          <option>CAM A1</option>
          <option>CAM A2</option>
        </select>

        <select className="bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1">
          <option>Line</option>
          <option>Line 1</option>
          <option>Line 2</option>
        </select>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <input
          type="text"
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
          className="border border-gray-300 rounded px-2 py-1 w-[180px] text-xs mt-1"
        />

        <button className="flex items-center bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1">
          <CalendarIcon className="w-3 h-3 mr-1" />
          Month
        </button>

        <button className="flex items-center bg-violet-600 text-white px-2 py-1 rounded text-xs mt-1">
          <CalendarIcon className="w-3 h-3 mr-1" />
          Year
        </button>
      </div>
    </div>
  );
}
