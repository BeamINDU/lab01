'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog } from '@headlessui/react';
import { X, Upload } from 'lucide-react';
import { showConfirm, showSuccess, showError } from '@/app/utils/swal'
import { toastSuccess, toastError } from '@/app/utils/toast';

type UploadButtonProps = {
  onUpload: (file: File) => void;
};

export default function UploadButton({ onUpload }: UploadButtonProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
  
      if (selectedFile.size > 25 * 1024 * 1024) {
        toastError("File size must not exceed 25MB.");
        return;
      }
  
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/csv': []
      // .csv	      text/csv
      // .xlsx	    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      // .xls	      application/vnd.ms-excel
      // .pdf	      application/pdf
      // .jpg/.png	image/*
    },
  });

  const handleUpload = async () => {
    if (!file) return;
  
    setIsUploading(true);
  
    try {
      await Promise.resolve(onUpload(file));
      setFile(null);
      setIsUploadModalOpen(false);
    } catch (error) {
      toastError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setIsUploadModalOpen(false)
  };

  return (
    <>
      <button 
        className="flex items-center gap-1 px-4 py-2 rounded btn-primary"
        onClick={() => setIsUploadModalOpen(true)}
      >
        Upload CSV
        <Upload size={16} className="mt-1" />
      </button>

      <Dialog open={isUploadModalOpen} onClose={handleCancel} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg relative">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6">Upload file</h2>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition min-h-[200px] flex items-center justify-center ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-blue-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <div>
                <Upload className="mx-auto text-blue-500 mb-2" />
                <p className="text-gray-600 text-sm">
                  {file ? file.name : 'Drag & Drop your files or '}
                  <span className="text-blue-600 font-medium cursor-pointer">Browse</span>
                </p>
              </div>
            </div>

            {/* Bottom info and buttons */}
            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
              <div>
                <p>Supported format: <span className="font-medium text-gray-700">CSV</span></p>
              </div>
              <div>
                <p>Maximum size: <span className="font-medium text-gray-700">25 MB</span></p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex justify-end gap-2 text-sm">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="px-4 py-2 btn-primary-dark rounded flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
                <Upload size={15} />
              </button>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="px-4 py-2 bg-secondary rounded flex items-center gap-2"
              >
                Cancel
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
