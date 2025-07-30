import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, LockKeyhole } from "lucide-react";
import { Role } from "@/app/types/role"
import { formatDateTime } from "@/app/utils/date";

interface RoleColumnProps {
  showCheckbox?: boolean;
  openEditModal: (row?: Role) => void;
  openPermissionModal: (row?: Role) => void;
  selectedIds: number[];
  setSelectedIds: (updater: (prevState: number[]) => number[]) => void; 
  data: Role[];
  canEdit: boolean
}

export default function RoleColumns({
  showCheckbox,
  openEditModal, 
  openPermissionModal,
  selectedIds,
  setSelectedIds,
  data,
  canEdit
}: RoleColumnProps): ColumnDef<Role>[] {

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev: number[]) =>
      prev.length === data.length
        ? [] // If all items are selected, unselect all
        : data
          .map((item) => item.id) // Map to ids
          .filter((id): id is number => id !== undefined) // Filter out undefined values
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
                  checked={selectedIds.length === data.length && data.every(item => selectedIds.includes(item.id ?? 0))}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(row.original.id)} 
                  onChange={() => toggleSelect(row.original.id)} 
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
      accessorKey: "roleName",
      header: "Role Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const value = getValue() as boolean;
        const isActive = value === true;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
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
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button 
            className="px-1 py-1 flex items-center justify-center text-purple-600 hover:text-purple-900 transition"
            onClick={() => openPermissionModal(row.original)}
            title={"Permission"}
          >
            <LockKeyhole size={18} />
          </button>
          <button 
            className="px-1 py-1 flex items-center justify-center text-blue-600 hover:text-blue-800 transition"
            onClick={() => openEditModal(row.original)}
            title={canEdit ? "Edit" : "Detail"}
          >
            <SquarePen size={18} />
          </button>
        </div>
      ),
      meta: {
        style: { width: "3%" },
      },
    },
  ];
}
