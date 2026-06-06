from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.schemas import OrderCreate, OrderStatus
from data.seed import ORDERS
import uuid
from datetime import datetime

router = APIRouter()
orders_db = list(ORDERS)

@router.get("/", response_model=List[dict])
def get_orders(customer_id: Optional[str] = None, status: Optional[str] = None):
    results = list(orders_db)
    if customer_id:
        results = [o for o in results if o.get("customer_id") == customer_id]
    if status:
        results = [o for o in results if o.get("status") == status]
    return sorted(results, key=lambda x: x["created_at"], reverse=True)

@router.get("/{order_id}", response_model=dict)
def get_order(order_id: str):
    order = next((o for o in orders_db if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/", response_model=dict)
def create_order(order: OrderCreate):
    subtotal = sum(item.line_total for item in order.items)
    delivery_fee = 0.0 if subtotal >= 50 else 3.50
    total = subtotal + delivery_fee
    new_order = {
        "id": f"ord_{uuid.uuid4().hex[:6]}",
        "customer_id": order.customer_id,
        "guest_name": order.guest_name,
        "guest_phone": order.guest_phone,
        "items": [i.dict() for i in order.items],
        "subtotal": round(subtotal, 2),
        "delivery_fee": delivery_fee,
        "total": round(total, 2),
        "delivery_address": order.delivery_address.dict(),
        "status": "new",
        "notes": order.notes,
        "created_at": datetime.now().isoformat(),
        "whatsapp_notified": False
    }
    orders_db.append(new_order)
    return new_order

@router.patch("/{order_id}/status", response_model=dict)
def update_order_status(order_id: str, status: str):
    order = next((o for o in orders_db if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order["status"] = status
    return order
