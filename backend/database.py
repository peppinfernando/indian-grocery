import os
from sqlalchemy import create_engine, Column, String, Float, Integer, Boolean, Text, JSON, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = os.environ.get("DATABASE_URL", "").replace("postgresql://", "postgresql+psycopg2://")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ── Models ────────────────────────────────────────────────────────

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True)
    category = Column(String)
    subcategory = Column(String, nullable=True)
    description = Column(Text)
    images = Column(JSON, default=[])
    unit_label = Column(String)
    price = Column(Float)
    sale_price = Column(Float, nullable=True)
    currency = Column(String, default="EUR")
    stock_status = Column(String, default="in_stock")
    stock_qty = Column(Integer, default=0)
    featured = Column(Boolean, default=False)
    seasonal = Column(Boolean, default=False)
    tags = Column(JSON, default=[])
    sort_order = Column(Integer, default=0)
    reorder_score = Column(Integer, default=0)
    search_keywords = Column(JSON, default=[])

class CustomerDB(Base):
    __tablename__ = "customers"
    id = Column(String, primary_key=True)
    name = Column(String)
    phone = Column(String, unique=True)
    email = Column(String, nullable=True)
    addresses = Column(JSON, default=[])
    whatsapp_opt_in = Column(Boolean, default=False)
    default_address_id = Column(String, nullable=True)
    password = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(String, primary_key=True)
    customer_id = Column(String, nullable=True)
    guest_name = Column(String, nullable=True)
    guest_phone = Column(String, nullable=True)
    items = Column(JSON)
    subtotal = Column(Float)
    delivery_fee = Column(Float, default=0.0)
    total = Column(Float)
    delivery_address = Column(JSON)
    status = Column(String, default="new")
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    whatsapp_notified = Column(Boolean, default=False)

class CategoryDB(Base):
    __tablename__ = "categories"
    id = Column(String, primary_key=True)
    name = Column(String)
    slug = Column(String, unique=True)
    icon = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    product_count = Column(Integer, default=0)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
