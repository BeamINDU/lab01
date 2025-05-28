export type DetectionModel = {
  modelId?: number | null,
  modelName: string,
  description?: string ,    
  version?: number,     
  cameraId?: string,
  function?: string,
  status?: string,     
  trainDataset?: number | null,
  testDataset?: number | null,
  validationDataset?: number | null,
  epochs?: number | null,
  createdDate?: Date,
  createdBy?: string,
  updatedDate?: Date | null,
  updatedBy?: string | null,
  isCreateMode?: boolean,
}

export type ParamSearch = {
  modelName?: string,               
  version?: number,          
  function?: string,
  status?: string,               
}

export type FormData = {
  modelId?: number | null;
  functions?: string | undefined;
  modelName: string | undefined,
  description: string | undefined,
  trainDataset: number | undefined,
  testDataset: number | undefined,
  validationDataset: number | undefined,
  epochs: number | undefined,
  cameraId?: string | undefined,
  version?: string | undefined,
  isComplete?: boolean
};
