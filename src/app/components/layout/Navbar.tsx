'use client';

import Image from "next/image";
import { User, LogOut  } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="bg-white border-b shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Image src="/images/logo-login.png" alt="TAKUMI Logo" width={45} height={45} />
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-lg">TAKUMI</span>
          <span className="text-sm text-gray-600">Product Inspection</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <User size={18} />
          <span>{session?.user?.fullname}</span>
        </div>
        <button onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
 
export default Navbar;
