import { api } from '@/app/utils/api'
import type { LiveInspectionView } from "@/app/types/live"

export const detail = async (camera: string) => {
  return {
    location: `Location ${camera}`,
    cameraId: `C ${camera}`,
    cameraName: `CAM ${camera}`,
    status: "OK",
    id: 99,
    productId: `CB650EX ${camera}`,
    part: `Body ${camera}`,
    serialNo: `CB550GT50 ${camera}`,
    defectType: `DT ${camera}`,
    productionDate: `00/00/00`,
    productionTime: `00:00:00`,
    lotNo: `2025`,
    totalNG: 0,
    totalProduct: 5000,
    actual: 3000,
  };
  // return await apiClient<DetectionModel>(`${apiUrl}/detail/${id}`, "GET");
};