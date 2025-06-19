from database.connect_to_db import engine, Session, text, SQLAlchemyError
from fastapi import HTTPException
from datetime import datetime
import database.schemas as schemas

class RoleDB:
    def get_roles(self):
        try:
            with engine.connect() as conn:
                result = conn.execute(text("SELECT * FROM role"))
                return [dict(row) for row in result.mappings()]
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return []
        
    def add_role(self, role: schemas.RoleCreate, db: Session):
        # if db.execute(text("SELECT 1 FROM role WHERE roleid = :roleid"), {"roleid": role.roleid}).first():
        #    raise HTTPException(status_code=400, detail="Role ID already exists")

        insert_sql = text("""
            INSERT INTO role (
                rolename, roledescription, rolestatus,
                createdby, createddate
            ) VALUES (
                :rolename, :roledescription, :rolestatus,
                :createdby, :createddate
            )
        """)

        db.execute(insert_sql, {
            "rolename": role.rolename,
            "roledescription": role.roledescription,
            "rolestatus": role.rolestatus,
            "createdby": role.createdby,
            "createddate": role.createddate or datetime.now(),
        })
        db.commit()
        query = text("SELECT roleid, createddate FROM role ORDER BY roleid DESC LIMIT 1")
        row = db.execute(query).first()
        return {"status": "Role created", "roleid": row.roleid, "createddate": row.createddate}

    def update_role(self, roleid: str, role: schemas.RoleUpdate, db: Session):
        if not db.execute(text("SELECT 1 FROM role WHERE roleid = :roleid"), {"roleid": roleid}).first():
            raise HTTPException(status_code=404, detail="Role not found")

        update_fields = role.dict(exclude_unset=True)
        update_fields["updateddate"] = role.updateddate or datetime.now()
        update_fields["roleid"] = roleid

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "roleid"])
        update_sql = text(f"UPDATE role SET {set_clause} WHERE roleid = :roleid")

        db.execute(update_sql, update_fields)
        db.commit()
        return {"status": "Role updated", "roleId": roleid}
    
    @staticmethod
    def delete_role(roleid: str, db: Session):
        if not db.execute(text("SELECT 1 FROM role WHERE roleid = :roleid"), {"roleid": roleid}).first():
            raise HTTPException(status_code=404, detail="Role not found")

        update_sql = text("UPDATE role SET isdeleted = true WHERE roleid = :roleid")
        db.execute(update_sql, {"roleid": roleid})
        db.commit()

        return {"status": 200, "detail": {"roleid": roleid}}



