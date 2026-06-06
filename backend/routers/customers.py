from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from database import get_db, CustomerDB
from models.schemas import CustomerCreate
import uuid

router = APIRouter()

def cust_to_dict(c):
    return {
        "id": c.id, "name": c.name, "phone": c.phone,
        "email": c.email, "addresses": c.addresses or [],
        "whatsapp_opt_in": c.whatsapp_opt_in or False,
        "default_address_id": c.default_address_id
    }

@router.get("/", response_model=List[dict])
def get_customers(db: Session = Depends(get_db)):
    return [cust_to_dict(c) for c in db.query(CustomerDB).filter_by(is_admin=False).all()]

@router.get("/{customer_id}", response_model=dict)
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    c = db.query(CustomerDB).filter_by(id=customer_id).first()
    if not c: raise HTTPException(404, "Not found")
    return cust_to_dict(c)

@router.patch("/{customer_id}", response_model=dict)
def update_customer(customer_id: str, updates: dict, db: Session = Depends(get_db)):
    c = db.query(CustomerDB).filter_by(id=customer_id).first()
    if not c: raise HTTPException(404, "Not found")
    for k, v in updates.items():
        if hasattr(c, k): setattr(c, k, v)
    db.commit(); db.refresh(c)
    return cust_to_dict(c)
