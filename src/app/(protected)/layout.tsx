import { ReactNode } from "react";
import type { Metadata } from 'next'
import Providers from "./providers";
import Layout from "@/app/components/layout/Layout";

export const metadata: Metadata = {
  title: 'Product Inspection',
  description: 'AI Detection and Analyzer by TAKUMI',
}

export default function MainLayout({ children }: { children: ReactNode;}) {
  return (
    <Providers>
      <Layout>
        {children}
      </Layout>
    </Providers> 
  );
}
