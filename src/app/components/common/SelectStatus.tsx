import React from 'react';
import { optionsStatus } from '@/app/lib/constants/status';

type SelectStatusProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SelectStatus({ value, onChange }: SelectStatusProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        {optionsStatus.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// import SelectStatus from './SelectStatus';
// <SelectStatus value={status} onChange={setStatus} />


// import { Controller, useForm } from 'react-hook-form';
// import { optionsStatus } from './your-options-file-path';

// <Controller
//   name="status"
//   control={control}
//   defaultValue="1"
//   render={({ field }) => (
//     <div className="w-full">
//       <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//       <select
//         {...field}
//         className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
//       >
//         {optionsStatus.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   )}
// />
