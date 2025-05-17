import NextTopLoader from "nextjs-toploader";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ToastNotifications from '@/app/components/toastify/ToastNotifications'; 

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#F4F4F4]">
      <ToastNotifications /> 
      <NextTopLoader />
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
 
export default Layout;
