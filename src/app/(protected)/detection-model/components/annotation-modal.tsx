"use client";

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save, CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { DetectionModel } from "@/app/types/detection-model";
import { ClassName } from "@/app/types/class-name";
import ClassNameModal from "./class-name-modal";

const classNameList: ClassName[]  = [
  { id: '1', name: 'houseclip missing', checked: true },
  { id: '2', name: 'Good clip', checked: true },
];

interface AnnotationModalProps {
  onClose: () => void;
  onSave: () => void;
  canEdit: boolean;
}

export default function AnnotationModal({
  onClose,
  onSave,
  canEdit,
}: AnnotationModalProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [checkboxes, setCheckboxes] = useState(classNameList);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {}, []);

  const handleSave = (classname: ClassName[]) => {
    setCheckboxes(classname);
    setIsOpen(false);
  };

  const onSubmit: SubmitHandler<any> = async (formData) => {
    // onSave logic
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="relative flex flex-col bg-white rounded-xl w-[90%] max-w-6xl h-[70%] p-4 shadow-xl space-y-4">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="text-red-500" size={20} />
          </button>

          <h2 className="text-2xl font-semibold text-center mb-6">Edit</h2>

          {/* Main Content Area */}
          <div className="flex flex-1 space-x-4 overflow-hidden">
            {/* Left Toolbar */}
            <div className="w-14 flex flex-col items-center">
              <div className="space-y-6 mt-4">
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
              </div>
            </div>

            {/* Image Viewer */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-[50vh] bg-gray-100">
                <img
                  src="/images/takumi-pic.png"
                  alt="annotation"
                  className="object-contain max-h-full mx-auto"
                />
                {/* Example Bounding Box */}
                <div className="absolute border-4 border-yellow-500 top-40 left-96 w-24 h-24 text-xs text-yellow-400">
                  houseclip missing
                </div>
              </div>

              {/* Image Navigation */}
              <div className="flex justify-between w-full mt-4">
                {/* Previous Image */}
                <div
                  className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    console.log("Previous image clicked");
                  }}
                >
                  <CircleChevronLeft size={35} />
                  <span>Previous Image</span>
                </div>

                {/* Next Image */}
                <div
                  className="flex items-center gap-1 text-sm text-gray-700 cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    console.log("Next image clicked");
                  }}
                >
                  <span>Next Image</span>
                  <CircleChevronRight size={35} />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-64 pl-4 overflow-y-auto">
              {/* Box Class */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Box Class</h3>
                <div className="space-y-4 text-sm">
                  {checkboxes.map((item, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                        checked={item.checked}
                        onChange={(e) => {
                          const newCheckboxes = [...checkboxes];
                          newCheckboxes[index].checked = e.target.checked;
                          setCheckboxes(newCheckboxes);
                        }}
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsOpen(true)}
                      className="mt-2 text-xs px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Add new class
                    </button>
                  </div>
                </div>
              </div>

              {/* Setting */}
              {/* <div className='mt-10'>
                <h3 className="font-semibold mb-2">Setting</h3>
                <div className="text-sm space-y-2">
                  {["Transparent", "Grayscale", "Brightness", "Rotate"].map((label, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <label>{label}</label>
                      <input type="range" min="0" max={label === "Rotate" ? 360 : 100} defaultValue={label === "Brightness" ? 90 : 80} />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Save & Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            {/* Save Button */}
              {canEdit && (
                <button
                  type="submit"
                  className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2"
                >
                  Save
                  <Save size={16} />
                </button>
              )}
              {/* Cancel Button */}
              <button
                type="button"
                className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
                onClick={onClose}
              >
                Close
                <X size={16} />
              </button>
          </div>
        </div>
      </div>

      {/* Class Name Modal */}
      {isOpen && (
        <ClassNameModal
          onClose={() => setIsOpen(false)}
          onSave={handleSave}
          data={checkboxes}
        />
      )}
    </>
  );
}
