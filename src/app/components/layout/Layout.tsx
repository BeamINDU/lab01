'use client'

import { useState } from 'react'
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from 'next/link'
import NextTopLoader from "nextjs-toploader";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Camera, Boxes, FileText, Settings, CalendarCog, CircleDot } from 'lucide-react'
import { signOut, useSession } from "next-auth/react";
import { MenuItem } from '@/app/types/menu';
import ToastNotifications from '@/app/components/toastify/ToastNotifications';
import { PopupTraining } from '@/app/components/common/PopupTraining';
import { usePermission } from '@/app/contexts/permission-context';
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";


const menu: MenuItem[] = [
  { id: "1", label: "Dashboard", icon: "dashboard", path: "/dashboard" },
  {
    id: "2", label: "Live inspection view", icon: "live",
    children: [
      {
        id: "21", label: "Line Packing 1",
        children: [
          { id: "211", label: "CAM 1 Identify", path: "/live/1" },
          { id: "212", label: "CAM 2 Defect Detection", path: "/live/2" },
        ],
      },
      {
        id: "22", label: "Line Spare Part",
        children: [
          { id: "221", label: "CAM 3 Identify &Detect", path: "/live/3" },
          { id: "222", label: "CAM 4 Identify &Detect", path: "/live/4" },
        ],
      },
    ],
  },
  {
    id: "3", label: "Master data", icon: "settings",
    children: [
      { id: "31", label: "Product", path: "/master-data/product" },
      { id: "32", label: "Product Type", path: "/master-data/product-type" },
      { id: "33", label: "Defect Type", path: "/master-data/defect-type" },
      { id: "34", label: "Camera", path: "/master-data/camera" },
      { id: "35", label: "User", path: "/master-data/user" },
      { id: "36", label: "Role", path: "/master-data/role" },
    ],
  },
  {
    id: "4", label: "Report", icon: "report",
    children: [
      { id: "41", label: "Product Defect Result", path: "/report/product-defect" },
      { id: "42", label: "Defect Summary", path: "/report/defect-summary" },
      { id: "43", label: "Transaction", path: "/report/c" },
    ],
  },
  { id: "5", label: "Detection Model", icon: "detection", path: "/detection-model" },
  { id: "6", label: "Planning", icon: "planning", path: "/planning" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { menuTree, loading } = usePermission();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const isMenuActive = (item: MenuItem): boolean => {
    if (item.path === pathname) return true;
    if (item.children) {
      return item.children.some((child) => isMenuActive(child));
    }
    return false;
  };

  const mapIconNameToIcon = (iconName: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      dashboard: <LayoutDashboard className="w-4 h-4 mr-2 text-gray-500" />,
      live: <Camera className="w-4 h-4 mr-2 text-gray-500" />,
      settings: <Settings className="w-4 h-4 mr-2 text-gray-500" />,
      report: <FileText className="w-4 h-4 mr-2 text-gray-500" />,
      planning: <CalendarCog className="w-4 h-4 mr-2 text-gray-500" />,
      detection: <Boxes className="w-4 h-4 mr-2 text-gray-400" />,
    };
    return iconMap[iconName.toLowerCase()] || <CircleDot className="w-2 h-2 mr-2 text-gray-400" />;
  };

  const getPaddingByLevel = (level: number) => {
    if (level === 0) return 'pl-2';
    if (level === 1) return 'pl-4';
    return 'pl-6';
  };

  const renderMenu = (items: MenuItem[], level = 0) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isTopLevel = level === 0;
        const isActive = isMenuActive(item);
        const hasChildren = item.children && item.children.length > 0;
        const padding = getPaddingByLevel(level);

        return (
          <li key={item.label}>
            <div
              className={`text-md flex items-center justify-between rounded-md cursor-pointer px-2 py-2
                ${padding}
                ${isActive
                  ? isTopLevel
                    ? 'bg-blue-200 text-blue-700 font-semibold'
                    : 'text-blue-700 font-semibold'
                  : 'hover:bg-gray-100 text-gray-700'}
                transition duration-150`}
            >
              <div className="flex items-center flex-1 space-x-2">
                {mapIconNameToIcon(item.icon || item.label)}
                {item.path ? (
                  <Link href={item.path} onClick={() => setSidebarOpen(true)} className="flex-1">
                    {item.label}
                  </Link>
                ) : (
                  <span onClick={() => toggleMenu(item.label)}>{item.label}</span>
                )}
              </div>
              {hasChildren && (
                <button onClick={() => toggleMenu(item.label)} className="ml-2 focus:outline-none">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openMenus[item.label] ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>

            {hasChildren && openMenus[item.label] && (
              <div className="ml-2 border-gray-200">
                {renderMenu(item.children!, level + 1)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  const Sidebar = () => {
    return (
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-md transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-3">
          {/* Logo */}
          <div className="cursor-pointer" onClick={navigateToDashboard}>
            <div className="flex items-center space-x-1">
              <Image src="/images/logo-takumi.png" alt="TAKUMI Logo" width={40} height={40} />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl -mt-2">TAKUMI</span>
                <span className="text-sm text-gray-600">Product Inspection</span>
              </div>
            </div>
          </div>
          {/* Button */}
          <button
            onClick={toggleSidebar}
            className="block"
          >
            <X className="w-6 h-6 md:hidden" />
            <Menu className="w-6 h-6 hidden md:block" />
          </button>
        </div>
        {/* <Sidebar/> */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-72px)]">
          {renderMenu(menuTree)}
        </nav>
      </div>
    )
  }

  const Nevbar = () => {
    return (
      <header className="flex items-center justify-between px-4 py-5 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-gray-700">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {/* User */}
          <div className="flex items-center">
            <User size={18} />
            <span>{session?.user?.fullname}</span>
          </div>
          {/* Sign Out Button */}
          <button onClick={handleLogout} className="text-black">
            <LogOut size={20} />
          </button>
        </div>
      </header>
    )
  }

  return (
    <div className="flex h-screen">
      <ToastNotifications />

      <NextTopLoader />

      <Sidebar />

      <div className="flex flex-col flex-1">
        <Nevbar />

        <main className={`flex-1 overflow-y-auto p-4 bg-gray-50 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <PopupTraining />

          {children}
        </main>
      </div>
    </div>
  )
};
