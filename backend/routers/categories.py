from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from database import get_db, CategoryDB
import uuid

router = APIRouter()

def cat_to_dict(c):
    return {"id": c.id, "name": c.name, "slug": c.slug, "icon": c.icon, "sort_order": c.sort_order, "product_count": c.product_count}

@router.get("/", response_model=List[dict])
def get_categories(db: Session = Depends(get_db)):
    return [cat_to_dict(c) for c in db.query(CategoryDB).order_by(CategoryDB.sort_order).all()]

@router.get("/{category_id}", response_model=dict)
def get_category(category_id: str, db: Session = Depends(get_db)):
    c = db.query(CategoryDB).filter((CategoryDB.id == category_id) | (CategoryDB.slug == category_id)).first()
    if not c: raise HTTPException(404, "Not found")
    return cat_to_dict(c)

@router.post("/", response_model=dict)
def create_category(category: dict, db: Session = Depends(get_db)):
    c = CategoryDB(id=f"cat_{uuid.uuid4().hex[:4]}", **category)
    db.add(c); db.commit(); db.refresh(c)
    return cat_to_dict(c)

@router.patch("/{category_id}", response_model=dict)
def update_category(category_id: str, updates: dict, db: Session = Depends(get_db)):
    c = db.query(CategoryDB).filter_by(id=category_id).first()
    if not c: raise HTTPException(404, "Not found")
    for k, v in updates.items():
        if hasattr(c, k): setattr(c, k, v)
    db.commit(); db.refresh(c)
    return cat_to_dict(c)

@router.delete("/{category_id}")
def delete_category(category_id: str, db: Session = Depends(get_db)):
    c = db.query(CategoryDB).filter_by(id=category_id).first()
    if not c: raise HTTPException(404, "Not found")
    db.delete(c); db.commit()
    return {"deleted": category_id}
