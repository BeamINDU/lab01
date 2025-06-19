from database.connect_to_db import engine, Session, text, SQLAlchemyError
from fastapi import HTTPException
import database.schemas as schemas
from datetime import datetime

class UserDB:
    def _fetch_all(self, query: str):
        try:
            with engine.connect() as conn:
                result = conn.execute(text(query))
                return [dict(row) for row in result.mappings()]
        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            return []

    def get_users(self):
        return self._fetch_all("SELECT * FROM public.\"user\" WHERE isdeleted = false")


class UserService:
    @staticmethod
    def add_user(user: schemas.UserCreate, db: Session):
        # Check if userid already exists
        check_sql = text("SELECT 1 FROM public.\"user\" WHERE userid = :userid")
        if db.execute(check_sql, {"userid": user.userid}).first():
            raise HTTPException(status_code=400, detail="userid already exists")

        # Use ufname/ulname directly
        fname = user.ufname or ""
        lname = user.ulname or ""

        # Lookup roleid from roleName
        roleid = None
        if user.roleid is None and user.roleName:
            role_sql = text("SELECT roleid FROM role WHERE rolename = :rolename")
            role_row = db.execute(role_sql, {"rolename": user.roleName}).first()
            if role_row:
                roleid = role_row.roleid
            else:
                raise HTTPException(status_code=400, detail="Invalid roleName")
        else:
            roleid = user.roleid

        insert_sql = text("""
            INSERT INTO public."user" (
                userid, ufname, ulname, username, upassword, email,
                userstatus, roleid, createdby, createddate
            ) VALUES (
                :userid, :ufname, :ulname, :username, :upassword, :email,
                :userstatus, :roleid, :createdby, :createddate
            )
        """)
        db.execute(insert_sql, {
            "userid": user.userid,
            "ufname": fname,
            "ulname": lname,
            "username": user.username,
            "upassword": user.upassword or "",
            "email": user.email or "",
            "userstatus": bool(user.userstatus),
            "roleid": roleid,
            "createdby": user.createdby,
            "createddate": user.createddate or datetime.now()
        })
        db.commit()
        return {"status": "User inserted successfully", "userid": user.userid}

    @staticmethod
    def edit_user(user: schemas.UserUpdate, db: Session):
        check_sql = text('SELECT 1 FROM public."user" WHERE userid = :userid')
        if not db.execute(check_sql, {"userid": user.userid}).first():
            raise HTTPException(status_code=404, detail="User not found")

        update_fields = {}
        if user.ufname is not None:
            update_fields["ufname"] = user.ufname
        if user.ulname is not None:
            update_fields["ulname"] = user.ulname
        if user.username is not None:
            update_fields["username"] = user.username
        if user.upassword is not None:
            update_fields["upassword"] = user.upassword
        if user.email is not None:
            update_fields["email"] = user.email
        if user.userstatus is not None:
            update_fields["userstatus"] = user.userstatus
        if user.roleid is not None:
            update_fields["roleid"] = user.roleid
        if user.updatedby is not None:
            update_fields["updatedby"] = user.updatedby

        update_fields["updateddate"] = user.updateddate or datetime.now()
        update_fields["userid"] = user.userid

        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")

        set_clause = ", ".join([f"{key} = :{key}" for key in update_fields if key != "userid"])

        update_sql = text(f'''
            UPDATE public."user" SET {set_clause} WHERE userid = :userid
        ''')

        db.execute(update_sql, update_fields)
        db.commit()

        return {"status": "User updated", "userid": user.userid}
    
    @staticmethod
    def delete_user(userid: str, db: Session):
        if not db.execute(text('SELECT 1 FROM public."user" WHERE userid = :userid'), {"userid": userid}).first():
            raise HTTPException(status_code=404, detail="User not found")

        update_sql = text('UPDATE public."user" SET isdeleted = true WHERE userid = :userid')
        db.execute(update_sql, {"userid": userid})
        db.commit()

        return {"status": 200, "detail": {"userid": userid}}



