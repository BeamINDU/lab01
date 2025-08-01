import { api } from '@/app/utils/api'
import { API_ROUTES } from "@/app/constants/endpoint";
import type { ReportProduct, ParamSearch, ProductDetail, ParamDetail, ParamUpdate  } from "@/app/types/report-product-defect"
import { extractErrorMessage } from '@/app/utils/errorHandler';
import axios, { AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const search = async (param?: ParamSearch) => { 
  try {
    const res = await api.get<any>(API_ROUTES.report_product.get, param);
    return res;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const download = async (param?: ParamSearch) => { 
  try {
    const res = await api.get(API_ROUTES.report_product.export, param, {
      responseType: 'blob',
    });
    return res; 
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const detail = async (param?: ParamDetail) => {
  try {
    const res = await api.post<any>(API_ROUTES.report_product.detail, param);

    const mapData = {
      id: param?.id ?? 0,
      defecttime: res.defecttime,
      productId: res.prodid,
      productName: res.prodname,
      serialNo: res.prodserial,
      sequence: res.prodseq,
      // productTypeId: res.prodtypeid, 
      // productTypeName: res.prodtype, 
      defectDetail: res.defect_summary,
      cameraId: res.cameraid,
      // cameraName: res.cameraname,
      status: res.prodstatus,
      imagePath: res.imagepath,
      comment: res.comment,
      history: res.history,
    };
    return mapData;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};

export const update = async (param: ParamUpdate) => {
  try {
    const res = await api.put<ProductDetail>(`${API_ROUTES.report_product.update}`, {
      productId: param.productId,
      sequence: param.sequence,
      cameraId: param.cameraId,
      imagePath: param.imagePath,
      datetime: param.datetime,
      status: param.status,
      comment: param.comment,
      actionBy: param.updatedBy
    });

    const result = {
      ...param,
      res
    }
    
    return result;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  } 
};

export const resultImage = async (filename: string, defecttime : string) => { 
  try {
    const res = await api.get<any>(API_ROUTES.report_product.image, { filename: filename, defecttime: defecttime });
    const imageBase64 = res?.results?.[0]?.image_b64;
    // console.log("imageBase64", imageBase64)
    return imageBase64; 
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }  
};
