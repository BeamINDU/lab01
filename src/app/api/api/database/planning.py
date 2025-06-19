from database.connect_to_db import engine, Session, text, SQLAlchemyError
from fastapi import HTTPException
from datetime import datetime
import database.schemas as schemas

class PlanningDB:
    def _fetch_all(self, query: str):
        try:
            with engine.connect() as conn:
                result = conn.execute(text(query))
                return [dict(row) for row in result.mappings()]
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return []

    def get_planning(self):
        return self._fetch_all("SELECT * FROM public.planning")

    def add_planning(self, plan: schemas.PlanningCreate, db: Session):
        if db.execute(text("SELECT 1 FROM planning WHERE planid = :planid"),
                      {"planid": plan.planid}).first():
            raise HTTPException(status_code=400, detail="Plan ID already exists")
 
        insert_sql = text("""
            INSERT INTO planning (
                planid, prodid, prodlot, prodline, quantity, startdatetime, enddatetime,
                createdby
            ) VALUES (
                :planid, :prodid, :prodlot, :prodline, :quantity, :startdatetime, :enddatetime,
                :createdby
            )
        """)
 
        db.execute(insert_sql, {
            "planid": plan.planid,
            "prodid": plan.prodid,
            "prodlot": plan.prodlot,
            "prodline": plan.prodline,
            "quantity": plan.quantity,
            "startdatetime": plan.startdatetime,
            "enddatetime": plan.enddatetime,
            "createdby": plan.createdby,
            # "createddate": plan.createddate or datetime.now(),
            # "updatedby": plan.updatedby,
            # "updateddate": plan.updateddate,
            # "iscreatemode": plan.iscreatemode
        })
        db.commit()
        return {"status": "Planning created", "planid": plan.planid}

    def update_planning(self, planid: str, plan: schemas.PlanningUpdate, db: Session):
        if not db.execute(text("SELECT 1 FROM planning WHERE planid = :planid"),
                          {"planid": planid}).first():
            raise HTTPException(status_code=404, detail="Plan ID not found")

        update_fields = {}

        if plan.prodid: update_fields["prodid"] = plan.prodid
        if plan.prodlot: update_fields["prodlot"] = plan.prodlot
        if plan.prodline: update_fields["prodline"] = plan.prodline
        if plan.startdatetime: update_fields["startdatetime"] = plan.startdatetime
        if plan.enddatetime: update_fields["enddatetime"] = plan.enddatetime
        if plan.updatedby: update_fields["updatedby"] = plan.updatedby
        # if plan.iscreatemode is not None: update_fields["iscreatemode"] = plan.iscreatemode

        update_fields["updateddate"] = plan.updateddate or datetime.now()
        update_fields["planid"] = planid

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "planid"])
        update_sql = text(f"UPDATE planning SET {set_clause} WHERE planid = :planid")

        db.execute(update_sql, update_fields)
        db.commit()
        return {"status": "Planning updated", "planid": planid}
    
    @staticmethod
    def delete_planning(planid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM planning WHERE planid = :planid"), {"planid": planid}).first():
            raise HTTPException(status_code=404, detail="Planning not found")

        db.execute(text("UPDATE planning SET isdeleted = true WHERE planid = :planid"), {"planid": planid})
        db.commit()
        return {"status": 200, "detail": {"message": "Planning marked as deleted", "planid": planid}}


