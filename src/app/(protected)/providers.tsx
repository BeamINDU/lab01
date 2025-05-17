"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { PermissionProvider } from '@/app/contexts/permission-context';
// import { Provider } from "react-redux";
// import { store } from '@/app/store/store';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <PermissionProvider>
        {/* <Provider store={store}> */}
          {children}
        {/* </Provider> */}
      </PermissionProvider>
    </SessionProvider> 
  )
}

