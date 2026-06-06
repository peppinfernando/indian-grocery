from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db, CustomerDB
from models.schemas import LoginRequest, RegisterRequest, TokenResponse
import uuid

router = APIRouter()

def seed_admin(db: Session):
    if not db.query(CustomerDB).filter_by(is_admin=True).first():
        db.add(CustomerDB(
            id="admin_001", name="Admin", phone="admin",
            password="admin123", is_admin=True, addresses=[]
        ))
        db.commit()

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    seed_admin(db)
    user = db.query(CustomerDB).filter_by(phone=req.phone).first()
    if not user or user.password != req.password:
        raise HTTPException(401, "Invalid credentials")
    return TokenResponse(
        access_token=f"mock_token_{user.id}",
        customer_id=user.id, name=user.name,
        is_admin=user.is_admin or False
    )

@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(CustomerDB).filter_by(phone=req.phone).first():
        raise HTTPException(400, "Phone already registered")
    cust_id = f"cust_{uuid.uuid4().hex[:6]}"
    user = CustomerDB(
        id=cust_id, name=req.name, phone=req.phone,
        email=req.email, password=req.password,
        is_admin=False, addresses=[]
    )
    db.add(user); db.commit()
    return TokenResponse(
        access_token=f"mock_token_{cust_id}",
        customer_id=cust_id, name=req.name, is_admin=False
    )
