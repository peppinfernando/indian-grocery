from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session
from database import get_db, OrderDB
from models.schemas import OrderCreate
import uuid
from datetime import datetime

router = APIRouter()

def order_to_dict(o):
    return {
        "id": o.id, "customer_id": o.customer_id,
        "guest_name": o.guest_name, "guest_phone": o.guest_phone,
        "items": o.items, "subtotal": o.subtotal,
        "delivery_fee": o.delivery_fee, "total": o.total,
        "delivery_address": o.delivery_address, "status": o.status,
        "notes": o.notes,
        "created_at": o.created_at.isoformat() if o.created_at else None,
        "whatsapp_notified": o.whatsapp_notified
    }

@router.get("/", response_model=List[dict])
def get_orders(customer_id: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(OrderDB)
    if customer_id: q = q.filter_by(customer_id=customer_id)
    if status: q = q.filter_by(status=status)
    return [order_to_dict(o) for o in q.order_by(OrderDB.created_at.desc()).all()]

@router.get("/{order_id}", response_model=dict)
def get_order(order_id: str, db: Session = Depends(get_db)):
    o = db.query(OrderDB).filter_by(id=order_id).first()
    if not o: raise HTTPException(404, "Order not found")
    return order_to_dict(o)

@router.post("/", response_model=dict)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    subtotal = sum(item.line_total for item in order.items)
    delivery_fee = 0.0 if subtotal >= 50 else 3.50
    total = subtotal + delivery_fee
    o = OrderDB(
        id=f"ord_{uuid.uuid4().hex[:6]}",
        customer_id=order.customer_id,
        guest_name=order.guest_name,
        guest_phone=order.guest_phone,
        items=[i.dict() for i in order.items],
        subtotal=round(subtotal, 2),
        delivery_fee=delivery_fee,
        total=round(total, 2),
        delivery_address=order.delivery_address.dict(),
        status="new",
        notes=order.notes,
        created_at=datetime.utcnow(),
        whatsapp_notified=False
    )
    db.add(o); db.commit(); db.refresh(o)
    return order_to_dict(o)

@router.patch("/{order_id}/status", response_model=dict)
def update_order_status(order_id: str, status: str, db: Session = Depends(get_db)):
    o = db.query(OrderDB).filter_by(id=order_id).first()
    if not o: raise HTTPException(404, "Not found")
    o.status = status
    db.commit(); db.refresh(o)
    return order_to_dict(o)
