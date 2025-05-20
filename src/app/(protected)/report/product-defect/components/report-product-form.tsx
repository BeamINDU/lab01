"use client";

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { ProductDetail, ParamUpdate } from "@/app/types/report-product-defect"
import { useSession } from "next-auth/react";

interface ProductModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingData: ProductDetail | null;
  onSave: (formData: ParamUpdate) => void;
  canEdit: boolean,
}

export default function ProductFormModal({
  showModal,
  setShowModal,
  editingData,
  onSave,
  canEdit
}: ProductModalProps) {
  const { data: session } = useSession();

  // const defaultValues: ProductDetail = {
  //   productId: '',
  //   serialNo: '',
  //   date: '',
  //   time: '',
  //   lotNo: '',
  //   defectType: '',
  //   cameraId: '',
  //   history: [],
  //   status: '',
  //   comment: '',
  // };

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ProductDetail>({
    // defaultValues,
  });

  useEffect(() => {
    if (editingData) {
      reset(editingData);
    } else {
      reset();
    }
  }, [editingData, reset]);

  if (!showModal) return null;

  const onSubmit: SubmitHandler<ProductDetail> = async (formData) => {
    const formWithMeta: ParamUpdate = {
      productId: formData.productId,
      status: formData.status,
      comment: formData.comment,
      updatedBy: session?.user?.userid,
    };
    onSave(formWithMeta);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-6xl relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={() => setShowModal(false)}
        >
          <X className="text-red-500" size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Product Detail
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='text-sm'>
          <input type="hidden" {...register('productId')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="flex flex-col items-center">
            <img
              src="/images/logo-login.png"
              alt="Product"
              className="border-0 border-yellow-500 p-1 w-[300px] h-[200px] object-contain"
            />

              {/* Override Status */}
              <div className="mt-6 space-y-2 w-full">
                <div className="font-semibold">Override status</div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="OK" {...register("status")} className="w-5 h-5" /> OK
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="NG" {...register("status")} className="w-5 h-5" /> NG
                  </label>
                </div>
              </div>

              {/* Comment */}
              <div className="mt-4 w-full">
                <label className="block font-semibold mb-1">Comment</label>
                <textarea {...register("comment")} className="w-full h-28 p-2 border border-gray-400 rounded resize-none" />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              {/* Info */}
              <div className="border border-gray-400 p-2 rounded bg-white leading-7 h-[210px]">
                <p><b>Product ID: </b> {editingData?.productId}</p>
                <p><b>Product Name: </b> {editingData?.productName}</p>
                <p><b>Serial No.: </b> {editingData?.serialNo}</p>
                <p><b>Date: </b> {editingData?.date}</p>
                <p><b>Time: </b> {editingData?.time}</p>
                <p><b>Defect Type: </b> {editingData?.defectType}</p>
                <p><b>Camera ID: </b>{editingData?.cameraId}</p>
              </div>

              {/* History */}
              {editingData?.history && editingData.history.length > 0 ? (
                <div className="border border-gray-400 rounded bg-white h-200px]">
                  <div className="bg-blue-200 p-2 font-bold rounded-t">History</div>
                  <div className="overflow-y-auto h-[160px] text-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-100 text-gray-700 sticky top-0">
                        <tr>
                          <th className="p-2 border-b border-gray-300">Date</th>
                          <th className="p-2 border-b border-gray-300">Time</th>
                          <th className="p-2 border-b border-gray-300">Updated by</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingData.history.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-1 border-b border-gray-200">{entry.date}</td>
                            <td className="p-1 border-b border-gray-200">{entry.time}</td>
                            <td className="p-1 border-b border-gray-200">{entry.updatedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-400 rounded bg-white">
                  <div className="bg-blue-200 p-2 font-bold rounded-t">History</div>
                  <div className="p-4 text-sm text-gray-500 min-h-[155px] flex justify-center items-start">
                    No history available.
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
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
              onClick={() => setShowModal(false)}
            >
              Close
              <X size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
