"""MongoDB-backed binary storage for uploaded logo/gallery files.

This replaces the original Emergent object-storage dependency so the app can run
independently on Render + MongoDB Atlas.
"""
import os
from bson.binary import Binary
from pymongo import MongoClient

APP_NAME = "brother-seafood-bali"
_collection = None
_client = None


def _get_collection():
    global _collection, _client
    if _collection is None:
        mongo_url = os.environ["MONGO_URL"]
        db_name = os.environ["DB_NAME"]
        _client = MongoClient(mongo_url)
        _collection = _client[db_name]["storage_objects"]
    return _collection


def init_storage(force: bool = False):
    # Kept for compatibility with the existing startup hook.
    _get_collection().create_index("created_at")
    return "mongodb"


def put_object(path: str, data: bytes, content_type: str) -> dict:
    from datetime import datetime, timezone
    _get_collection().replace_one(
        {"_id": path},
        {
            "_id": path,
            "data": Binary(data),
            "content_type": content_type,
            "size": len(data),
            "created_at": datetime.now(timezone.utc),
        },
        upsert=True,
    )
    return {"path": path, "size": len(data)}


def get_object(path: str):
    rec = _get_collection().find_one({"_id": path}, {"data": 1, "content_type": 1})
    if not rec:
        raise FileNotFoundError(path)
    return bytes(rec["data"]), rec.get("content_type", "application/octet-stream")
