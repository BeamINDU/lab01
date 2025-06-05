export const API_ROUTES = {
  auth: {
    login: "/login",
    userInfo: "/user-info",
  },
  product: {
    get: "/products",
    detail: "",
    insert: "/addproduct", 
    update: "/updateproduct",
    delete: "/deleteproduct",
  },
  product_type: {
    get: "/product-types",
    detail: "",
    insert: "/addprodtype", 
    update: "/addprodtype",
    delete: "/deleteprodtype",
  },
  defect_type: {
    get: "",
    detail: "",
    insert: "/adddefecttype", 
    update: "/updatedefecttype",
    delete: "/deletedefecttype",
  },
  camera: {
    get: "/cameras",
    detail: "",
    insert: "/addcamera", 
    update: "/updatecamera",
    delete: "/deletecamera",
  },
  users: {
    get: "/users",
    role: "/roles",
    insert: "/adduser", 
    update: "/updateuser",
    delete: "/deleteuser",
  },
  role: {
    get: "",
    detail: "",
    insert: "/addrole", 
    update: "/updaterole",
    delete: "/deleterole",
  },
  permission: {
    get: "",
    detail: "",
    insert: "/add_permission", 
    update: "/update_permission",
    delete: "/update_permission",
  },
  menu: {
    get: "",
    detail: "",
    insert: "/add_menu", 
    update: "/update_menu",
    delete: "",
  },
  planning: {
    get: "",
    detail: "",
    insert: "/addplanning", 
    update: "/updateplanning",
    delete: "/deleteplanning",
  },
  detection_model: {
    get: "",
    detail: "",
    insert: "/adddetectionmodel", 
    update: "/updatedetectionmodel",
    delete: "/deletemodel",
  },
  
  report_product: {
    get: "/productdefectresults",
    insert: "/addreportproduct",
    update: "/updatereportproduct",
    insert_detail: "/addproductdetail", 
  },
  report_defect: {
    get: "/defectsummary",
    insert: "/addreportdefect", 
    update: "/updatereportdefect", 
  },
  transaction: {
    get: "",
    insert: "/addtransaction", 
    update: "/updatetransaction",
  },
  live: {
    live_stream: "/live-stream",
    live_inspection: "/live_inspection",
  },
  dashboard: {
    total_products: "",
    Good_NG_Ratio: "",

  },
};
