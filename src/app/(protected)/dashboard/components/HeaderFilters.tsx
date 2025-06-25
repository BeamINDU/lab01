import { useEffect, useState } from 'react';
import { getProducts, getCameras, getLines } from "@/app/libs/services/dashboard";
import type { ProductOption, CameraOption, LineOption } from '@/app/types/dashboard';
import { showError } from '@/app/utils/swal';
import DateFilters from './DateFilters';
import SearchableDropdown from './SearchableDropdown'; 

interface HeaderFiltersProps {
  selectedProduct?: string;
  selectedCamera?: string;
  selectedLine?: string;
  selectedMonth?: string;
  selectedYear?: string;
  dateFrom?: string;
  dateTo?: string;
  onProductChange?: (productId: string) => void;
  onCameraChange?: (cameraId: string) => void;
  onLineChange?: (lineId: string) => void;
  onMonthChange?: (month: string) => void;
  onYearChange?: (year: string) => void;
  onDateFromChange?: (date: string | null) => void;
  onDateToChange?: (date: string | null) => void;
}

export default function HeaderFilters(props: HeaderFiltersProps) {
  const [options, setOptions] = useState({
    products: [] as ProductOption[],
    cameras: [] as CameraOption[],
    lines: [] as LineOption[],
    loading: true
  });

  // Load all dropdown data in one useEffect
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [products, cameras, lines] = await Promise.all([
          getProducts(),
          getCameras(),
          getLines()
        ]);

        setOptions({
          products,
          cameras,
          lines,
          loading: false
        });
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
        showError('Failed to load filter options');
        setOptions(prev => ({ ...prev, loading: false }));
      }
    };

    loadAllData();
  }, []);

  if (options.loading) {
    return (
      <div className="flex justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-gray-500">Loading filters...</div>
      </div>
    );
  }

  // Convert to dropdown format
  const dropdownOptions = {
    products: options.products.map(p => ({ id: p.id, name: p.name })),
    cameras: options.cameras.map(c => ({ id: c.id, name: c.name })),
    lines: options.lines.map(l => ({ id: l.id, name: l.name }))
  };

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold mr-4">Dashboard</h1>
        
        <SearchableDropdown
          options={dropdownOptions.products}
          selectedValue={props.selectedProduct || ''}
          placeholder="Products"
          onSelect={props.onProductChange}
        />
        
        <SearchableDropdown
          options={dropdownOptions.cameras}
          selectedValue={props.selectedCamera || ''}
          placeholder="Cameras"
          onSelect={props.onCameraChange}
        />
        
        <SearchableDropdown
          options={dropdownOptions.lines}
          selectedValue={props.selectedLine || ''}
          placeholder="Lines"
          onSelect={props.onLineChange}
        />
      </div>

      {/* RIGHT SECTION */}
      <DateFilters
        selectedMonth={props.selectedMonth}
        selectedYear={props.selectedYear}
        dateFrom={props.dateFrom}
        dateTo={props.dateTo}
        onMonthChange={props.onMonthChange}
        onYearChange={props.onYearChange}
        onDateFromChange={props.onDateFromChange}
        onDateToChange={props.onDateToChange}
      />
    </div>
  );
}