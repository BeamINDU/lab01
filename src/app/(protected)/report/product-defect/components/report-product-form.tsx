"use client";

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Save } from 'lucide-react';
import { ProductDetail, ParamUpdate } from "@/app/types/report-product-defect"
import { useSession } from "next-auth/react";
import { formatDateTime } from "@/app/utils/date";
import { resultImage } from "@/app/libs/services/report-product-defect";

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
  const [ image, setImage] = useState<any>('');
  const [isImageLoading, setIsImageLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ProductDetail>({
  });

  useEffect(() => {
    const fetchImage = async () => {
      if (editingData) {
        reset(editingData);

        if (editingData.imagePath) {
          setIsImageLoading(true);
          try {
            const base64String = await resultImage(editingData.imagePath, `${formatDateTime(editingData.defecttime)}`);
            const image64 = `data:image/jpeg;base64,${base64String}`;
            setImage(image64);
          } catch (error) {
            console.error("Error fetching image:", error);
            setImage(null);
          } finally {
            setIsImageLoading(false);
          }
        }
      } else {
        reset();
        setImage(null);
      }
    };

    fetchImage();
  }, [editingData, reset]);

  const onSubmit: SubmitHandler<ProductDetail> = async (formData) => {
    const formWithMeta: ParamUpdate = {
      id: formData.id,
      productId: formData.productId,
      sequence: formData.sequence,
      cameraId: formData.cameraId,
      imagePath: formData.imagePath,
      datetime: formatDateTime(formData.defecttime),
      status: formData.status,
      comment: formData.comment ?? "",
      updatedBy: session?.user?.userid,
    };
    onSave(formWithMeta);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
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
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('sequence')} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="flex flex-col items-center">
              {isImageLoading ? (
                <div className="w-[400px] h-[300px] flex items-center justify-center border border-gray-300 text-gray-500">
                  Loading image...
                </div>
              ) : image ? (
                <img
                  src={image}
                  alt="Product"
                  className="border-0 border-yellow-400 p-1 h-[300px] object-contain"
                />
              ) : (
                <p className="border border-400 text-gray-500 flex items-center justify-center w-[400px] h-[300px]">
                  No results found
                </p>
              )}

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
              <div className="mt-5 w-full">
                <label className="block font-semibold mb-1">Comment</label>
                <textarea {...register("comment")} className="w-full h-20 p-2 border border-gray-400 rounded resize-none" />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              {/* Info */}
              <div className="border border-gray-400 p-2 rounded bg-white leading-7 h-[240px] bg-white overflow-y-auto">
                <div className="space-y-0">
                  <div className="flex">
                    <div className="w-40 font-semibold">Sequence:</div>
                    <div>{editingData?.sequence}</div>
                  </div>
                  <div className="flex">
                    <div className="w-40 font-semibold">Product:</div>
                    <div>{editingData?.productId} - {editingData?.productName}</div>
                  </div>
                  <div className="flex">
                    <div className="w-40 font-semibold">Serial Number:</div>
                    <div>{editingData?.serialNo}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-40 font-semibold">Camera ID:</div>
                    <div>{editingData?.cameraId}</div>
                  </div>
                  <div className="flex">
                    <div className="w-40 font-semibold">Date Time:</div>
                    <div>{formatDateTime(editingData?.defecttime)}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-40 font-semibold">Defect Type Name:</div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (editingData?.defectDetail ?? '').replace(/\n/g, '<br />'),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* History */}
              {editingData?.history && editingData.history.length > 0 ? (
                <div className="border border-gray-400 rounded bg-white h-[240px]">
                  <div className="bg-blue-200 p-2 font-bold rounded-t">History</div>
                  <div className="overflow-y-auto h-[200px] text-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-100 text-gray-700 sticky top-0">
                        <tr>
                          <th className="p-2 border-b border-gray-300 text-center align-middle">DateTime</th>
                          <th className="p-2 border-b border-gray-300 text-center align-middle">Status</th>
                          <th className="p-2 border-b border-gray-300 text-center align-middle">Comment</th>
                          <th className="p-2 border-b border-gray-300 text-center align-middle whitespace-nowrap">Updated by</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editingData.history.map((entry, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-1 border-b border-gray-200 text-center align-middle">
                              {formatDateTime(entry.actiondate)}
                            </td>
                            <td className="p-1 border-b border-gray-200 text-center align-middle">{entry.status}</td>
                            <td className="p-1 border-b border-gray-200">{entry.comment}</td>
                            <td className="p-1 border-b border-gray-200 whitespace-nowrap">{entry.actionby}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-400 rounded bg-white">
                  <div className="bg-blue-200 p-2 font-bold rounded-t">History</div>
                  <div className="p-4 text-sm text-gray-500 min-h-[200px] flex justify-center items-start">
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
