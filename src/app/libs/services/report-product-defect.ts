import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { ReportProduct, ParamSearch, ProductDetail  } from "@/app/types/report-product-defect"
import { SelectOption } from "@/app/types/select-option";

export const search = async (param?: ParamSearch) => { 
  try {
    const res =  await api.get<any>(`${API_ROUTES.report_product.get}?${param}`);

    const mapData: ReportProduct[] = res?.product_defect_results
      ?.map((item) => ({
        runningNo: item.resultid,
        datetime: null,
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
    throw error;
  }  
};

export const detail = async (id: string) => {
  try {
    return await api.get<ProductDetail>(`${API_ROUTES.report_product.detail}/${id}`);
  } catch (error) {
    throw error;
  }  
};

export const update = async (param: Partial<ProductDetail>) => {
  try {
    const res = await api.put<ProductDetail>(`${API_ROUTES.report_product.update}?productId=${param.productId}`, param);
    return {
      ...param,
      updatedDate: new Date(),
    };
  } catch (error) {
    throw error;
  } 
};


