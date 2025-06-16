'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Planning } from "@/app/types/planning";
import DataTable from "@/app/components/table/DataTable";
import PlansColumns from "./plans-columns"

interface PlanningConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onStop: () => void;
  plans: Planning[];
}

export default function PlanningConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  onStop,
  plans,
}: PlanningConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col bg-white rounded-xl w-full max-w-6xl h-[68%] p-4 shadow-xl overflow-hidden">

        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X className="text-red-500" size={24} />
        </button>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-2">
          Planning Confirmation
        </h2>

        {/* Table content with scrollable area */}
        <div className="flex-1 overflow-auto p-4">
          <DataTable
            columns={PlansColumns()}
            data={plans}
            defaultSorting={[{ id: "productId", desc: false }]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 p-2 text-md">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Confirm plan
          </button>
          <button
            onClick={onStop}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop plan
          </button>
          <button
            onClick={onClose}
            className="w-24 bg-secondary rounded px-4 py-2 "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

