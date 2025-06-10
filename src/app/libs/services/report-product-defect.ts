import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { ReportProduct, ParamSearch, ProductDetail  } from "@/app/types/report-product-defect"
import { SelectOption } from "@/app/types/select-option";
import { extractErrorMessage } from '@/app/utils/errorHandler';

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.report_product.get}?${param}`);

    const mapData: ReportProduct[] = res?.product_defect_results?.map((item) => ({
      runningNo: item.resultid,
      datetime: null,
      id: item.prodid,
      productId: item.prodid,
      productName: item.prodname,
      defectTypeId: item.defectid,
      defectTypeName: item.defecttype,
      cameraName: item.cameraid,
      status: item.prodstatus,
      imageUrl: item.imagepath,
    }));

    return mapData; 
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<ProductDetail>(`${API_ROUTES.report_product.detail}/${id}`);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (id: string, param: Partial<ProductDetail>) => {
  try {
    const res = await api.put<ProductDetail>(`${API_ROUTES.report_product.update}?productid=${id}`, param);
    return {
      ...param,
      id: param.productId,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.upload<ReportProduct[]>(`${API_ROUTES.report_product.upload}`, formData);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

