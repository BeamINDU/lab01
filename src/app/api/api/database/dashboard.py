from database.connect_to_db import engine, SessionLocal, Session, text, SQLAlchemyError
from datetime import datetime
import database.schemas as schemas
from fastapi import HTTPException
from fastapi.responses import JSONResponse

class DashboardDB:
    def get_defects_with_ng_gt_zero(self, start:datetime, end:datetime, db: Session ):
        sql = """
        SELECT 
            pdr.prodid,
            pdr.defectid,
            dt.defecttype,
            pdr.cameraid,
            ds.prodlot AS LINE,
            cam.cameraname,
            COALESCE(ds.totalng, 0) AS totalng,
            pdr.defecttime
        FROM productdefectresult pdr
        LEFT JOIN defecttype dt ON pdr.defectid = dt.defectid
        LEFT JOIN camera cam ON pdr.cameraid = cam.cameraid
        LEFT JOIN defectsummary ds ON pdr.prodid = ds.prodid AND pdr.defectid = ds.defectid
        WHERE COALESCE(ds.totalng, 0) > 0
        AND pdr.defecttime BETWEEN :start AND :end
        """
        result = db.execute(sql, {
    "start": start,
    "end": end
}).fetchall()
        return [dict(row._mapping) for row in result]


    def get_good_ng(self, 
        # start: datetime,
        # end: datetime,
        # productname: Optional[str] = Query(None),
        # prodline: Optional[str] = Query(None),
        # cameraid: Optional[str] = Query(None), 
        db: Session):
        sql = """
        SELECT
            p.prodname,
            p.cameraid,
            ds.prodlot as line,
            ds.total_ok,
            ds.total_ng,
            ROUND(ds.total_ok::numeric * 100 / NULLIF(ds.total_ok + ds.total_ng, 0), 2) AS ok_ratio_percent,
            ROUND(ds.total_ng::numeric * 100 / NULLIF(ds.total_ok + ds.total_ng, 0), 2) AS ng_ratio_percent
        FROM (
            SELECT
                prodid,
                prodlot,
                SUM(totalok) AS total_ok,
                SUM(totalng) AS total_ng
            FROM public.defectsummary
            GROUP BY prodid, prodlot
        ) ds
        INNER JOIN (
            SELECT DISTINCT prodid, prodname, cameraid
            FROM public.productdefectresult
            --WHERE defecttime BETWEEN :start AND :end
        ) p ON ds.prodid = p.prodid
        """
        result = db.execute(sql, {
        # "start": start,
        # "end": end
        # "prodlot": prodline,
        # "productname": productname,
        # "cameraid": cameraid
    }).fetchall()
        return [dict(row._mapping) for row in result]


    def ng_distribution(self, start:datetime, end:datetime, db: Session):
        sql = """
            SELECT 
                pdr.defecttype,
                pdr.prodname,
                ds.prodlot as line,
                DATE_TRUNC('hour', pdr.defecttime) AS hour_slot,
                COUNT(*) AS defect_count
            FROM public.productdefectresult pdr
            LEFT JOIN public.defectsummary ds ON pdr.prodid = ds.prodid
            WHERE pdr.defecttime BETWEEN :start AND :end
            AND (:productname IS NULL OR pdr.prodname = :productname)
            AND (:prodline IS NULL OR ds.prodlot = :prodline)
            AND (:cameraid IS NULL OR pdr.cameraid = :cameraid)
            GROUP BY pdr.defecttype, hour_slot, pdr.prodname, ds.prodlot
            ORDER BY hour_slot, pdr.defecttype;
        """
        result = db.execute(text(sql), {model}).fetchall()
        return [dict(row._mapping) for row in result]


    def get_top5_defects(self, start:datetime, end:datetime , db: Session ):
        sql = """
            SELECT
                pdr.defecttype,
                ds.prodlot AS line,
                COUNT(*) AS quantity,
                ARRAY_AGG(pdr.defecttime ORDER BY pdr.defecttime) AS all_defect_times
            FROM public.productdefectresult pdr
            LEFT JOIN public.defectsummary ds ON pdr.prodid = ds.prodid 
            WHERE pdr.defecttime BETWEEN :start AND :end
            AND (:productname IS NULL OR pdr.prodname = :productname)
            AND (:prodline IS NULL OR ds.prodlot = :prodline)
            AND (:cameraid IS NULL OR pdr.cameraid = :cameraid)
            GROUP BY pdr.defecttype, ds.prodlot
            ORDER BY quantity DESC
            LIMIT 5;
        """
        
        result = db.execute(text(sql), {model}).fetchall()

        return [dict(row._mapping) for row in result]


    async def get_top_5_trends(self, start:datetime, end:datetime, db: Session  ):
        sql = """
        SELECT 
            pdr.defecttype,
            ds.prodlot as line,
            DATE_TRUNC('hour', pdr.defecttime) AS hour_slot,
            COUNT(*) AS quantity
        FROM public.productdefectresult pdr
        LEFT JOIN public.defectsummary ds ON pdr.prodid = ds.prodid 
        WHERE pdr.defecttime BETWEEN :start AND :end
        AND (:productname IS NULL OR pdr.prodname = :productname)
        AND (:prodline IS NULL OR ds.prodlot = :prodline)
        AND (:cameraid IS NULL OR pdr.cameraid = :cameraid)
        AND pdr.defecttype IN (
            SELECT pdr2.defecttype
            FROM public.productdefectresult pdr2
            LEFT JOIN public.defectsummary ds2 ON pdr2.prodid = ds2.prodid 
            WHERE pdr2.defecttime BETWEEN :start AND :end
            AND (:productname IS NULL OR pdr2.prodname = :productname)
            AND (:prodline IS NULL OR ds2.prodlot = :prodline)
            AND (:cameraid IS NULL OR pdr2.cameraid = :cameraid)
            GROUP BY pdr2.defecttype
            ORDER BY COUNT(*) DESC
            LIMIT 5
        )
        GROUP BY pdr.defecttype, hour_slot, ds.prodlot
        ORDER BY hour_slot, pdr.defecttype;
        """
        result = db.execute(text(sql), {model}).fetchall()
        
        return [dict(row._mapping) for row in result]


    def get_total_products(self, start:datetime, end:datetime, db: Session ):
        sql = """
        SELECT 
            COUNT(DISTINCT pdr.prodid) as total_products
        FROM public.productdefectresult pdr
        LEFT JOIN public.defectsummary ds ON pdr.prodid = ds.prodid
        WHERE pdr.defecttime BETWEEN :start AND :end
        AND (:productname IS NULL OR pdr.prodname = :productname)
        AND (:prodline IS NULL OR ds.prodlot = :prodline)
        AND (:cameraid IS NULL OR pdr.cameraid = :cameraid)
        """
        
        result = db.execute(text(sql), {model}).fetchone()
        return {"total_products": result[0] if result else 0}


    # New endpoints for dropdown data

    def get_products_list(db: Session):
      try:
          sql = "SELECT DISTINCT prodname FROM productdefectresult WHERE prodname IS NOT NULL ORDER BY prodname"
          result = db.execute(text(sql)).fetchall()
          return [{"id": row[0], "name": row[0]} for row in result]
      except Exception as e:
          return {"error": str(e)}


    def get_cameras_list(db: Session):
      try:
          sql = """
          SELECT DISTINCT 
              pdr.cameraid,
              COALESCE(cam.cameraname, pdr.cameraid) as cameraname
          FROM productdefectresult pdr
          LEFT JOIN camera cam ON pdr.cameraid = cam.cameraid
          WHERE pdr.cameraid IS NOT NULL 
          ORDER BY pdr.cameraid
          """
          result = db.execute(text(sql)).fetchall()
          return [{"id": row[0], "name": row[1]} for row in result]
      except Exception as e:
          return {"error": str(e)}


    def get_lines_list(db: Session):
      try:
          sql = """
          SELECT DISTINCT ds.prodlot 
          FROM defectsummary ds 
          WHERE ds.prodlot IS NOT NULL 
          ORDER BY ds.prodlot
          """
          result = db.execute(text(sql)).fetchall()
          return [{"id": row[0], "name": row[0]} for row in result]
      except Exception as e:
          return {"error": str(e)}