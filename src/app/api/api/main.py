from fastapi import FastAPI, HTTPException, Depends, Body, WebSocket, WebSocketDisconnect
# import asyncio
from datetime import datetime
from sqlalchemy.sql import text
from database.connect_to_db import Session
from database.user import UserDB, UserService
from database.product import ProductDB, ProductService
from database.connect_to_db import test_db_connection, SessionLocal
import database.schemas as schemas
from database.defect import DefectDB
from database.camera import CameraDB, CameraService
from database.planning import PlanningDB
from database.model import DetectionModelDB
from database.transaction import TransactionDB
from database.report import ReportDB
from database.role import RoleDB
from database.permission import PermissionDB
from database.menu import MenuDB
from database.dashboard import DashboardDB
# from database.live_inspection import live_inspection_ws_handler
# from streaming.live_stream import setup_streaming, websocket_clients
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI(
    title="PI Backend API",
    description="Backend service for managing users, roles, products, planning, inspection, and reporting.",
    version="1.0.0",
    openapi_tags=[
        {"name": "General", "description": "Health check and DB test"},
        {"name": "User", "description": "User management"},
        {"name": "Permission", "description": "Permission management"},
        {"name": "Role", "description": "Role management"},
        {"name": "Product", "description": "Product management"},
        {"name": "ProdType", "description": "Product type management"},
        {"name": "Menu", "description": "Menu management"},
        {"name": "Camera", "description": "Camera configuration"},
        {"name": "Defect", "description": "Defect types"},
        {"name": "Planning", "description": "Production planning"},
        {"name": "Model", "description": "Detection model registry"},
        {"name": "Transaction", "description": "Lot and quantity tracking"},
        {"name": "Report", "description": "Report logs and results"},
        # {"name": "Live", "description": "Live Inspection data"},
        {"name": "Dashboard","description": "Dashboard"}
    ]
)
'''
@app.on_event("startup")
def on_startup():
    # Register the current event loop for your kafka thread to use
    setup_streaming(asyncio.get_event_loop())
'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or frontend IP 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

user_db = UserDB()
product_db = ProductDB()
camera_db = CameraDB()
defect_db = DefectDB()
role_db = RoleDB()
permission_db = PermissionDB()
menu_db = MenuDB()
transaction_db = TransactionDB()
planning_db = PlanningDB()
dashboard_db = DashboardDB()

@app.get("/", tags=["General"])
def read_root():
    return {"message": "API is working"}

@app.get("/test-db", tags=["General"])
def test_db():
    try:
        return test_db_connection()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/users", tags=["User"])
def users():
    try:
        return {"users": user_db.get_users()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/roles", tags=["User"])
def roles():
    try:
        return {"roles": role_db.get_roles()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/adduser", tags=["User"])
def add_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        return UserService.add_user(user, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updateuser", tags=["User"])
def edit_user(user: schemas.UserUpdate, db: Session = Depends(get_db)):
    try:
        return UserService.edit_user(user, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addrole", tags=["Role"])
def add_role(role: schemas.RoleCreate, db: Session = Depends(get_db)):
    try:
        return role_db.add_role(role, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updaterole", tags=["Role"])
def update_role(roleid: str, role: schemas.RoleUpdate, db: Session = Depends(get_db)):
    try:
        return role_db.update_role(roleid, role, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products", tags=["Product"])
def products():
    try:
        return {"products": product_db.get_products()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product-types", tags=["ProdType"])
def product_types():
    try:
        return {"product_types": product_db.get_product_types()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addproduct", tags=["Product"])
def add_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    try:
        return ProductService.add_product(product, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updateproduct", tags=["Product"])
def update_product(prodid: str, product: schemas.ProductUpdate = Body(...), db: Session = Depends(get_db)):
    try:
        return ProductService.update_product(prodid, product, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addprodtype", tags=["ProdType"])
def add_prodtype(prodtype: schemas.ProdTypeCreate, db: Session = Depends(get_db)):
    try:
        return ProductService.add_prodtype(prodtype, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updateprodtype", tags=["ProdType"])
def update_prodtype(prodtypeid: str, prodtype: schemas.ProdTypeUpdate, db: Session = Depends(get_db)):
    try:
        return ProductService.update_prodtype(prodtypeid, prodtype, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cameras", tags=["Camera"])
def cameras():
    try:
        return {"cameras": product_db.get_cameras()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addcamera", tags=["Camera"])
def add_camera(camera: schemas.CameraCreate, db: Session = Depends(get_db)):
    try:
        return CameraService.add_camera(camera, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updatecamera", tags=["Camera"])
def update_camera(cameraid: str, camera: schemas.CameraUpdate, db: Session = Depends(get_db)):
    try:
        return CameraService.update_camera(cameraid, camera, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add_menu", tags=["Menu"])
def add_menu_api(menu: schemas.MenuCreate, db: Session = Depends(get_db)):
    try:
        return menu_db.add_menu(menu, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/update_menu", tags=["Menu"])
def update_menu_api(menuid: str, menu: schemas.MenuUpdate, db: Session = Depends(get_db)):
    try:
        return menu_db.update_menu(menuid, menu, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/defecttypes", tags=["Defect"])
def get_defect_types():
    try:
        return {"defect_types": defect_db.get_defect_types()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/adddefecttype", tags=["Defect"])
def add_defect_type(defect: schemas.DefectTypeCreate):
    try:
        return defect_db.add_defect_type(defect)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updatedefecttype", tags=["Defect"])
def update_defect_type(defectid: str, defect: schemas.DefectTypeUpdate, db: Session = Depends(get_db)):
    try:
        return DefectDB().update_defect_type(defectid, defect)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/planning", tags=["Planning"])
def planning():
    try:
        return {"planning": planning_db.get_planning()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/addplanning", tags=["Planning"])
def add_planning(plan: schemas.PlanningCreate, db: Session = Depends(get_db)):
    try:
        return planning_db.add_planning(plan, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updateplanning", tags=["Planning"])
def update_planning(planid: str, plan: schemas.PlanningUpdate, db: Session = Depends(get_db)):
    try:
        return planning_db.update_planning(planid, plan, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/adddetectionmodel", tags=["Model"])
def add_detection_model(model: schemas.DetectionModelCreate, db: Session = Depends(get_db)):
    try:
        return DetectionModelDB().add_detection_model(model, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updatedetectionmodel", tags=["Model"])
def update_detection_model(modelid: str, model: schemas.DetectionModelUpdate, db: Session = Depends(get_db)):
    try:
        return DetectionModelDB().update_detection_model(modelid, model, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/transaction", tags=["Transaction"])
def transaction():
    try:
        return {"transaction": transaction_db.get_transaction()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addtransaction", tags=["Transaction"])
def add_transaction(txn: schemas.TransactionCreate, db: Session = Depends(get_db)):
    try:
        return transaction_db.add_transaction(txn, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updatetransaction", tags=["Transaction"])
def update_transaction(runningno: int, txn: schemas.TransactionUpdate, db: Session = Depends(get_db)):
    try:
        return transaction_db.update_transaction(runningno, txn, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/productdefectresults", tags=["Report"])
def product_defect_results():
    try:
        return {"product_defect_results": product_db.get_product_defect_results()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/defectsummary", tags=["Report"])
def defect_summary():
    try:
        return {"defect_summary": product_db.get_defect_summary()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addreportdefect", tags=["Report"])
def add_report_defect(item: schemas.ReportDefectCreate, db: Session = Depends(get_db)):
    try:
        return ReportDB().add_report_defect(item, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updatereportdefect", tags=["Report"])
def update_report_defect(lotno: str, item: schemas.ReportDefectUpdate, db: Session = Depends(get_db)):
    try:
        return ReportDB().update_report_defect(lotno, item, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addreportproduct", tags=["Report"])
def add_report_product(item: schemas.ReportProductCreate, db: Session = Depends(get_db)):
    try:
        return ReportDB().add_report_product(item, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/updatereportproduct", tags=["Report"])
def update_report_product(productid: str, item: schemas.ReportProductUpdate, db: Session = Depends(get_db)):
    try:
        return ReportDB().update_report_product(productid, item, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/addproductdetail", tags=["Report"])
def add_product_detail(item: schemas.ProductDetailCreate, db: Session = Depends(get_db)):
    try:
        return ReportDB().add_product_detail(item, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deleteuser", tags=["User"])
def delete_user_api(userid: str, db: Session = Depends(get_db)):
    try:
        return UserService.delete_user(userid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deleterole", tags=["Role"])
def delete_role_api(roleid: str, db: Session = Depends(get_db)):
    try:
        return role_db.delete_role(roleid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/update_permission", tags=["Permission"])
def update_permission_api(permissionid: int, perm: schemas.PermissionUpdate, db: Session = Depends(get_db)):
    try:
        return PermissionDB().update_permission(permissionid, perm, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deletepermission", tags=["Permission"])
def delete_permission_api(permissionid: int, db: Session = Depends(get_db)):
    try:
        return permission_db.delete_permission(permissionid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/deleteplanning", tags=["Planning"])
def delete_planning_api(planid: str, db: Session = Depends(get_db)):
    try:
        return PlanningDB().delete_planning(planid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deleteproduct", tags=["Product"])
def delete_product_api(prodid: str, db: Session = Depends(get_db)):
    try:
        return ProductService.delete_product(prodid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deleteprodtype", tags=["ProdType"])
def delete_prodtype_api(prodtypeid: str, db: Session = Depends(get_db)):
    try:
        return ProductService.delete_producttype(prodtypeid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deletedefecttype", tags=["Defect"])
def delete_defecttype_api(defectid: str, db: Session = Depends(get_db)):
    try:
        return DefectDB().delete_defecttype(defectid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/deletecamera", tags=["Camera"])
def delete_camera_api(cameraid: str, db: Session = Depends(get_db)):
    try:
        return CameraService.delete_camera(cameraid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.delete("/deletemodel", tags=["Model"])
def delete_model_api(modelid: str, db: Session = Depends(get_db)):
    try:
        return DetectionModelDB().delete_model(modelid, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# -------------------- Dashboard Service --------------------

# @app.get("/defects-camera")
# def get_defects_with_ng_gt_zero(start: datetime, end: datetime, db: Session = Depends(get_db)):
#     sql = """
#     SELECT 
#         pdr.prodid,
#         pdr.defectid,
#         dt.defecttype,
#         pdr.cameraid,
#         ds.prodlot AS LINE,
#         cam.cameraname,
#         COALESCE(ds.totalng, 0) AS totalng,
#         pdr.defecttime
#     FROM productdefectresult pdr
#     LEFT JOIN defecttype dt ON pdr.defectid = dt.defectid
#     LEFT JOIN camera cam ON pdr.cameraid = cam.cameraid
#     LEFT JOIN defectsummary ds ON pdr.prodid = ds.prodid AND pdr.defectid = ds.defectid
#     WHERE COALESCE(ds.totalng, 0) > 0
#       AND pdr.defecttime BETWEEN :start AND :end
#     """
#     result = db.execute(text(sql), {"start": start, "end": end}).fetchall()
#     return result


@app.get("/defects-camera")
def get_defects_with_ng_gt_zero(start: datetime, end: datetime, db: Session = Depends(get_db)):
  try:
      return dashboard_db.get_defects_with_ng_gt_zero(db)
  except Exception as e:
      raise HTTPException(status_code=500, detail=str(e))
  

# @app.get("/good-ng-ratio")
# def get_good_ng(start: datetime, end: datetime, db : Session = Depends(get_db)):
#     try:
#         return dashboard_db.get_good_ng(db)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/ng-distribution")
# def ng_distribution( dashboard: schemas.Dashboard,db: Session = Depends(get_db)):
#     try:
#         return DashboardDB().ng_distribution(dashboard,db)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/top5-defects")
# def get_top5_defects( dashboard: schemas.Dashboard,db: Session = Depends(get_db)):
#     try:
#         return DashboardDB().get_top5_defects(dashboard,db)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/top5-trends")
# async def get_top_5_trends( dashboard: schemas.Dashboard,db: Session = Depends(get_db)):
#     try:
#         return DashboardDB().get_top_5_trends(dashboard,db)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

# @app.get("/total-product")    
# def get_total_products( dashboard: schemas.Dashboard,db: Session = Depends(get_db)):
#     try:
#         return DashboardDB().get_total_products(dashboard,db)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    

# -------------------- Run Server --------------------
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

