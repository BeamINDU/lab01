from database.connect_to_db import engine, Session, text, SQLAlchemyError
from datetime import datetime
from fastapi import HTTPException
from fastapi.responses import JSONResponse
import database.schemas as schemas


def error_response(code: int, message: str):
    return JSONResponse(
        status_code=code,
        content={"status": code, "detail": {"error": message}}
    )


class ProductDB:
    def _fetch_all(self, query: str):
        try:
            with engine.connect() as conn:
                result = conn.execute(text(query))
                return [dict(row) for row in result.mappings()]
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return []

    def get_products(self):
        return self._fetch_all("SELECT * FROM product WHERE isdeleted = false")
    def get_product_types(self):
        return self._fetch_all("SELECT * FROM prodtype WHERE isdeleted = false")

    def get_defect_types(self):
        return self._fetch_all("SELECT * FROM defecttype WHERE isdeleted = false")

    def get_cameras(self):
        return self._fetch_all("SELECT * FROM camera WHERE isdeleted = false")

    def get_product_defect_results(self):
        return self._fetch_all("SELECT * FROM productdefectresult")

    def get_defect_summary(self):
        return self._fetch_all("SELECT * FROM defectsummary")


class ProductService:
    @staticmethod
    def add_product(product: schemas.ProductCreate, db: Session):
        if db.execute(text("SELECT 1 FROM product WHERE prodid = :prodid"), {"prodid": product.prodid}).first():
            return error_response(400, "Product ID already exists")

        if not db.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                          {"userid": product.createdby}).first():
            return error_response(400, "Invalid user (createdBy)")

        insert_sql = text("""
            INSERT INTO product (
                prodid, prodname, prodtypeid, prodserial, 
                prodstatus, createdby, createddate
            ) VALUES (
                :prodid, :prodname, :prodtypeid, :prodserial,
                :prodstatus, :createdby, :createddate
            )
        """)
        db.execute(insert_sql, {
            "prodid": product.prodid,
            "prodname": product.prodname,
            "prodtypeid": product.prodtypeid,
            "prodserial": product.prodserial,
            "prodstatus": bool(product.prodstatus),
            "createdby": product.createdby,
            "createddate": product.createddate or datetime.now()
        })
        db.commit()
        return JSONResponse(
            status_code=200,
            content={"status": 200, "detail": {"prodid": product.prodid}}
        )

    @staticmethod
    def update_product(prodid: str, product: schemas.ProductUpdate, db: Session):
        if not db.execute(text("SELECT 1 FROM product WHERE prodid = :prodid"), {"prodid": prodid}).first():
            return error_response(404, "Product not found")

        update_fields = {}

        if product.prodtypeid is not None:
            if not db.execute(text("SELECT 1 FROM prodtype WHERE prodtypeid = :prodtypeid"),
                              {"prodtypeid": product.prodtypeid}).first():
                return error_response(400, "Invalid prodtypeid")
            update_fields["prodtypeid"] = product.prodtypeid

        if product.createdby:
            if not db.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                              {"userid": product.createdby}).first():
                return error_response(400, "Invalid user (createdby)")
            update_fields["createdby"] = product.createdby

        if product.prodname is not None:
            update_fields["prodname"] = product.prodname
        if product.prodserial is not None:
            update_fields["prodserial"] = product.prodserial
        if product.prodstatus is not None:
            update_fields["prodstatus"] = product.prodstatus
        if product.updatedby is not None:
            update_fields["updatedby"] = product.updatedby

        update_fields["updateddate"] = product.updateddate or datetime.now()

        if not update_fields:
            return error_response(400, "No fields to update")

        update_fields["prodid"] = prodid
        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "prodid"])

        update_sql = text(f"UPDATE product SET {set_clause} WHERE prodid = :prodid")
        db.execute(update_sql, update_fields)
        db.commit()
        return JSONResponse(
            status_code=200,
            content={"status": 200, "detail": {"prodid": prodid}}
        )

    @staticmethod
    def add_prodtype(prodtype: schemas.ProdTypeCreate, db: Session):
        if db.execute(text("SELECT 1 FROM prodtype WHERE prodtypeid = :prodtypeid"),
                      {"prodtypeid": prodtype.prodtypeid}).first():
            return error_response(400, "Product type ID already exists")

        if not db.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                          {"userid": prodtype.createdby}).first():
            return error_response(400, "Invalid user (createdby)")

        insert_sql = text("""
            INSERT INTO prodtype (
                prodtypeid, prodtype, proddescription, 
                prodstatus, createdby, createddate
            ) VALUES (
                :prodtypeid, :prodtype, :proddescription, 
                :prodstatus, :createdby, :createddate
            )
        """)
        db.execute(insert_sql, {
            "prodtypeid": prodtype.prodtypeid,
            "prodtype": prodtype.prodtype,
            "proddescription": prodtype.proddescription,
            "prodstatus": prodtype.prodstatus,
            "createdby": prodtype.createdby,
            "createddate": prodtype.createddate or datetime.now()
        })
        db.commit()
        return JSONResponse(
            status_code=200,
            content={"status": 200, "detail": {"prodtypeid": prodtype.prodtypeid}}
        )

    @staticmethod
    def update_prodtype(prodtypeid: str, prodtype: schemas.ProdTypeUpdate, db: Session):
        if not db.execute(text("SELECT 1 FROM prodtype WHERE prodtypeid = :prodtypeid"),
                          {"prodtypeid": prodtypeid}).first():
            return error_response(404, "Product type not found")

        update_fields = {}

        if prodtype.prodtype is not None:
            update_fields["prodtype"] = prodtype.prodtype
        if prodtype.proddescription is not None:
            update_fields["proddescription"] = prodtype.proddescription
        if prodtype.prodstatus is not None:
            update_fields["prodstatus"] = prodtype.prodstatus
        if prodtype.updatedby:
            if not db.execute(text("SELECT 1 FROM \"user\" WHERE userid = :userid"),
                              {"userid": prodtype.updatedby}).first():
                return error_response(400, "Invalid user (updatedby)")
            update_fields["updatedby"] = prodtype.updatedby

        update_fields["updateddate"] = prodtype.updateddate or datetime.now()

        if not update_fields:
            return error_response(400, "No fields to update")

        update_fields["prodtypeid"] = prodtypeid
        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "prodtypeid"])

        update_sql = text(f"""
            UPDATE prodtype
            SET {set_clause}
            WHERE prodtypeid = :prodtypeid
        """)
        db.execute(update_sql, update_fields)
        db.commit()
        return JSONResponse(
            status_code=200,
            content={"status": 200, "detail": {"prodtypeid": prodtypeid}}
        )
    
    @staticmethod
    def delete_product(prodid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM product WHERE prodid = :prodid"), {"prodid": prodid}).first():
            raise HTTPException(status_code=404, detail="Product not found")

        db.execute(text("UPDATE product SET isdeleted = true WHERE prodid = :prodid"), {"prodid": prodid})
        db.commit()
        return {"status": 200, "detail": {"message": "Product marked as deleted", "prodid": prodid}}
    
    @staticmethod
    def delete_producttype(prodtypeid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM prodtype WHERE prodtypeid = :prodtypeid"), {"prodtypeid": prodtypeid}).first():
            raise HTTPException(status_code=404, detail="Product type not found")

        db.execute(text("UPDATE prodtype SET isdeleted = true WHERE prodtypeid = :prodtypeid"), {"prodtypeid": prodtypeid})
        db.commit()
        return {"status": 200, "detail": {"message": "Product type marked as deleted", "prodtypeid": prodtypeid}}



