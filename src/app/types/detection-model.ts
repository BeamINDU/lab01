import { Annotation } from "@/app/types/annotation";

export type DetectionModel = {
  modelId?: number | null,
  modelVersionId?: number | null,
  modelName: string,
  productId: string,
  description?: string,
  function?: string,
  statusId?: string,
  currentVersion?: number,
  currentStep?: number,
  createdDate?: Date,
  createdBy?: string,
  updatedDate?: Date | null,
  updatedBy?: string | null,
}

export type ParamSearch = {
  modelName?: string,               
  version?: number,          
  function?: string,
  statusId?: string,               
}

export type FormData = {
  modelVersionId?: number | null,
  modelId?: number | null,
  statusId?: string,
  currentVersion?: number,
  currentStep?: number,
  functions?: number[] | undefined;
  modelName: string | undefined,
  productId: string,
  description: string | undefined,
  trainDataset: number | undefined,
  testDataset: number | undefined,
  validationDataset: number | undefined,
  epochs: number | undefined,
  cameraId?: string | undefined,
  version?: number,
  updatedBy?: string | null,
  annotate?: string | null,
  fileName?: string | null,
  base64?: string | null,
  file?: File| null,
};

export type ModelPicture = {
  id?: number | null,
  name: string,
  file?: File,
  annotate?: Annotation[];
  url?: string,
  refId?: string
}

// export type Annotation = {
//   id: string
//   type: ShapeType
//   color?: string
//   label: ClassName,
//   startX: number
//   startY: number
//   width: number
//   height: number
//   radius: number
//   points: number[]
// };
