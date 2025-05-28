import { api } from '@/app/utils/api'
import type { LiveInspectionView } from "@/app/types/live"

export const detail = async (camera: string) => {
  return {
    location: `Location ${camera}`,
    cameraId: `C ${camera}`,
    cameraName: `CAM ${camera}`,
    status: "OK",
    productId: `PROD ${camera}`,
    productName: `PROD-NAME ${camera}`,
    productTypeName: `Bottle ${camera}`,
    serialNo: `CB550GT50 ${camera}`,
    defectType: `DT ${camera}`,
    productionDateTime: new Date(),
    lotNo: `2025`,
    totalNG: 0,
    totalProduct: 5000,
    actual: 3000,
  };
  // return await apiClient<DetectionModel>(`${apiUrl}/detail/${id}`, "GET");
};