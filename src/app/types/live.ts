export type LiveInspectionView = {
  liveStream: string,
  location: string,
  cameraId: string,
  cameraName: string,
  status: string,
  lotNo: string,
  totalNG: string,
  totalProduct: string,
  actualProduct: string,
  currentInspection: {
    productId: string,
    productName: string,
    serialNo: string,
    productDateTime: Date | string,
  }
  colorDetection: {
    predictedResult:string
    expected: string,
    confident: number,
    status: string,
  },
  typeClassification: {
    predictedResult:string
    expected: string,
    confident: number,
    status: string,
  },
  componentDetection: {
    predictedResult:string
    expected: string,
    confident: number,
    status: string,
  },
  objectCounting: {
    predictedResult:string
    expected: string,
    confident: number,
    status: string,
  },
  barcodeReading: {
    predictedResult:string
    expected: string,
    confident: number,
    status: string,
  },
}
