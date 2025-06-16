import { use } from "react";
import LiveInspectionViewPage from "./components/live-inspection-view";

export default function Page({ params }: { params: Promise<{ camera: string }> }) {
  const { camera } = use(params);
  
  return (
    <LiveInspectionViewPage cameraId={camera} />
  );
}
 