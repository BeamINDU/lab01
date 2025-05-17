import { use } from "react";
import LiveInspectionViewPage from "./components/LiveInspectionViewPage";

export default function Page({ params }: { params: Promise<{ camera: string }> }) {
  const { camera } = use(params);
  return <LiveInspectionViewPage camera={camera} />;
}