"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { PermissionProvider } from '@/app/contexts/permission-context';
import { PopupTrainingProvider } from '@/app/contexts/popup-training-context';

export default function LayoutProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PermissionProvider>
        <PopupTrainingProvider>
            {children}
        </PopupTrainingProvider>
      </PermissionProvider>
    </SessionProvider> 
  )
}