import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import { ModelAssignment, ParamSearch } from "@/app/types/model-assignment"
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.model_assignment.get, param);

    const mapData: ModelAssignment[] = res?.model_assignments?.map((item) => ({
        id: item.id,
        modelId: item.modelid,
        modelName: item.modelname,
        cameraId: item.cameraid,
        productId: item.prodid,
        modelVersionId: item.modelversionid,
        versionNo: item.versionno,
        status: item.appliedstatus,
        statusName: item.appliedstatus ? 'Active' : 'Inactive',
        appliedDate: item.applieddate,
        appliedBy: item.appliedby,
    }));
    
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<ModelAssignment>(`${API_ROUTES.model_assignment.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: number, param: Partial<ModelAssignment>) => {
  try {
    const res = await api.put<any>(`${API_ROUTES.model_assignment.update}?id=${id}`, {
      productId: param.productId,
      cameraId: param.cameraId,
      modelVersionId: param.modelVersionId,
      status: param.status,
      appliedBy: param.appliedBy
    });
    return {
      ...param,
      id: res.id,
      statusName: param.status ? 'Active' : 'Inactive',
      applieddate: new Date(res.applieddate),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};
