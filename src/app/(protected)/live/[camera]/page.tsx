import { use } from "react";
// import SocketProvider from '@/app/providers/SocketProvider';
import LiveInspectionViewPage from "./components/LiveInspectionView";

export default function Page({ params }: { params: Promise<{ camera: string }> }) {
  const { camera } = use(params);
  return (
    // <SocketProvider>
      <LiveInspectionViewPage cameraId={camera} />
    // </SocketProvider>
  );
}
 