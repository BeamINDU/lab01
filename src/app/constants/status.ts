export const ActiveStatus = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

export const ProductStatus = [
  { label: 'NG', value: 'NG' },
  { label: 'OK', value: 'OK' },
];

export const ModelStatusOption = [
  { label: 'Processing', value: 'Processing' },
  { label: 'Training', value: 'Training' },
  { label: 'Ready', value: 'Ready' },
  { label: 'Using', value: 'Using' },
];

export enum ModelStatus {
  Processing = "Processing",
  Training = "Training",
  Ready = "Ready",
  Using = "Using",
}
