from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import Response, StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from urllib.parse import quote

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import storage
from docx_gen import build_docx
from report_xlsx import build_report_xlsx

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

PACKAGE_PRICES = {"A": 150000, "B": 180000, "C": 220000}
FOOD_RATE, BEV_RATE, DEFAULT_UANG_HADIR, CONTRACT_PER_PAX = 0.35, 0.10, 80000, 5000
ALLOWED_IMAGE = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 8 * 1024 * 1024


def now_iso():
    return datetime.now(timezone.utc).isoformat()


class ProposalIn(BaseModel):
    client_name: str
    client_contact: Optional[str] = ""
    contact_type: Optional[str] = "WeChat"
    date: Optional[str] = ""
    prepared_by: Optional[str] = "Hendri (Ko Aby) — Owner, Brother Seafood Bali"
    notes: Optional[str] = ""


class Proposal(ProposalIn):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class VisitIn(BaseModel):
    ta_name: str
    date: str
    pax: int = Field(ge=1)
    rate_type: str = "contract"
    package: str = "A"
    food_bill: float = Field(ge=0, default=0)
    beverage_bill: float = Field(ge=0, default=0)
    uang_hadir: float = Field(ge=0, default=DEFAULT_UANG_HADIR)
    paid: bool = False
    notes: Optional[str] = ""


class Visit(VisitIn):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    commission_food: float = 0
    commission_bev: float = 0
    commission_total: float = 0
    created_at: str = Field(default_factory=now_iso)


class VisitPatch(BaseModel):
    paid: Optional[bool] = None




class ReservationIn(BaseModel):
    date: str
    time: str
    guest_name: str
    phone: Optional[str] = ""
    pax: int = Field(ge=1)
    table_area: Optional[str] = ""
    guide_name: Optional[str] = ""
    travel_agent: Optional[str] = ""
    package: Optional[str] = ""
    status: str = "Pending"
    special_request: Optional[str] = ""
    notes: Optional[str] = ""


class Reservation(ReservationIn):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class ReservationPatch(BaseModel):
    date: Optional[str] = None
    time: Optional[str] = None
    guest_name: Optional[str] = None
    phone: Optional[str] = None
    pax: Optional[int] = Field(default=None, ge=1)
    table_area: Optional[str] = None
    guide_name: Optional[str] = None
    travel_agent: Optional[str] = None
    package: Optional[str] = None
    status: Optional[str] = None
    special_request: Optional[str] = None
    notes: Optional[str] = None


class GalleryItem(BaseModel):
    id: str
    path: str
    caption: str = ""
    content_type: str = "image/jpeg"


class Settings(BaseModel):
    logo_path: Optional[str] = None
    gallery: List[GalleryItem] = []


def compute_visit(v: VisitIn) -> Visit:
    if v.rate_type == "contract":
        data = {**v.model_dump(), "uang_hadir": 0}
        cf = CONTRACT_PER_PAX * v.pax
        return Visit(**data, commission_food=cf, commission_bev=0, commission_total=cf)
    cf = round(v.food_bill * FOOD_RATE)
    cb = round(v.beverage_bill * BEV_RATE)
    return Visit(**v.model_dump(), commission_food=cf, commission_bev=cb, commission_total=cf + cb + v.uang_hadir)


async def get_settings() -> Settings:
    doc = await db.settings.find_one({"_id": "main"}, {"_id": 0})
    return Settings(**doc) if doc else Settings()


async def save_settings(s: Settings):
    await db.settings.update_one({"_id": "main"}, {"$set": s.model_dump()}, upsert=True)


@app.on_event("startup")
async def startup():
    try:
        await asyncio.to_thread(storage.init_storage)
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    if await db.proposals.count_documents({}) == 0:
        seed = Proposal(client_name="Mr. Xu", client_contact="KOABY805", contact_type="WeChat", date="")
        await db.proposals.insert_one(seed.model_dump())


@api_router.get("/")
async def root():
    return {"message": "Brother Seafood Bali API"}


@api_router.get("/proposals", response_model=List[Proposal])
async def list_proposals():
    return await db.proposals.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.post("/proposals", response_model=Proposal)
async def create_proposal(data: ProposalIn):
    p = Proposal(**data.model_dump())
    await db.proposals.insert_one(p.model_dump())
    return p


@api_router.get("/proposals/{pid}", response_model=Proposal)
async def get_proposal(pid: str):
    doc = await db.proposals.find_one({"id": pid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Proposal not found")
    return doc


@api_router.put("/proposals/{pid}", response_model=Proposal)
async def update_proposal(pid: str, data: ProposalIn):
    upd = {**data.model_dump(), "updated_at": now_iso()}
    res = await db.proposals.update_one({"id": pid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Proposal not found")
    return await db.proposals.find_one({"id": pid}, {"_id": 0})


@api_router.delete("/proposals/{pid}")
async def delete_proposal(pid: str):
    res = await db.proposals.delete_one({"id": pid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Proposal not found")
    return {"ok": True}


@api_router.get("/proposals/{pid}/docx")
async def proposal_docx(pid: str):
    doc = await db.proposals.find_one({"id": pid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Proposal not found")
    s = await get_settings()
    logo = None
    if s.logo_path:
        try:
            logo, _ = await asyncio.to_thread(storage.get_object, s.logo_path)
        except Exception as e:
            logger.warning(f"logo fetch failed: {e}")
    gallery = []
    for g in s.gallery:
        try:
            data, _ = await asyncio.to_thread(storage.get_object, g.path)
            gallery.append((data, g.caption))
        except Exception as e:
            logger.warning(f"gallery fetch failed: {e}")
    buf = await asyncio.to_thread(build_docx, doc, logo, gallery)
    safe = "".join(c if c.isalnum() else "-" for c in doc["client_name"]).strip("-") or "TravelAgent"
    fname = f"Proposal-BrotherSeafoodBali-{safe}.docx"
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename=\"{fname}\"; filename*=UTF-8''{quote(fname)}"},
    )


@api_router.get("/visits", response_model=List[Visit])
async def list_visits():
    return await db.visits.find({}, {"_id": 0}).sort("date", -1).to_list(2000)


@api_router.post("/visits", response_model=Visit)
async def create_visit(data: VisitIn):
    v = compute_visit(data)
    await db.visits.insert_one(v.model_dump())
    return v


@api_router.patch("/visits/{vid}", response_model=Visit)
async def patch_visit(vid: str, data: VisitPatch):
    upd = {k: v for k, v in data.model_dump().items() if v is not None}
    res = await db.visits.update_one({"id": vid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Visit not found")
    return await db.visits.find_one({"id": vid}, {"_id": 0})


@api_router.delete("/visits/{vid}")
async def delete_visit(vid: str):
    res = await db.visits.delete_one({"id": vid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Visit not found")
    return {"ok": True}


@api_router.get("/visits/summary")
async def visits_summary():
    visits = await db.visits.find({}, {"_id": 0}).to_list(5000)
    by_ta = {}
    totals = {"visits": 0, "pax": 0, "bill": 0, "commission": 0, "unpaid": 0}
    for v in visits:
        t = by_ta.setdefault(v["ta_name"], {"ta_name": v["ta_name"], "visits": 0, "pax": 0, "bill": 0, "commission": 0, "unpaid": 0, "last_visit": ""})
        bill = v["food_bill"] + v["beverage_bill"]
        t["visits"] += 1
        t["pax"] += v["pax"]
        t["bill"] += bill
        t["commission"] += v["commission_total"]
        if not v.get("paid"):
            t["unpaid"] += v["commission_total"]
        t["last_visit"] = max(t["last_visit"], v["date"])
        totals["visits"] += 1
        totals["pax"] += v["pax"]
        totals["bill"] += bill
        totals["commission"] += v["commission_total"]
        if not v.get("paid"):
            totals["unpaid"] += v["commission_total"]
    agents = sorted(by_ta.values(), key=lambda x: -x["pax"])
    return {"totals": totals, "agents": agents, "package_prices": PACKAGE_PRICES, "rates": {"food": FOOD_RATE, "bev": BEV_RATE, "uang_hadir": DEFAULT_UANG_HADIR, "contract_per_pax": CONTRACT_PER_PAX}}


@api_router.get("/reservations", response_model=List[Reservation])
async def list_reservations(month: Optional[str] = None, guide: Optional[str] = None, travel_agent: Optional[str] = None, status: Optional[str] = None):
    q = {}
    if month:
        q["date"] = {"$regex": f"^{month}"}
    if guide:
        q["guide_name"] = guide
    if travel_agent:
        q["travel_agent"] = travel_agent
    if status:
        q["status"] = status
    return await db.reservations.find(q, {"_id": 0}).sort([("date", 1), ("time", 1)]).to_list(10000)


@api_router.post("/reservations", response_model=Reservation)
async def create_reservation(data: ReservationIn):
    r = Reservation(**data.model_dump())
    await db.reservations.insert_one(r.model_dump())
    return r


@api_router.put("/reservations/{rid}", response_model=Reservation)
async def update_reservation(rid: str, data: ReservationIn):
    upd = {**data.model_dump(), "updated_at": now_iso()}
    res = await db.reservations.update_one({"id": rid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Reservation not found")
    return await db.reservations.find_one({"id": rid}, {"_id": 0})


@api_router.patch("/reservations/{rid}", response_model=Reservation)
async def patch_reservation(rid: str, data: ReservationPatch):
    upd = {k: v for k, v in data.model_dump().items() if v is not None}
    upd["updated_at"] = now_iso()
    res = await db.reservations.update_one({"id": rid}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(404, "Reservation not found")
    return await db.reservations.find_one({"id": rid}, {"_id": 0})


@api_router.delete("/reservations/{rid}")
async def delete_reservation(rid: str):
    res = await db.reservations.delete_one({"id": rid})
    if res.deleted_count == 0:
        raise HTTPException(404, "Reservation not found")
    return {"ok": True}


@api_router.get("/reservations/summary")
async def reservations_summary(month: Optional[str] = None, guide: Optional[str] = None, travel_agent: Optional[str] = None):
    q = _month_filter(month)
    if guide: q["guide_name"] = guide
    if travel_agent: q["travel_agent"] = travel_agent
    rows = await db.reservations.find(q, {"_id": 0}).to_list(10000)
    totals = {"reservations": len(rows), "pax": sum(r.get("pax",0) for r in rows), "confirmed": 0, "completed": 0, "cancelled": 0, "no_show": 0, "pending": 0}
    by_guide, by_ta = {}, {}
    for r in rows:
        st = r.get("status", "Pending").lower().replace(" ", "_")
        if st in totals: totals[st] += 1
        if r.get("guide_name"):
            x=by_guide.setdefault(r["guide_name"], {"name":r["guide_name"],"reservations":0,"pax":0})
            x["reservations"] += 1; x["pax"] += r.get("pax",0)
        if r.get("travel_agent"):
            x=by_ta.setdefault(r["travel_agent"], {"name":r["travel_agent"],"reservations":0,"pax":0})
            x["reservations"] += 1; x["pax"] += r.get("pax",0)
    months=sorted({r["date"][:7] for r in await db.reservations.find({}, {"_id":0,"date":1}).to_list(10000)}, reverse=True)
    return {"totals":totals,"guides":sorted(by_guide.values(), key=lambda x:-x["pax"]),"travel_agents":sorted(by_ta.values(), key=lambda x:-x["pax"]),"available_months":months}


@api_router.get("/settings", response_model=Settings)
async def read_settings():
    return await get_settings()


def _month_filter(month: Optional[str]):
    if not month:
        return {}
    try:
        datetime.strptime(month, "%Y-%m")
    except ValueError:
        raise HTTPException(400, "month must be YYYY-MM")
    return {"date": {"$regex": f"^{month}"}}


def aggregate_report(visits: list):
    by_ta = {}
    keys = ["visits", "pax", "food_bill", "beverage_bill", "bill", "commission", "paid", "unpaid"]
    totals = {k: 0 for k in keys}
    for v in visits:
        t = by_ta.setdefault(v["ta_name"], {"ta_name": v["ta_name"], **{k: 0 for k in keys}})
        inc = {"visits": 1, "pax": v["pax"], "food_bill": v["food_bill"], "beverage_bill": v["beverage_bill"],
               "bill": v["food_bill"] + v["beverage_bill"], "commission": v["commission_total"],
               "paid": v["commission_total"] if v.get("paid") else 0, "unpaid": 0 if v.get("paid") else v["commission_total"]}
        for k, val in inc.items():
            t[k] += val
            totals[k] += val
    return sorted(by_ta.values(), key=lambda x: -x["commission"]), totals


@api_router.get("/reports/monthly")
async def monthly_report(month: Optional[str] = None):
    visits = await db.visits.find(_month_filter(month), {"_id": 0}).sort("date", 1).to_list(5000)
    agents, totals = aggregate_report(visits)
    months = sorted({v["date"][:7] for v in await db.visits.find({}, {"_id": 0, "date": 1}).to_list(5000)}, reverse=True)
    return {"month": month, "agents": agents, "totals": totals, "visits": visits, "available_months": months}


@api_router.get("/reports/monthly.xlsx")
async def monthly_report_xlsx(month: Optional[str] = None):
    visits = await db.visits.find(_month_filter(month), {"_id": 0}).sort("date", 1).to_list(5000)
    agents, totals = aggregate_report(visits)
    label = month or "All time"
    buf = await asyncio.to_thread(build_report_xlsx, label, agents, visits, totals)
    fname = f"Commission-Report-{(month or 'all-time')}.xlsx"
    return StreamingResponse(buf, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                             headers={"Content-Disposition": f"attachment; filename=\"{fname}\""})


async def _upload_image(file: UploadFile, folder: str) -> tuple:
    if file.content_type not in ALLOWED_IMAGE:
        raise HTTPException(400, "Only JPG, PNG, WEBP or GIF images are allowed")
    data = await file.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "Image too large (max 8MB)")
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "jpg"
    path = f"{storage.APP_NAME}/{folder}/{uuid.uuid4()}.{ext}"
    try:
        result = await asyncio.to_thread(storage.put_object, path, data, file.content_type)
    except Exception as e:
        logger.error(f"upload failed: {e}")
        raise HTTPException(502, "Upload to storage failed")
    await db.files.insert_one({"id": str(uuid.uuid4()), "storage_path": result["path"], "original_filename": file.filename,
                               "content_type": file.content_type, "size": result.get("size", len(data)), "is_deleted": False, "created_at": now_iso()})
    return result["path"], file.content_type


@api_router.post("/settings/logo", response_model=Settings)
async def upload_logo(file: UploadFile = File(...)):
    path, _ = await _upload_image(file, "logo")
    s = await get_settings()
    s.logo_path = path
    await save_settings(s)
    return s


@api_router.delete("/settings/logo", response_model=Settings)
async def remove_logo():
    s = await get_settings()
    s.logo_path = None
    await save_settings(s)
    return s


@api_router.post("/settings/gallery", response_model=Settings)
async def upload_gallery(file: UploadFile = File(...), caption: str = Form("")):
    path, ctype = await _upload_image(file, "gallery")
    s = await get_settings()
    s.gallery.append(GalleryItem(id=str(uuid.uuid4()), path=path, caption=caption, content_type=ctype))
    await save_settings(s)
    return s


@api_router.delete("/settings/gallery/{gid}", response_model=Settings)
async def remove_gallery(gid: str):
    s = await get_settings()
    s.gallery = [g for g in s.gallery if g.id != gid]
    await save_settings(s)
    return s


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    rec = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not rec:
        raise HTTPException(404, "File not found")
    try:
        data, ctype = await asyncio.to_thread(storage.get_object, path)
    except Exception as e:
        logger.error(f"file fetch failed: {e}")
        raise HTTPException(502, "Storage fetch failed")
    return Response(content=data, media_type=rec.get("content_type", ctype), headers={"Cache-Control": "public, max-age=86400"})


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
