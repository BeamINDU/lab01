import { Suspense, lazy } from "react";

export default function SuspenseLoading({ data, loading }: { data: any, loading: boolean }) {
  return (
    <Suspense fallback={
      <div className="bg-gray-200">
        <div className="bg-gray-600 h-10 animate-pulse" />
        <div className="h-[480px] bg-gray-400 animate-pulse" />
      </div>
    }>
    </Suspense>
  );
}
