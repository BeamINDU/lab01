export type DetectionModel = {
  id: number
  modelName: string               
  version: string          
  status: string               
  function: string                     
  feature: string
  createdDate?: Date
  createdBy?: string
  updatedDate?: Date
  updatedBy?: string
}


export type ParamSearch = {
  modelName?: string               
  version?: string          
  status?: string               
  function?: string                     
  feature?: string
}