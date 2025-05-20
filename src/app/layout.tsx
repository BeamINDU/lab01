import "@/app/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Product Inspection",
  description: "Product Inspection",
};

export default function RootLayout({ children }: { children: ReactNode;}) {
  return (
    <html lang="en-CA">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
