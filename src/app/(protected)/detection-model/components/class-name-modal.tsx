import React, { useState } from "react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { X, Save, Trash2 } from 'lucide-react';
import { ClassName } from "@/app/types/class-name";

interface ClassNameModalProps {
  onClose: () => void;
  onSave: (className: ClassName[]) => void;
  data: ClassName[]
}

export default function ClassNameModal({ onClose, onSave, data }: ClassNameModalProps) {
  const [className, setClassName] = useState<ClassName[]>(data);

  const handleChange = (index: number, value: string) => {
    const newLabels = [...className];
    newLabels[index] = { ...newLabels[index], name: value };
    setClassName(newLabels);
  };

  const handleNew = () => {
    const newLabel: ClassName = {
      id: crypto.randomUUID(),
      name: '',
      checked: false,
    };
    setClassName([...className, newLabel]);
  };

  const handleDelete = async (index: number) => {
    const result = await showConfirm('Are you sure you want to delete this class name?')
    if (result.isConfirmed) {
      const newLabels = className.filter((_, i) => i !== index);
      setClassName(newLabels);
    }
  };

  const handleSave = () => {
    onSave(className);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-2 w-80 shadow-lg">
        <div className="relative mb-1">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            <X className="text-red-500" size={20} />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center">Class Name</h2>

        <div className="mt-4 p-4 space-y-2 mb-4 max-h-[40vh] overflow-y-auto">
          {className?.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={item.name}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Label ${index + 1}`}
                className="flex-1 px-3 py-2 rounded bg-blue-50 border border-blue-100 text-sm"
              />
              {/* <button
                onClick={() => handleDeleteClass(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button> */}
              <Trash2 size={16} onClick={() => handleDelete(index)} className="text-red-500 cursor-pointer" />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={handleNew}
              className="text-blue-600 text-sm hover:underline"
            >
              New Label +
            </button>
          </div>
        </div>

        <div className="p-3 flex justify-end mt-4 gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2 text-sm"
          >
            Save <Save size={16} />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary rounded flex items-center gap-2 text-sm"
          >
            Close
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

