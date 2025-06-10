'use client'

import NextTopLoader from "nextjs-toploader";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ToastNotifications from '@/app/components/toastify/ToastNotifications'; 
import { PopupTraining } from '@/app/components/common/PopupTraining';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <ToastNotifications /> 

      <NextTopLoader />

      <Navbar />

      <div className="min-h-[7px] bg-[#38BDF8]" />

      <div className="grid grid-cols-[230px_1fr] mt-0 gap-6">
        <Sidebar />

        <div className="bg-[#F4F4F4]">
          <main className="flex-1 p-4 overflow-auto">
            {children}

            <PopupTraining/>
          </main>
        </div>
      </div>
    </>
  );
};
 
