from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import CustomerCreate
from data.seed import CUSTOMERS
import uuid

router = APIRouter()
customers_db = {c["id"]: c for c in CUSTOMERS}

@router.get("/", response_model=List[dict])
def get_customers():
    return list(customers_db.values())

@router.get("/{customer_id}", response_model=dict)
def get_customer(customer_id: str):
    customer = customers_db.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.post("/", response_model=dict)
def create_customer(customer: CustomerCreate):
    new_id = f"cust_{uuid.uuid4().hex[:6]}"
    new_customer = {
        "id": new_id,
        "name": customer.name,
        "phone": customer.phone,
        "email": customer.email,
        "addresses": [customer.address.dict()] if customer.address else [],
        "whatsapp_opt_in": customer.whatsapp_opt_in,
        "default_address_id": None
    }
    customers_db[new_id] = new_customer
    return new_customer

@router.patch("/{customer_id}", response_model=dict)
def update_customer(customer_id: str, updates: dict):
    customer = customers_db.get(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.update(updates)
    return customer
