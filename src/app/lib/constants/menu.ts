export enum Menu {
  Dashboard = 'DB000',
  LiveInspectionView = 'LI000',
  MasterData = 'MD000',
  Product = 'MD001',
  ProductType = 'MD002',
  DefectType = 'MD003',
  Camera = 'MD004',
  User = 'MD005', 
  Role = 'MD006',
  Report = 'RP000',
  ReportProductDefect = 'RP001',
  ReportDefectSummary = 'RP002',
  ReportTransaction = 'RP003',
  DetectionModel = 'DM000',
  Planning = 'PL000',
}

export enum Action {
  View = 1,      // view
  Add = 2,       // add
  Edit = 3,      // edit
  Delete = 4,    // delete
  Upload = 5,    // upload
  Export = 6     // export
}
