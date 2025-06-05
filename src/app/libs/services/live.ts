import { api } from '@/app/utils/api'
import type { LiveInspectionView } from "@/app/types/live"

export const detail = async (cameraId: string): Promise<LiveInspectionView> => {
  return {
    liveStream: `http://127.0.0.1:8001/live-defect/${cameraId}`,
    location: `Location ${cameraId}`,
    cameraId: `C ${cameraId}`,
    cameraName: `CAM ${cameraId}`,
    status: "OK",
    productId: `PROD ${cameraId}`,
    productName: `PROD-NAME ${cameraId}`,
    productTypeId: `BT ${cameraId}`,
    productTypeName: `Bottle ${cameraId}`,
    serialNo: `CB550GT50 ${cameraId}`,
    defectType: `DT ${cameraId}`,
    productDateTime: new Date(),
    lotNo: `LOT-2025`,
    totalNG: 1000,
    totalPlanning: 5000,
    actualPlanning: 4000,
  };

// const response = await fetch(`http://127.0.0.1:8001/live-defect/${cameraId}`);

};
