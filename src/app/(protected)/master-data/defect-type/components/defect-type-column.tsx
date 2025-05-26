import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { DefectType } from "@/app/types/defect-type"
import { formatDateTime } from "@/app/utils/date";

interface DefectTypeColumnProps {
  showCheckbox?: boolean;
  openEditModal: (row?: DefectType) => void;
  selectedIds: string[];
  setSelectedIds: (updater: (prevState: string[]) => string[]) => void; 
  data: DefectType[];
  canEdit: boolean
}

export default function DefectTypeColumns({
  showCheckbox,
  openEditModal, 
  selectedIds,
  setSelectedIds,
  data,
  canEdit
}: DefectTypeColumnProps): ColumnDef<DefectType>[] {

  const toggleSelect = (defectTypeId: string) => {
    setSelectedIds((prev) =>
      prev.includes(defectTypeId) ? prev.filter((selectedId) => selectedId !== defectTypeId) : [...prev, defectTypeId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev: string[]) =>
      prev.length === data.length
        ? [] // If all items are selected, unselect all
        : data
          .map((item) => item.defectTypeId) // Map to ids
          .filter((defectTypeId): defectTypeId is string => defectTypeId !== undefined) // Filter out undefined values
    );
  };

  return [
    ...(showCheckbox
      ? [
          {
            id: "select",
            header: () => (
              <div className="flex justify-center items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length && data.every(item => selectedIds.includes(item.defectTypeId ?? ""))}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.original.defectTypeId)} 
                  onChange={() => toggleSelect(row.original.defectTypeId)} 
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            meta: {
              style: {
                width: '30px',
              },
            },
          }
        ]
      : []),
    {
      accessorKey: "no",
      header: "No",
      enableSorting: false,
    },
    {
      accessorKey: "defectTypeId",
      header: "Defect Type ID",
    },
    {
      accessorKey: "defectTypeName",
      header: "Defect Type Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "createdBy",
      header: "Created By",
    },
    {
      accessorKey: "createdDate",
      header: "Created Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "updatedBy",
      header: "Updated By",
    },
    {
      accessorKey: "updatedDate",
      header: "Updated Date",
      cell: ({ getValue }) => {
        const rawValue = getValue() as string | number | Date | null | undefined;
        const formattedDate = formatDateTime(rawValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            className="flex items-center gap-1 text-xs px-3 py-1 rounded btn-primary"
            onClick={() => openEditModal(row.original)}
          >
            {canEdit ? 'Edit' : 'Detail'}
            <SquarePen size={16} />
          </button>
        </div>
      ),
    },
  ];
}
