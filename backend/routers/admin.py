from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, ProductDB, OrderDB, CustomerDB

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    total_orders = db.query(OrderDB).count()
    new_orders = db.query(OrderDB).filter_by(status="new").count()
    pending = db.query(OrderDB).filter(OrderDB.status.in_(["new","confirmed","packed"])).count()
    low_stock = db.query(ProductDB).filter(ProductDB.stock_status.in_(["low_stock","out_of_stock"])).all()
    revenue = sum(o.total for o in db.query(OrderDB).filter(OrderDB.status != "cancelled").all())
    best = db.query(ProductDB).order_by(ProductDB.reorder_score.desc()).limit(5).all()
    recent = db.query(OrderDB).order_by(OrderDB.created_at.desc()).limit(5).all()

    def prod_dict(p):
        return {"id": p.id, "name": p.name, "category": p.category, "price": p.price, "reorder_score": p.reorder_score}

    def order_dict(o):
        return {
            "id": o.id, "items": o.items, "total": o.total, "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None
        }

    return {
        "total_orders": total_orders,
        "new_orders": new_orders,
        "pending_orders": pending,
        "low_stock_count": len(low_stock),
        "low_stock_items": [prod_dict(p) for p in low_stock[:5]],
        "total_customers": db.query(CustomerDB).filter_by(is_admin=False).count(),
        "total_revenue": round(revenue, 2),
        "best_sellers": [prod_dict(p) for p in best],
        "recent_orders": [order_dict(o) for o in recent]
    }
