from fastapi import APIRouter, HTTPException
from typing import List
from data.seed import CATEGORIES
import uuid

router = APIRouter()
categories_db = list(CATEGORIES)

@router.get("/", response_model=List[dict])
def get_categories():
    return sorted(categories_db, key=lambda x: x.get("sort_order", 0))

@router.get("/{category_id}", response_model=dict)
def get_category(category_id: str):
    cat = next((c for c in categories_db if c["id"] == category_id or c["slug"] == category_id), None)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat

@router.post("/", response_model=dict)
def create_category(category: dict):
    new_id = f"cat_{uuid.uuid4().hex[:4]}"
    new_cat = {"id": new_id, **category}
    categories_db.append(new_cat)
    return new_cat

@router.patch("/{category_id}", response_model=dict)
def update_category(category_id: str, updates: dict):
    cat = next((c for c in categories_db if c["id"] == category_id), None)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.update(updates)
    return cat

@router.delete("/{category_id}")
def delete_category(category_id: str):
    global categories_db
    categories_db = [c for c in categories_db if c["id"] != category_id]
    return {"deleted": category_id}
