from database.connect_to_db import engine, Session, text, SQLAlchemyError
from fastapi import HTTPException
import database.schemas as schemas
from datetime import datetime


class ReportDB:
    def add_report_defect(self, item: schemas.ReportDefectCreate, db: Session):
        try:
            db.execute(text("""
                INSERT INTO defectsummary (lotno, producttype, defecttype, total, ok, ng)
                VALUES (:lotno, :producttype, :defecttype, :total, :ok, :ng)
            """), item.dict(by_alias=True))
            db.commit()
            return {"status": "DefectSummary added", "lotNo": item.lotno}
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))

    def update_report_defect(self, lotno: str, item: schemas.ReportDefectUpdate, db: Session):
        try:
            update_fields = item.dict(exclude_unset=True, by_alias=True)
            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            update_fields["lotno"] = lotno
            set_clause = ", ".join([f"{k} = :{k}" for k in update_fields if k != "lotno"])
            db.execute(text(f"""
                UPDATE defectsummary SET {set_clause} WHERE lotno = :lotno
            """), update_fields)
            db.commit()
            return {"status": "DefectSummary updated", "lotNo": lotno}
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))

    def add_report_product(self, item: schemas.ReportProductCreate, db: Session):
        try:
            db.execute(text("""
                INSERT INTO productdefectresult (
                    datetime, productid, productname, lotno, status, defecttype, cameraid
                ) VALUES (
                    :datetime, :productid, :productname, :lotno, :status, :defecttype, :cameraid
                )
            """), item.dict(by_alias=True))
            db.commit()
            return {"status": "ProductDefectResult added", "productId": item.productid}
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))

    def update_report_product(self, productid: str, item: schemas.ReportProductUpdate, db: Session):
        try:
            update_fields = item.dict(exclude_unset=True, by_alias=True)
            if not update_fields:
                raise HTTPException(status_code=400, detail="No fields to update")
            update_fields["productid"] = productid
            set_clause = ", ".join([f"{k} = :{k}" for k in update_fields if k != "productid"])
            db.execute(text(f"""
                UPDATE productdefectresult SET {set_clause} WHERE productid = :productid
            """), update_fields)
            db.commit()
            return {"status": "ProductDefectResult updated", "productId": productid}
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))

    def add_product_detail(self, item: schemas.ProductDetailCreate, db: Session):
        try:
            db.execute(text("""
                INSERT INTO productdetail (
                    productid, productname, serialno, date, time, lotno,
                    defecttype, cameraid, status, comment
                ) VALUES (
                    :productid, :productname, :serialno, :date, :time, :lotno,
                    :defecttype, :cameraid, :status, :comment
                )
            """), item.dict(exclude={"history"}, by_alias=True))

            for h in item.history:
                db.execute(text("""
                    INSERT INTO history (date, time, updatedby, productid)
                    VALUES (:date, :time, :updatedby, :productid)
                """), {**h.dict(by_alias=True), "productid": item.productid})

            db.commit()
            return {"status": "ProductDetail added", "productId": item.productid}
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail=str(e))

