import React, { useState } from "react";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal';
import { X, Save, Trash2 } from 'lucide-react';
import { ClassName } from "@/app/types/class-name";
import { z } from "zod";

interface ClassNameModalProps {
  onClose: () => void;
  onSave: (className: ClassName[]) => void;
  data: ClassName[];
}

const classNameSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Class name is required"),
  checked: z.boolean(),
});

export default function ClassNameModal({ onClose, onSave, data }: ClassNameModalProps) {
  const [className, setClassName] = useState<ClassName[]>(data);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (index: number, value: string) => {
    const newLabels = [...className];
    newLabels[index] = { ...newLabels[index], name: value };
    setClassName(newLabels);

    // Clear error when typing
    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);
  };

  const handleNew = () => {
    const newLabel: ClassName = {
      id: '',
      name: '',
      checked: false,
    };
    setClassName([...className, newLabel]);
    setErrors([...errors, '']);
  };

  const handleDelete = async (index: number) => {
    const result = await showConfirm('Are you sure you want to delete this class name?');
    if (result.isConfirmed) {
      const newLabels = className.filter((_, i) => i !== index);
      const newErrors = errors.filter((_, i) => i !== index);
      setClassName(newLabels);
      setErrors(newErrors);
    }
  };

  const handleSave = () => {
    const newErrors: string[] = [];
    let hasError = false;

    className.forEach((item, index) => {
      try {
        classNameSchema.parse(item);
        newErrors[index] = '';
      } catch (error) {
        if (error instanceof z.ZodError) {
          const message = error.errors[0]?.message || 'Invalid input';
          newErrors[index] = message;
          hasError = true;
        }
      }
    });

    if (hasError) {
      setErrors(newErrors);
      // showError('Please fix validation errors before saving.');
      return;
    }

    setErrors([]);
    onSave(className);
    showSuccess("Class names saved successfully");
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
          {className.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                {/* ไม่ต้องใช้ register */}
                <input
                  value={item.name}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder={`Label ${index + 1}`}
                  className={`flex-1 px-3 py-2 rounded bg-blue-50 border text-sm ${
                    errors[index] ? 'border-red-500' : 'border-blue-100'
                  }`}
                />
                <Trash2
                  size={16}
                  onClick={() => handleDelete(index)}
                  className="text-red-500 cursor-pointer"
                />
              </div>
              {errors[index] && (
                <span className="text-xs text-red-500 pl-1">{errors[index]}</span>
              )}
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
}
