from fastapi import APIRouter, Query, HTTPException, Depends
from typing import Optional, List
from sqlalchemy.orm import Session
from database import get_db, ProductDB
from data.seed import PRODUCTS, CATEGORIES
import uuid

router = APIRouter()

def seed_if_empty(db: Session):
    if db.query(ProductDB).count() == 0:
        from database import CategoryDB
        for c in CATEGORIES:
            if not db.query(CategoryDB).filter_by(id=c["id"]).first():
                db.add(CategoryDB(**c))
        for p in PRODUCTS:
            if not db.query(ProductDB).filter_by(id=p["id"]).first():
                db.add(ProductDB(**p))
        db.commit()

def prod_to_dict(p):
    return {
        "id": p.id, "name": p.name, "slug": p.slug, "category": p.category,
        "subcategory": p.subcategory, "description": p.description,
        "images": p.images or [], "unit_label": p.unit_label,
        "price": p.price, "sale_price": p.sale_price, "currency": p.currency,
        "stock_status": p.stock_status, "stock_qty": p.stock_qty,
        "featured": p.featured, "seasonal": p.seasonal,
        "tags": p.tags or [], "sort_order": p.sort_order,
        "reorder_score": p.reorder_score, "search_keywords": p.search_keywords or []
    }

@router.get("/", response_model=List[dict])
def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    seasonal: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db)
):
    seed_if_empty(db)
    q = db.query(ProductDB)
    if category: q = q.filter(ProductDB.category.ilike(category))
    if featured is not None: q = q.filter(ProductDB.featured == featured)
    if seasonal is not None: q = q.filter(ProductDB.seasonal == seasonal)
    if search:
        q = q.filter(ProductDB.name.ilike(f"%{search}%") | ProductDB.description.ilike(f"%{search}%"))
    q = q.order_by(ProductDB.sort_order)
    return [prod_to_dict(p) for p in q.offset(offset).limit(limit).all()]

@router.get("/featured", response_model=List[dict])
def get_featured(db: Session = Depends(get_db)):
    seed_if_empty(db)
    return [prod_to_dict(p) for p in db.query(ProductDB).filter_by(featured=True).limit(8).all()]

@router.get("/seasonal", response_model=List[dict])
def get_seasonal(db: Session = Depends(get_db)):
    seed_if_empty(db)
    return [prod_to_dict(p) for p in db.query(ProductDB).filter_by(seasonal=True).all()]

@router.get("/{product_id}", response_model=dict)
def get_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(ProductDB).filter_by(id=product_id).first()
    if not p: raise HTTPException(404, "Product not found")
    return prod_to_dict(p)

@router.post("/", response_model=dict)
def create_product(product: dict, db: Session = Depends(get_db)):
    new_id = f"prod_{uuid.uuid4().hex[:6]}"
    p = ProductDB(id=new_id, **product)
    db.add(p); db.commit(); db.refresh(p)
    return prod_to_dict(p)

@router.patch("/{product_id}", response_model=dict)
def update_product(product_id: str, updates: dict, db: Session = Depends(get_db)):
    p = db.query(ProductDB).filter_by(id=product_id).first()
    if not p: raise HTTPException(404, "Product not found")
    for k, v in updates.items():
        if hasattr(p, k): setattr(p, k, v)
    db.commit(); db.refresh(p)
    return prod_to_dict(p)

@router.delete("/{product_id}")
def delete_product(product_id: str, db: Session = Depends(get_db)):
    p = db.query(ProductDB).filter_by(id=product_id).first()
    if not p: raise HTTPException(404, "Not found")
    db.delete(p); db.commit()
    return {"deleted": product_id}
