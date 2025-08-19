"use client";

import { Menu, X, User, LogOut, Settings, KeyRound, UserCircle2 } from 'lucide-react'
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from 'react';

type NavbarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export default function Navbar({ sidebarOpen, toggleSidebar }: NavbarProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white relative">
      {/* Left: Menu button */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-gray-700">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600 transition"
          >
            <User size={18} />
            <span>{session?.user?.fullname}</span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fade-in-up origin-top-right">
              <ul className="py-1 text-sm text-gray-700">
                <li>
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <UserCircle2 className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                </li>
                {/* <li>
                  <a
                    href="/change-password"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Change Password
                  </a>
                </li> */}
                {/* <li>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 hover:bg-gray-100 transition"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                </li> */}

                {/* Divider */}
                <li>
                  <div className="border-t border-gray-200 my-1" />
                </li>

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
