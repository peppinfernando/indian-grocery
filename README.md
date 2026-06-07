# 🌿 JK Seasonal — Indian Grocery Web App

A full-stack Indian grocery store web app built with **FastAPI (Python)** backend and **React** frontend. Delivering across Cork, Limerick and Galway.

---

## 🌐 Live URLs

| Service | URL |
|---------|-----|
| **Storefront** | https://jk-seasonal.vercel.app |
| **Admin Panel** | https://jk-seasonal.vercel.app/admin |
| **Backend API** | https://jk-seasonal.onrender.com |
| **API Health** | https://jk-seasonal.onrender.com/api/health |
| **API Products** | https://jk-seasonal.onrender.com/api/products/ |
| **API Docs** | https://jk-seasonal.onrender.com/docs |
| **Eircode API** | https://jk-eircode-api.peppinfernando.workers.dev |
| **Eircode Test** | https://jk-eircode-api.peppinfernando.workers.dev/eircode?q=D02+X285 |
| **GitHub Repo** | https://github.com/peppinfernando/indian-grocery |

---

## 🏗 Infrastructure Dashboards

| Service | URL |
|---------|-----|
| **Vercel** | https://vercel.com/peppinfernando |
| **Render** | https://dashboard.render.com |
| **Cloudflare Workers** | https://dash.cloudflare.com |
| **Google Cloud Console** | https://console.cloud.google.com (project: jk-seasonal) |
| **Cloudinary** | https://cloudinary.com (image uploads) |

---

## 🔐 Login Credentials

| Role | Username / Phone | Password |
|------|-----------------|----------|
| Admin | `admin` | `admin123` |
| Demo Customer | `+353871234567` | `password123` |

---

## 📱 WhatsApp Numbers

| Purpose | Number |
|---------|--------|
| Customer support & order queries | +353894722934 |
| Admin order notifications | +353894722934 |

---

## 🗂 Project Structure

```
indian-grocery/
├── README.md
├── .gitignore
│
├── backend/                          ← FastAPI Python API
│   ├── main.py                       ← App entry, CORS, DB startup
│   ├── database.py                   ← SQLAlchemy models + PostgreSQL
│   ├── requirements.txt
│   ├── .python-version               ← Python 3.11
│   ├── models/
│   │   └── schemas.py                ← Pydantic models
│   ├── routers/
│   │   ├── auth.py                   ← Login, register
│   │   ├── products.py               ← Product CRUD + search
│   │   ├── categories.py             ← Category CRUD
│   │   ├── orders.py                 ← Orders + WhatsApp notification
│   │   ├── customers.py              ← Customer profiles
│   │   └── admin.py                  ← Dashboard stats
│   └── data/
│       └── seed.py                   ← 20 products, 12 categories
│
└── frontend/                         ← React web app
    ├── package.json
    ├── vercel.json                   ← SPA routing
    ├── .env.production               ← API URL config
    ├── public/index.html
    └── src/
        ├── App.js                    ← All routes
        ├── index.css                 ← Design tokens (Playfair + Outfit)
        ├── index.js
        ├── context/AppContext.js     ← Cart, Auth, Toast (useCallback)
        ├── hooks/useApi.js           ← All API calls (hardcoded Render URL)
        ├── components/Shared.js      ← Header, MobileNav, ProductCard
        └── pages/
            ├── HomePage.js           ← Hero, categories, featured, footer
            ├── ShopPage.js           ← Browse + search + category filter
            ├── ProductPage.js        ← Product detail (mobile stacked)
            ├── CartPage.js           ← Cart with qty stepper
            ├── CheckoutPage.js       ← 3-step + Eircode lookup + +353 prefix
            ├── OrderConfirmationPage.js ← Auto WhatsApp admin notification
            ├── AuthPages.js          ← Login (name/phone) + Register (+353)
            ├── AccountPage.js        ← Order history + reorder
            └── AdminPage.js          ← Dashboard, products, orders, categories, customers
```

---

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 20+
- npm

### Terminal 1 — Backend

```bash
cd indian-grocery/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 — Frontend

```bash
cd indian-grocery/frontend
npm install
npm start
```

Open **http://localhost:3000**

Phone on same WiFi: **http://YOUR_MAC_IP:3000**

---

## 📱 Pages & Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/shop` | Full product catalogue |
| `/shop?category=X` | Category filter |
| `/shop?search=X` | Search |
| `/shop?seasonal=true` | Seasonal items |
| `/shop?featured=true` | Featured items |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | 3-step checkout with Eircode |
| `/order-confirmation` | Post-order + auto WhatsApp |
| `/login` | Sign in (phone or name) |
| `/register` | Create account (+353 prefix) |
| `/account` | Order history + reorder |
| `/admin` | Admin panel |

---

## 🔌 API Endpoints

```
GET  /api/health
GET  /api/products/          ?category ?search ?featured ?seasonal
GET  /api/products/featured
GET  /api/products/seasonal
GET  /api/products/{id}
POST /api/products/
PATCH /api/products/{id}
DELETE /api/products/{id}

GET  /api/categories/
POST /api/categories/
PATCH /api/categories/{id}

POST /api/auth/login
POST /api/auth/register

GET  /api/orders/            ?customer_id ?status
GET  /api/orders/{id}
POST /api/orders/            returns WhatsApp notification URL
PATCH /api/orders/{id}/status

GET  /api/customers/
GET  /api/customers/{id}
PATCH /api/customers/{id}

GET  /api/admin/dashboard
```

---

## 🗄 Database

**Production:** PostgreSQL on Render (free tier, Frankfurt region)

Set via `DATABASE_URL` environment variable on Render. Tables auto-created and seeded on first startup.

**Important:** Use the **External Database URL** from Render (not Internal) since the web service and database are in different regions.

---

## 🌍 Deployment

### Backend — Render
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables:**
  - `DATABASE_URL` — PostgreSQL **external** URL from Render

### Frontend — Vercel
- **Root Directory:** `frontend`
- **Framework:** Create React App
- **API URL:** Hardcoded in `src/hooks/useApi.js` as `https://jk-seasonal.onrender.com/api`

### Eircode API — Cloudflare Workers
- **Worker:** `jk-eircode-api`
- **URL:** `https://jk-eircode-api.peppinfernando.workers.dev`
- **Secret:** `GOOGLE_MAPS_API_KEY`
- **Google Maps key:** `eir-code` key in Google Cloud Console (project: jk-seasonal)
- **Redeploy:** `cd ~/eircode-api && npx wrangler deploy --name jk-eircode-api`

---

## ✨ Features

### Storefront
- Warm cream & forest green theme (Playfair Display + Outfit fonts)
- Compact hero with stats — Cork · Limerick · Galway
- Category scroll, featured & seasonal sections
- Product detail with qty stepper and WhatsApp product enquiry
- Cart with free delivery threshold (€50)
- **3-step checkout:** Contact → Delivery → Review
- **Eircode lookup** — auto-fills Irish address via Cloudflare worker
- **Phone input** — 🇮🇪 +353 prefix shown, non-editable
- Guest checkout with post-order account prompt
- **Auto WhatsApp notification** to admin when order placed
- Footer with delivery areas and bilingual branding

### Account
- Login by phone number **or** name
- Phone registration with +353 prefix
- Order history with one-tap reorder

### Admin Panel (`/admin`)
- **Dashboard** — all KPI cards clickable, navigate to relevant tab
- **Products** — filter by All / Featured / Seasonal / Low Stock, inline edit modal with drag & drop image upload
- **Orders** — filter by status, WhatsApp button per order to notify admin
- **Categories** — browse products by category, seasonal and featured views
- **Customers** — search by name/phone/email, click to see order history, total spend, WhatsApp button

### WhatsApp Integration
- Order placed → auto-opens WhatsApp to admin (`+353894722934`) with full order details
- Product page → WhatsApp enquiry button
- Footer & delivery strip → WhatsApp link
- Admin orders → WhatsApp button per order
- Admin customers → WhatsApp button per customer

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Fonts | Playfair Display (display) + Outfit (body) |
| State | React Context with useCallback (Cart, Auth, Toast) |
| Backend | FastAPI (Python 3.11) |
| Database | PostgreSQL + SQLAlchemy (Render) |
| Images | Cloudinary (drag & drop upload in admin) |
| Eircode | Cloudflare Worker + Google Maps Geocoding API |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| Code | GitHub (private) |

---

## 🔄 Updating Products

### Option 1 — Admin Panel
1. Go to `/admin` → login as admin
2. Click **Products** tab
3. Click **Edit** → change price, stock, images, featured, seasonal
4. Click **Save Changes** — instant

### Option 2 — Edit seed file (permanent across restarts)
```bash
open ~/Documents/Projects/indian-grocery/backend/data/seed.py
# Edit products, then:
cd ~/Documents/Projects/indian-grocery
git add . && git commit -m "Update products" && git push
```

---

## 📦 Product Categories

🌾 Rice & Flour · 🫘 Lentils & Pulses · 🌶️ Spices & Masala · 🫙 Oils & Ghee · 🍪 Snacks & Biscuits · 🧊 Frozen Foods · 🥬 Fresh Vegetables · 🥭 Seasonal Fruits · 🧀 Dairy & Paneer · 🍛 Ready to Cook · 🍵 Drinks & Tea · 🪔 Festival Essentials

---

## 🆘 Common Issues

**Render cold start (slow first load):**
Free tier sleeps after 15 mins. First visitor waits ~30 seconds. Upgrade to paid ($7/month) for always-on.

**Products not loading on Vercel:**
API URL is hardcoded in `frontend/src/hooks/useApi.js`. Verify it points to `https://jk-seasonal.onrender.com/api`.

**Render deploy fails with database error:**
Make sure `DATABASE_URL` uses the **External** URL, not Internal. Internal only works within same Render region.

**Eircode lookup not working:**
```bash
# Test
curl "https://jk-eircode-api.peppinfernando.workers.dev/eircode?q=D02+X285"
# Redeploy if needed
cd ~/eircode-api
npx wrangler secret put GOOGLE_MAPS_API_KEY --name jk-eircode-api
npx wrangler deploy --name jk-eircode-api
```

**Form inputs losing focus:**
Fixed via `useCallback` in `AppContext.js`. If it recurs, check no new context state is being updated on every keystroke.

**Blank page on Vercel:**
Check browser console for React error #130 (undefined component). Usually means a missing export in `Shared.js`. Verify with:
```bash
grep "export function" ~/Documents/Projects/indian-grocery/frontend/src/components/Shared.js
```

---

## 🗺 Phase 2 Roadmap

- [ ] Payment integration (Stripe)
- [ ] Published/Hidden product toggle
- [ ] WhatsApp Business API webhooks
- [ ] Delivery slots
- [ ] Promo codes
- [ ] Push/SMS notifications
- [ ] CSV product import/export
- [ ] Customer management — edit, notes, loyalty
- [ ] Analytics dashboard
- [ ] Multi-language (English + Malayalam/Tamil)

---

*Built for JK Seasonal — Cork, Limerick & Galway, Ireland* 🇮🇪
