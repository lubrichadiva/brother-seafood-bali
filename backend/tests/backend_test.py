"""Backend tests for Brother Seafood Bali API"""
import io
import os
import struct
import zlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://brother-seafood-bali.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


def _make_png(w=8, h=8, color=(200, 40, 40)):
    """Build a minimal valid PNG in-memory."""
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    raw = b""
    for _ in range(h):
        raw += b"\x00" + bytes(color) * w
    idat = zlib.compress(raw)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


@pytest.fixture(scope="session")
def s():
    sess = requests.Session()
    return sess


# ---------- Proposals ----------
class TestProposals:
    def test_list_has_seeded_mr_xu(self, s):
        r = s.get(f"{API}/proposals")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert any(p["client_name"] == "Mr. Xu" for p in data), "Seeded Mr. Xu proposal missing"

    def test_crud_proposal(self, s):
        # Create
        payload = {"client_name": "TEST_Agent", "client_contact": "TESTWX", "contact_type": "WeChat", "date": "2026-01-15", "notes": "test"}
        r = s.post(f"{API}/proposals", json=payload)
        assert r.status_code == 200
        created = r.json()
        assert created["client_name"] == "TEST_Agent"
        assert "id" in created
        pid = created["id"]

        # Get
        r = s.get(f"{API}/proposals/{pid}")
        assert r.status_code == 200
        assert r.json()["client_contact"] == "TESTWX"

        # Update
        upd = {**payload, "client_name": "TEST_Agent2"}
        r = s.put(f"{API}/proposals/{pid}", json=upd)
        assert r.status_code == 200
        assert r.json()["client_name"] == "TEST_Agent2"

        # Verify persistence
        r = s.get(f"{API}/proposals/{pid}")
        assert r.json()["client_name"] == "TEST_Agent2"

        # Delete
        r = s.delete(f"{API}/proposals/{pid}")
        assert r.status_code == 200

        # 404 after
        r = s.get(f"{API}/proposals/{pid}")
        assert r.status_code == 404

    def test_unknown_id_404(self, s):
        r = s.get(f"{API}/proposals/nonexistent-id")
        assert r.status_code == 404

    def test_docx_download(self, s):
        # Use seeded Mr Xu
        r = s.get(f"{API}/proposals")
        pid = next(p["id"] for p in r.json() if p["client_name"] == "Mr. Xu")
        r = s.get(f"{API}/proposals/{pid}/docx")
        assert r.status_code == 200
        assert "wordprocessingml" in r.headers["Content-Type"]
        assert "attachment" in r.headers["Content-Disposition"]
        # DOCX files begin with PK zip signature
        assert r.content[:2] == b"PK"
        assert len(r.content) > 5000

    def test_docx_404(self, s):
        r = s.get(f"{API}/proposals/nonexistent/docx")
        assert r.status_code == 404


# ---------- Visits ----------
class TestVisits:
    created_ids = []

    def test_create_visit_commission_calc(self, s):
        payload = {"ta_name": "TEST_TA", "date": "2026-01-10", "pax": 6, "package": "A",
                   "food_bill": 1000000, "beverage_bill": 200000, "uang_hadir": 80000, "paid": False}
        r = s.post(f"{API}/visits", json=payload)
        assert r.status_code == 200
        v = r.json()
        assert v["commission_food"] == 350000  # 35% of 1,000,000
        assert v["commission_bev"] == 20000    # 10% of 200,000
        assert v["commission_total"] == 450000  # 350k + 20k + 80k uang_hadir
        TestVisits.created_ids.append(v["id"])

    def test_patch_paid(self, s):
        vid = TestVisits.created_ids[0]
        r = s.patch(f"{API}/visits/{vid}", json={"paid": True})
        assert r.status_code == 200
        assert r.json()["paid"] is True

    def test_visits_summary(self, s):
        r = s.get(f"{API}/visits/summary")
        assert r.status_code == 200
        data = r.json()
        assert "totals" in data and "agents" in data
        assert "package_prices" in data
        ta = next((a for a in data["agents"] if a["ta_name"] == "TEST_TA"), None)
        assert ta is not None
        assert ta["visits"] >= 1
        assert ta["pax"] >= 6

    def test_delete_visit(self, s):
        vid = TestVisits.created_ids[0]
        r = s.delete(f"{API}/visits/{vid}")
        assert r.status_code == 200
        # 404 on delete twice
        r = s.delete(f"{API}/visits/{vid}")
        assert r.status_code == 404

    def test_patch_404(self, s):
        r = s.patch(f"{API}/visits/nonexistent", json={"paid": True})
        assert r.status_code == 404


# ---------- Settings ----------
class TestSettings:
    uploaded_gallery_ids = []

    def test_get_settings(self, s):
        r = s.get(f"{API}/settings")
        assert r.status_code == 200
        d = r.json()
        assert "gallery" in d
        # 5 seeded photos
        assert len(d["gallery"]) >= 5, f"Expected >=5 gallery photos, got {len(d['gallery'])}"

    def test_file_serve(self, s):
        r = s.get(f"{API}/settings")
        path = r.json()["gallery"][0]["path"]
        r = s.get(f"{API}/files/{path}")
        assert r.status_code == 200
        assert r.headers["Content-Type"].startswith("image/")
        assert len(r.content) > 0

    def test_gallery_upload_and_delete(self, s):
        png = _make_png()
        files = {"file": ("test.png", png, "image/png")}
        r = s.post(f"{API}/settings/gallery", files=files, data={"caption": "TEST_caption"})
        assert r.status_code == 200, r.text
        gallery = r.json()["gallery"]
        item = next((g for g in gallery if g["caption"] == "TEST_caption"), None)
        assert item is not None
        gid = item["id"]

        # Delete
        r = s.delete(f"{API}/settings/gallery/{gid}")
        assert r.status_code == 200
        assert not any(g["id"] == gid for g in r.json()["gallery"])

    def test_gallery_reject_non_image(self, s):
        files = {"file": ("bad.txt", b"hello", "text/plain")}
        r = s.post(f"{API}/settings/gallery", files=files, data={"caption": "x"})
        assert r.status_code == 400

    def test_logo_upload_and_remove(self, s):
        png = _make_png()
        files = {"file": ("logo.png", png, "image/png")}
        r = s.post(f"{API}/settings/logo", files=files)
        assert r.status_code == 200, r.text
        assert r.json()["logo_path"]
        # Remove
        r = s.delete(f"{API}/settings/logo")
        assert r.status_code == 200
        assert r.json()["logo_path"] is None
