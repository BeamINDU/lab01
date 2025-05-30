export type DetectionModel = {
  modelId?: number | null,
  modelName: string,
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
  modelId?: number | null,
  statusId?: string,
  currentVersion?: number,
  currentStep?: number,
  functions?: number[] | undefined;
  modelName: string | undefined,
  description: string | undefined,
  trainDataset: number | undefined,
  testDataset: number | undefined,
  validationDataset: number | undefined,
  epochs: number | undefined,
  cameraId?: string | undefined,
  version?: number,

  // isComplete?: boolean
};


export type ModelPicture = {
  id: number
  name: string,
  url: string
}

  // cameraId?: string,
  // trainDataset?: number | null,
  // testDataset?: number | null,
  // validationDataset?: number | null,
  // epochs?: number | null,
  // currentVersion?: number,
  // currentStep?: number,