from database.connect_to_db import engine, SessionLocal, Session, text, SQLAlchemyError
from datetime import datetime
import database.schemas as schemas
from fastapi import HTTPException
from fastapi.responses import JSONResponse
def error_response(code: int, message: str):
    return JSONResponse(
        status_code=code,
        content={"status": code, "detail": {"error": message}}
    )
class CameraDB:
    def _fetch_all(self, query: str):
        try:
            with engine.connect() as conn:
                result = conn.execute(text(query))
                return [dict(row) for row in result.mappings()]

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return []

    def get_cameras(self):
        return self._fetch_all("SELECT * FROM camera WHERE isdeleted = false")


class CameraService:
    @staticmethod
    def add_camera(camera: schemas.CameraCreate, db: Session):
        if db.execute(text("SELECT 1 FROM camera WHERE cameraid = :cameraid and isdeleted=false"),
                      {"cameraid": camera.cameraid}).first():
            #raise HTTPException(status_code=400, detail="Camera ID already exists")
            return error_response(400, "Camera ID already exists")

        if not db.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                          {"userid": camera.createdby}).first():
            #raise HTTPException(status_code=400, detail="Invalid user (createdby)")
            return error_response(400, "Invalid user")
        insert_sql = text("""
            INSERT INTO camera (
                cameraid, cameraname, cameralocation,
                camerastatus, createdby, createddate
            ) VALUES (
                :cameraid, :cameraname, :cameralocation,
                :camerastatus, :createdby, :createddate
            )
        """)
        db.execute(insert_sql, {
            "cameraid": camera.cameraid,
            "cameraname": camera.cameraname,
            "cameralocation": camera.cameralocation,
            "camerastatus": camera.camerastatus,
            "createdby": camera.createdby,
            "createddate": camera.createddate or datetime.now(),
        })
        db.commit()

        return {"status": "Camera inserted successfully", "cameraid": camera.cameraid}
    
    @staticmethod
    def update_camera(cameraid: str, camera: schemas.CameraUpdate, db: Session):
        if not db.execute(text("SELECT 1 FROM camera WHERE cameraid = :cameraid"),
                        {"cameraid": cameraid}).first():
            #raise HTTPException(status_code=404, detail="Camera not found")
            return error_response(404, "Camera not found")

        update_fields = {}

        if camera.cameraname is not None:
            update_fields["cameraname"] = camera.cameraname
        if camera.cameralocation is not None:
            update_fields["cameralocation"] = camera.cameralocation
        if camera.camerastatus is not None:
            update_fields["camerastatus"] = camera.camerastatus
        if camera.updatedby:
            if not db.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                            {"userid": camera.updatedby}).first():
                #raise HTTPException(status_code=400, detail="Invalid user (updatedby)")
                return error_response(400, "Invalid user")
            update_fields["updatedby"] = camera.updatedby

        update_fields["updateddate"] = camera.updateddate or datetime.now()

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        update_fields["cameraid"] = cameraid
        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "cameraid"])

        update_sql = text(f"""
            UPDATE camera
            SET {set_clause}
            WHERE cameraid = :cameraid
        """)

        db.execute(update_sql, update_fields)
        db.commit()

        return {"status": "Camera updated successfully", "cameraid": cameraid}
    
    @staticmethod
    def delete_camera(cameraid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM camera WHERE cameraid = :cameraid"), {"cameraid": cameraid}).first():
            #raise HTTPException(status_code=404, detail="Camera not found")
            return error_response(404, "Camera not found")

        db.execute(text("UPDATE camera SET isdeleted = true WHERE cameraid = :cameraid"), {"cameraid": cameraid})
        db.commit()
        return {"status": 200, "detail": {"message": "Camera marked as deleted", "cameraid": cameraid}}



