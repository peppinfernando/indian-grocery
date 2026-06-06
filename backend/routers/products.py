from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from models.schemas import Product, ProductCreate, ProductUpdate
from data.seed import PRODUCTS
import uuid

router = APIRouter()

products_db = list(PRODUCTS)

@router.get("/", response_model=List[dict])
def get_products(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    seasonal: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(50, le=100),
    offset: int = 0,
):
    results = list(products_db)
    if category:
        results = [p for p in results if p["category"].lower() == category.lower()]
    if featured is not None:
        results = [p for p in results if p["featured"] == featured]
    if seasonal is not None:
        results = [p for p in results if p["seasonal"] == seasonal]
    if search:
        q = search.lower()
        results = [
            p for p in results
            if q in p["name"].lower()
            or q in p["description"].lower()
            or any(q in kw.lower() for kw in p.get("search_keywords", []))
        ]
    results.sort(key=lambda x: x.get("sort_order", 0))
    return results[offset: offset + limit]

@router.get("/featured", response_model=List[dict])
def get_featured():
    return [p for p in products_db if p["featured"]][:8]

@router.get("/seasonal", response_model=List[dict])
def get_seasonal():
    return [p for p in products_db if p["seasonal"]]

@router.get("/{product_id}", response_model=dict)
def get_product(product_id: str):
    product = next((p for p in products_db if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=dict)
def create_product(product: ProductCreate):
    new_id = f"prod_{uuid.uuid4().hex[:6]}"
    new_product = {"id": new_id, **product.dict()}
    products_db.append(new_product)
    return new_product

@router.patch("/{product_id}", response_model=dict)
def update_product(product_id: str, updates: ProductUpdate):
    product = next((p for p in products_db if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    product.update(update_data)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: str):
    global products_db
    products_db = [p for p in products_db if p["id"] != product_id]
    return {"deleted": product_id}
