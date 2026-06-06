from fastapi import APIRouter, HTTPException
from models.schemas import LoginRequest, RegisterRequest, TokenResponse
from data.seed import USERS, CUSTOMERS
import uuid

router = APIRouter()

# In-memory user store (backed by seed data)
users_db = dict(USERS)
customers_db = {c["id"]: c for c in CUSTOMERS}

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = users_db.get(req.phone)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(
        access_token=f"mock_token_{user['id']}",
        customer_id=user["id"],
        name=user["name"],
        is_admin=user.get("is_admin", False)
    )

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    if req.phone in users_db:
        raise HTTPException(status_code=400, detail="Phone already registered")
    cust_id = f"cust_{uuid.uuid4().hex[:6]}"
    users_db[req.phone] = {"id": cust_id, "name": req.name, "password": req.password, "is_admin": False}
    customers_db[cust_id] = {
        "id": cust_id, "name": req.name, "phone": req.phone,
        "email": req.email, "addresses": [], "whatsapp_opt_in": False,
        "default_address_id": None
    }
    return TokenResponse(
        access_token=f"mock_token_{cust_id}",
        customer_id=cust_id,
        name=req.name,
        is_admin=False
    )
