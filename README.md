# 🌿 Spice & Grain — Indian Grocery Web App

A full-stack Indian grocery store web app with a **FastAPI Python backend** and **React frontend**.

---

## Project Structure

```
indian-grocery/
├── backend/          ← FastAPI (Python)
│   ├── main.py
│   ├── requirements.txt
│   ├── models/schemas.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── categories.py
│   │   ├── orders.py
│   │   ├── customers.py
│   │   └── admin.py
│   └── data/seed.py   ← 20 sample products, categories, orders
│
└── frontend/         ← React
    ├── package.json
    └── src/
        ├── App.js           ← All routes
        ├── index.css        ← Design tokens + global styles
        ├── context/         ← Cart, Auth, Toast state
        ├── hooks/useApi.js  ← API calls
        ├── components/      ← Header, MobileNav, ProductCard
        └── pages/
            ├── HomePage.js
            ├── ShopPage.js
            ├── ProductPage.js
            ├── CartPage.js
            ├── CheckoutPage.js
            ├── OrderConfirmationPage.js
            ├── AuthPages.js       ← Login + Register
            ├── AccountPage.js     ← Order history + reorder
            └── AdminPage.js       ← Dashboard, products, orders
```

---

## Setup & Run (Two terminals)

### Terminal 1 — Backend (FastAPI)

```bash
cd indian-grocery/backend

# Create a virtual environment
python3 -m venv venv
source venv/bin/activate       # macOS/Linux
# venv\Scripts\activate        # Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

API runs at: http://localhost:8000  
Interactive API docs: http://localhost:8000/docs

### Terminal 2 — Frontend (React)

```bash
cd indian-grocery/frontend

# Install dependencies
npm install

# Start dev server
npm start
```

Frontend runs at: http://localhost:3000

---

## Demo Credentials

| Role     | Phone/Username      | Password    |
|----------|---------------------|-------------|
| Customer | +353871234567       | password123 |
| Admin    | admin               | admin123    |

---

## Pages & Routes

| Route                  | Page                    |
|------------------------|-------------------------|
| `/`                    | Homepage (hero, featured, categories) |
| `/shop`                | Full product catalogue  |
| `/shop?category=X`     | Filtered by category    |
| `/shop?search=X`       | Search results          |
| `/shop?seasonal=true`  | Seasonal items          |
| `/product/:id`         | Product detail          |
| `/cart`                | Shopping cart           |
| `/checkout`            | Checkout (guest/user)   |
| `/order-confirmation`  | Post-order confirmation |
| `/login`               | Sign in                 |
| `/register`            | Create account          |
| `/account`             | Order history + reorder |
| `/admin`               | Admin panel             |

---

## API Endpoints

```
GET  /api/products          List/search products
GET  /api/products/featured Featured products
GET  /api/products/seasonal Seasonal products
GET  /api/products/:id      Single product
POST /api/products          Create product (admin)
PATCH /api/products/:id     Update product (admin)

GET  /api/categories        All categories

POST /api/auth/login        Login
POST /api/auth/register     Register

GET  /api/orders            List orders
POST /api/orders            Create order
PATCH /api/orders/:id/status Update status (admin)

GET  /api/admin/dashboard   Admin stats
```

---

## Features Built

### Storefront
- ✅ Homepage with hero, category scroll, featured products, seasonal section
- ✅ Full shop with category filter chips + search
- ✅ Product detail page with quantity stepper
- ✅ Shopping cart with quantity edit and removal
- ✅ Checkout — guest and registered user
- ✅ Automatic free delivery over €50
- ✅ Order confirmation with WhatsApp CTA
- ✅ Cart persists in localStorage

### Account
- ✅ Register + login (phone-based)
- ✅ Account page with order history
- ✅ One-tap reorder from past orders
- ✅ Guest order + post-order account creation prompt

### Admin Panel
- ✅ Dashboard: total orders, revenue, new orders, low stock, best sellers
- ✅ Product table with inline price + qty editing
- ✅ Stock status dropdown per product
- ✅ Featured toggle per product
- ✅ Delete product
- ✅ Order list with status update dropdown

---

## Note on Data Storage

This version uses **in-memory storage** (seeded from `data/seed.py`).  
Data resets when the server restarts — ideal for local development.

**To add a real database:** Replace the in-memory lists with PostgreSQL + SQLAlchemy.  
The `schemas.py` models are already Pydantic-ready for database integration.
