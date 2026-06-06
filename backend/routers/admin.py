from fastapi import APIRouter
from routers.products import products_db
from routers.orders import orders_db
from routers.customers import customers_db

router = APIRouter()

@router.get("/dashboard")
def get_dashboard():
    total_orders = len(orders_db)
    new_orders = len([o for o in orders_db if o["status"] == "new"])
    pending_orders = len([o for o in orders_db if o["status"] in ["new", "confirmed", "packed"]])
    low_stock = [p for p in products_db if p.get("stock_status") in ["low_stock", "out_of_stock"]]
    total_revenue = sum(o["total"] for o in orders_db if o["status"] not in ["cancelled"])
    best_sellers = sorted(products_db, key=lambda x: x.get("reorder_score", 0), reverse=True)[:5]
    return {
        "total_orders": total_orders,
        "new_orders": new_orders,
        "pending_orders": pending_orders,
        "low_stock_count": len(low_stock),
        "low_stock_items": low_stock[:5],
        "total_customers": len(customers_db),
        "total_revenue": round(total_revenue, 2),
        "best_sellers": best_sellers,
        "recent_orders": sorted(orders_db, key=lambda x: x["created_at"], reverse=True)[:5]
    }
