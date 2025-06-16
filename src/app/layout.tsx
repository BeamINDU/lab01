import "@/app/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Product Inspection",
  description: "Product Inspection",
};

export default function RootLayout({ children }: { children: ReactNode;}) {
  return (
    <html>
      <body className="bg-[#F4F4F4]">
        {children}
      </body>
    </html>
  );
}
