import React, { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { ExportType } from '@/app/constants/export-type';

interface ExportButtonProps {
  onExport: (type: ExportType) => void;
}

const ExportButton = ({onExport} : ExportButtonProps) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleExport = (type: ExportType) => {
    onExport(type); 
    setShowExportOptions(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center gap-1 px-4 py-2 rounded whitespace-nowrap btn-primary-dark"
        onClick={() => setShowExportOptions(!showExportOptions)}
      >
        Export
        <Download size={16} className="mt-1" />
      </button>

      {showExportOptions && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50"
        >
          <button
            onClick={() => handleExport(ExportType.CSV)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Export .csv
          </button>
          <button
            onClick={() => handleExport(ExportType.Excel)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Export .xlsx
          </button>
          {/* <button
            onClick={() => handleExport(ExportType.Word)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Export .docx
          </button> */}
          {/* <button
            onClick={() => handleExport(ExportType.Text)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
          >
            Export .txt
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
