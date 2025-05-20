"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePermission } from '@/app/contexts/permission-context';
import type { MenuItem } from '@/app/types/menu';

//---------------------------------------------------------------------------------------------------------

const _menuData: MenuItem[] = [
  { id:"1", label: "Dashboard", path: "/dashboard" },
  { id:"2", label: "Live inspection view",
    children: [
      {
        id:"21", label: "Line Packing 1",
        children: [
          { id:"211", label: "CAM 1 Identify", path: "/live/1" },
          { id:"212", label: "CAM 2 Defect Detection", path: "/live/2" },
        ],
      },
      {
        id:"22", label: "Line Spare Part",
        children: [
          { id:"221", label: "CAM 3 Identify &Detect", path: "/live/3" },
          { id:"222", label: "CAM 4 Identify &Detect", path: "/live/4" },
          { id:"223", label: "CAM 5 Identify &Detect", path: "/live/5" }
        ],
      },
    ],
  },
  {
    id:"3", label: "Master data",
    children: [
      { id:"31", label: "Product", path: "/master-data/product" },
      { id:"32", label: "Product Type", path: "/master-data/product-type" },
      { id:"33", label: "Defect Type", path: "/master-data/defect-type" },
      { id:"34", label: "Camera", path: "/master-data/camera" },
      { id:"35", label: "User", path: "/master-data/user" },
      { id:"36", label: "Role", path: "/master-data/role" },
    ],
  },
  { id:"4", label: "Report",
    children: [
      { id:"41", label: "Product Defect Result", path: "/report/product-defect"},
      { id:"42", label: "Defect Summary", path: "/report/defect-summary" },
      { id:"43", label: "Transaction", path: "/report/c" },
    ],
  },
  { id:"5", label: "Detection Model", path: "/detection-model" }, 
  { id:"6", label: "Planning", path: "/planning" }, 
];

//---------------------------------------------------------------------------------------------------------

const Sidebar = () => {
  const pathname = usePathname();
  const { menuTree, loading } = usePermission();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const getSectionClass = (level: number) => {
    const bgColors = ["bg-[#0369A1]", "bg-[#7e8f97]", "bg-[#CFF0FB]"];
    const bgColor = bgColors[level] ?? "bg-[#E0F7FF]";
    const textColor = level >= 2 ? "text-gray-800" : "text-white";
    return `w-full flex items-center justify-between px-4 py-2 rounded-md ${bgColor} ${textColor}`;
  };

  const getLinkClass = (level: number, isActive: boolean) => {
    const base = "block px-4 py-2 rounded-md transition-all duration-150";
    if (level === 0) {
      return isActive ? `${base} bg-[#1e3a8a] text-white` : `${base} bg-[#0369A1] text-white hover:bg-sky-800`;
    } else if (level === 1) {
      return isActive ? `${base} bg-[#0EA5E9] text-white` : `${base} bg-[#F9FAFB] text-gray-800 hover:bg-sky-100`;
    } else {
      return isActive ? `${base} bg-[#0EA5E9] text-white` : `${base} bg-[#CFF0FB] text-gray-800 hover:bg-sky-100`;
    }
  };

  const renderMenu = (items: MenuItem[], level = 0) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = item.path === pathname;
        return (
          <li key={item.id || item.label}>
            {item.children?.length ? (
              <>
                <button className={getSectionClass(level)} onClick={() => toggleMenu(item.label)}>
                  <span>{item.label}</span>
                  {openMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {openMenus[item.label] && (
                  <div className="ml-2 mt-1">
                    {renderMenu(item.children, level + 1)}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.path ?? "#"} className={getLinkClass(level, isActive)}>
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  if (loading) return <div>Loading menu...</div>;

  return (
    <aside className="bg-white overflow-y-auto py-2 w-64 h-[calc(100vh-80px)] ">
      <nav className="space-y-2 px-2">
        {renderMenu(menuTree)}
      </nav>
    </aside>
  );
};

export default Sidebar;
