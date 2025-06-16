import { ReactNode } from "react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Inspection',
  description: 'AI Detection and Analyzer by TAKUMI',
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <main>{children}</main>
  );
}
