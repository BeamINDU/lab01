export type LiveInspection = {
  liveStream: string
  location: string
  cameraId: string
  cameraName: string
  status: string
  lotNo: string
  totalNG: number | string
  totalProduct: number | string
  actualProduct: number | string
  currentInspection: CurrentInspection,
  detectionInfo: DetectionInfo[]
}

export type CurrentInspection = {
  productId: string
  productName: string
  serialNo: string
  productDateTime: Date | string
}

export type DetectionInfo = {
  function: string;
  predicted: string;
  expected: string;
  confident?: number;
  status: "OK" | "NG" | string;
}

// export type LiveInspectionView = {
//   liveStream: string,
//   location: string,
//   cameraId: string,
//   cameraName: string,
//   status: string,
//   lotNo: string,
//   totalNG: string,
//   totalProduct: string,
//   actualProduct: string,
//   detectionInfo: DetectionInfo[]
// }

// export type DetectionInfo = {
//     function:string
//     predicted:string
//     expected: string,
//     confident?: number,
//     status: string,
// }

// const Function = [
//   "Color Detection",
//   "Type Classification",
//   "Component Detection",
//   "Object Counting",
//   "Barcode Reading",
// ];

// export type LiveInspectionView = {
//   liveStream: string,
//   location: string,
//   cameraId: string,
//   cameraName: string,
//   status: string,
//   lotNo: string,
//   totalNG: string,
//   totalProduct: string,
//   actualProduct: string,
//   currentInspection: {
//     productId: string,
//     productName: string,
//     serialNo: string,
//     productDateTime: Date | string,
//   }
//   colorDetection: {
//     predictedResult:string
//     expected: string,
//     confident: number,
//     status: string,
//   },
//   typeClassification: {
//     predictedResult:string
//     expected: string,
//     confident: number,
//     status: string,
//   },
//   componentDetection: {
//     predictedResult:string
//     expected: string,
//     confident: number,
//     status: string,
//   },
//   objectCounting: {
//     predictedResult:string
//     expected: string,
//     confident: number,
//     status: string,
//   },
//   barcodeReading: {
//     predictedResult:string
//     expected: string,
//     confident: number,
//     status: string,
//   },
// }
