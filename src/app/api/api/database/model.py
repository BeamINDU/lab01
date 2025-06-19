from database.connect_to_db import engine, Session, text, SQLAlchemyError
from fastapi import HTTPException
import database.schemas as schemas
from datetime import datetime

class DetectionModelDB:
    def add_detection_model(self, model: schemas.DetectionModelCreate, db: Session):
        insert_sql = text("""
            INSERT INTO model (
                modelname, modeldescription,
                createdby, createddate
            ) VALUES (
                :modelname, :modeldescription,
                :createdby, :createddate
            )
            RETURNING modelid
        """)

        result = db.execute(insert_sql, {
                "modelname": model.modelname,
                "modeldescription": model.modeldescription,
                "createdby": model.createdby,
                "createddate": model.createddate or datetime.now(),
            })

        db.commit()
        modelid = result.scalar()

        return {"status": "Model created", "modelid": modelid}

    def update_detection_model(self, modelid: str, model: schemas.DetectionModelUpdate, db: Session):
        if not db.execute(text("SELECT 1 FROM model WHERE modelid = :modelid"),
                          {"modelid": modelid}).first():
            raise HTTPException(status_code=404, detail="Model ID not found")

        update_fields = {}

        if model.modelname is not None:
            update_fields["modelname"] = model.modelname
        if model.modeldescription is not None:
            update_fields["modeldescription"] = model.modeldescription  # fix key here to match DB column
        if model.updatedby is not None:
            update_fields["updatedby"] = model.updatedby

        update_fields["updateddate"] = model.updateddate or datetime.now()
        update_fields["modelid"] = modelid

        if len(update_fields) == 1:  # Only 'modelid' present means no fields to update
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "modelid"])
        update_sql = text(f"UPDATE model SET {set_clause} WHERE modelid = :modelid")

        db.execute(update_sql, update_fields)
        db.commit()

        return {"status": "Model updated", "modelid": modelid}

    @staticmethod
    def delete_model(modelid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM model WHERE modelid = :modelid"), {"modelid": modelid}).first():
            raise HTTPException(status_code=404, detail="Model not found")

        db.execute(text("UPDATE model SET isdeleted = true WHERE modelid = :modelid"), {"modelid": modelid})
        db.commit()

        return {"status": 200, "detail": {"message": "Model marked as deleted", "modelid": modelid}}

