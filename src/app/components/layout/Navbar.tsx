"use client";

import { Menu, X, User, LogOut } from 'lucide-react'
import { signOut, useSession } from "next-auth/react";

type NavbarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Navbar({sidebarOpen, toggleSidebar}: NavbarProps) {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-gray-700">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          
          {/* User */}
          <div className="flex items-center text-sm">
            <User size={18} />
            <span>{session?.user?.fullname}</span>
          </div>

          {/* Sign Out Button */}
          <button onClick={handleLogout} className="text-black">
            <LogOut size={20} />
          </button>
        </div>
      </header>
  );
}
