from database.connect_to_db import engine, SessionLocal, Session, text, SQLAlchemyError
from fastapi import HTTPException
import database.schemas as schemas
from datetime import datetime

class DefectDB:
    def get_defect_types(self):
        try:
            with engine.connect() as conn:
                result = conn.execute(text("SELECT * FROM defecttype WHERE isdeleted = false"))
                return [dict(row) for row in result.mappings()]
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return []
        
    def add_defect_type(self, defect: schemas.DefectTypeCreate):
        try:
            with engine.connect() as conn:
                check_sql = text("SELECT 1 FROM defecttype WHERE defectid = :defectid")
                if conn.execute(check_sql, {"defectid": defect.defectid}).first():
                    raise HTTPException(status_code=400, detail="Defect ID already exists")

                insert_sql = text("""
                    INSERT INTO public.defecttype (
                        defectid, defecttype, defectdescription,
                        defectstatus, createdby, createddate,
                        updatedby, updateddate
                    ) VALUES (
                        :defectid, :defecttype, :defectdescription,
                        :defectstatus, :createdby, :createddate,
                        :updatedby, :updateddate
                    )
                """)
                conn.execute(insert_sql, {
                    "defectid": defect.defectid,
                    "defecttype": defect.defecttype,
                    "defectdescription": defect.defectdescription,
                    "defectstatus": defect.defectstatus,
                    "createdby": defect.createdby,
                    "createddate": defect.createddate or datetime.now(),
                    "updatedby": defect.updatedby,
                    "updateddate": defect.updateddate
                })
                conn.commit()

            return {"status": "Defect type added", "defectid": defect.defectid}

        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def update_defect_type(self, defectid: str, defect: schemas.DefectTypeUpdate):
        try:
            with engine.connect() as conn:
                # Check if defect type exists
                if not conn.execute(text("SELECT 1 FROM defecttype WHERE defectid = :defectid"),
                                    {"defectid": defectid}).first():
                    raise HTTPException(status_code=404, detail="Defect type not found")

                update_fields = {}

                if defect.defecttype is not None:
                    update_fields["defecttype"] = defect.defecttype
                if defect.defectdescription is not None:
                    update_fields["defectdescription"] = defect.defectdescription
                if defect.defectstatus is not None:
                    update_fields["defectstatus"] = defect.defectstatus
                if defect.updatedby:
                    if not conn.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                                        {"userid": defect.updatedby}).first():
                        raise HTTPException(status_code=400, detail="Invalid user (updatedby)")
                    update_fields["updatedby"] = defect.updatedby

                update_fields["updateddate"] = defect.updateddate or datetime.now()

                if not update_fields:
                    raise HTTPException(status_code=400, detail="No fields to update")

                update_fields["defectid"] = defectid
                set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "defectid"])

                update_sql = text(f"""
                    UPDATE defecttype
                    SET {set_clause}
                    WHERE defectid = :defectid
                """)

                conn.execute(update_sql, update_fields)
                conn.commit()

            return {"status": "Defect type updated successfully", "defectid": defectid}

        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    @staticmethod
    def delete_defecttype(defectid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM defecttype WHERE defectid = :defectid"), {"defectid": defectid}).first():
            raise HTTPException(status_code=404, detail="Defect type not found")

        db.execute(text("UPDATE defecttype SET isdeleted = true WHERE defectid = :defectid"), {"defectid": defectid})
        db.commit()
        return {"status": 200, "detail": {"message": "Defect type marked as deleted", "defectid": defectid}}



