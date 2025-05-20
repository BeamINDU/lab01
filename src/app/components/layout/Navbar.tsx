'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, LogOut  } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="flex justify-between items-center shadow-md bg-white p-2">
      {/* Left: Logo */}
      <div className="cursor-pointer" onClick={navigateToDashboard}>
        {/* <img 
          src="/images/logo-navbar.png" 
          alt="Logo" 
          className="ml-5 h-[60px] object-contain" 
        /> */}
        <div className="flex items-center space-x-2">
          <Image src="/images/logo-takumi.png" alt="TAKUMI Logo" width={55} height={55} />
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-2xl -mt-2.5">TAKUMI</span>
            <span className="text-sm text-gray-600">Product Inspection</span>
          </div>
        </div>
      </div>
      {/* Right: Navigation Icons */}
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
    </nav>

    // <header className="bg-white border-b shadow px-6 py-3 flex items-center justify-between">
    //   <div className="flex items-center space-x-2">
    //     <Image src="/images/logo-login.png" alt="TAKUMI Logo" width={45} height={45} />
    //     <div className="flex flex-col leading-tight">
    //       <span className="font-bold text-lg">TAKUMI</span>
    //       <span className="text-sm text-gray-600">Product Inspection</span>
    //     </div>
    //   </div>

    //   <div className="flex items-center space-x-4">
    //     <div className="flex items-center space-x-1">
    //       <User size={18} />
    //       <span>{session?.user?.fullname}</span>
    //     </div>
    //     <button onClick={handleLogout} title="Logout">
    //       <LogOut size={20} />
    //     </button>
    //   </div>
    // </header>
  );
};
 
export default Navbar;
