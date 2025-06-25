'use client'

import { useState } from 'react'
import NextTopLoader from "nextjs-toploader";
import ToastNotifications from '@/app/components/toastify/ToastNotifications';
import { PopupTraining } from '@/app/components/common/PopupTraining';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <ToastNotifications />
      <NextTopLoader />

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* ✅ ปรับ main container ให้ใช้พื้นที่เต็มหน้าจอ */}
        <main className={`flex-1 overflow-hidden bg-gray-50 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <div className="h-full overflow-y-auto">
            <PopupTraining />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
};