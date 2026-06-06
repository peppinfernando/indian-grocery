from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum

class StockStatus(str, Enum):
    in_stock = "in_stock"
    low_stock = "low_stock"
    out_of_stock = "out_of_stock"

class OrderStatus(str, Enum):
    new = "new"
    confirmed = "confirmed"
    packed = "packed"
    out_for_delivery = "out_for_delivery"
    completed = "completed"
    cancelled = "cancelled"

# --- Product ---
class Product(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    subcategory: Optional[str] = None
    description: str
    images: List[str] = []
    unit_label: str
    price: float
    sale_price: Optional[float] = None
    currency: str = "EUR"
    stock_status: StockStatus = StockStatus.in_stock
    stock_qty: int = 0
    featured: bool = False
    seasonal: bool = False
    tags: List[str] = []
    sort_order: int = 0
    reorder_score: int = 0
    search_keywords: List[str] = []

class ProductCreate(BaseModel):
    name: str
    slug: str
    category: str
    subcategory: Optional[str] = None
    description: str
    images: List[str] = []
    unit_label: str
    price: float
    sale_price: Optional[float] = None
    currency: str = "EUR"
    stock_status: StockStatus = StockStatus.in_stock
    stock_qty: int = 0
    featured: bool = False
    seasonal: bool = False
    tags: List[str] = []
    sort_order: int = 0
    search_keywords: List[str] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    stock_status: Optional[StockStatus] = None
    stock_qty: Optional[int] = None
    featured: Optional[bool] = None
    seasonal: Optional[bool] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None

# --- Category ---
class Category(BaseModel):
    id: str
    name: str
    slug: str
    icon: Optional[str] = None
    sort_order: int = 0
    product_count: int = 0

# --- Address ---
class Address(BaseModel):
    id: Optional[str] = None
    label: str = "Home"
    line1: str
    line2: Optional[str] = None
    city: str
    postcode: str
    instructions: Optional[str] = None

# --- Customer ---
class Customer(BaseModel):
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    addresses: List[Address] = []
    whatsapp_opt_in: bool = False
    default_address_id: Optional[str] = None

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[Address] = None
    whatsapp_opt_in: bool = False

# --- Order ---
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    unit_label: str
    quantity: int
    unit_price: float
    line_total: float

class Order(BaseModel):
    id: str
    customer_id: Optional[str] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    items: List[OrderItem]
    subtotal: float
    delivery_fee: float = 0.0
    total: float
    delivery_address: Address
    status: OrderStatus = OrderStatus.new
    notes: Optional[str] = None
    created_at: str
    whatsapp_notified: bool = False

class OrderCreate(BaseModel):
    customer_id: Optional[str] = None
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    items: List[OrderItem]
    delivery_address: Address
    notes: Optional[str] = None

# --- Auth ---
class LoginRequest(BaseModel):
    phone: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    phone: str
    password: str
    email: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer_id: str
    name: str
    is_admin: bool = False
