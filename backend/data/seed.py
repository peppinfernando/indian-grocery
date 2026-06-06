import uuid
from datetime import datetime

CATEGORIES = [
    {"id": "cat_01", "name": "Rice & Flour", "slug": "rice-flour", "icon": "🌾", "sort_order": 1, "product_count": 4},
    {"id": "cat_02", "name": "Lentils & Pulses", "slug": "lentils-pulses", "icon": "🫘", "sort_order": 2, "product_count": 3},
    {"id": "cat_03", "name": "Spices & Masala", "slug": "spices-masala", "icon": "🌶️", "sort_order": 3, "product_count": 4},
    {"id": "cat_04", "name": "Oils & Ghee", "slug": "oils-ghee", "icon": "🫙", "sort_order": 4, "product_count": 3},
    {"id": "cat_05", "name": "Snacks & Biscuits", "slug": "snacks-biscuits", "icon": "🍪", "sort_order": 5, "product_count": 3},
    {"id": "cat_06", "name": "Frozen Foods", "slug": "frozen-foods", "icon": "🧊", "sort_order": 6, "product_count": 2},
    {"id": "cat_07", "name": "Fresh Vegetables", "slug": "fresh-vegetables", "icon": "🥬", "sort_order": 7, "product_count": 4},
    {"id": "cat_08", "name": "Seasonal Fruits", "slug": "seasonal-fruits", "icon": "🥭", "sort_order": 8, "product_count": 3},
    {"id": "cat_09", "name": "Dairy & Paneer", "slug": "dairy-paneer", "icon": "🧀", "sort_order": 9, "product_count": 3},
    {"id": "cat_10", "name": "Ready to Cook", "slug": "ready-to-cook", "icon": "🍛", "sort_order": 10, "product_count": 3},
    {"id": "cat_11", "name": "Drinks & Tea", "slug": "drinks-tea", "icon": "🍵", "sort_order": 11, "product_count": 3},
    {"id": "cat_12", "name": "Festival Essentials", "slug": "festival-essentials", "icon": "🪔", "sort_order": 12, "product_count": 2},
]

PRODUCTS = [
    {"id": "prod_001", "name": "Ponni Rice 5kg", "slug": "ponni-rice-5kg", "category": "Rice & Flour", "subcategory": "Rice", "description": "Premium medium grain rice, ideal for daily South Indian cooking. Soft texture and great flavour.", "images": ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"], "unit_label": "5kg", "price": 14.99, "sale_price": 12.99, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 28, "featured": True, "seasonal": False, "tags": ["popular", "family staple"], "sort_order": 10, "reorder_score": 92, "search_keywords": ["rice", "ponni", "indian rice"]},
    {"id": "prod_002", "name": "Basmati Rice 5kg", "slug": "basmati-rice-5kg", "category": "Rice & Flour", "subcategory": "Rice", "description": "Long grain aged basmati, perfect for biryani and pulao. Aromatic and fluffy when cooked.", "images": ["https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400"], "unit_label": "5kg", "price": 16.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 20, "featured": True, "seasonal": False, "tags": ["biryani", "popular"], "sort_order": 11, "reorder_score": 88, "search_keywords": ["basmati", "rice", "biryani rice"]},
    {"id": "prod_003", "name": "Chakki Atta 10kg", "slug": "chakki-atta-10kg", "category": "Rice & Flour", "subcategory": "Flour", "description": "Stone-ground whole wheat flour for soft rotis and chapatis. No additives.", "images": ["https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=400"], "unit_label": "10kg", "price": 13.49, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 15, "featured": False, "seasonal": False, "tags": ["staple", "roti"], "sort_order": 12, "reorder_score": 80, "search_keywords": ["atta", "flour", "wheat flour", "chapati"]},
    {"id": "prod_004", "name": "Idli Rice 5kg", "slug": "idli-rice-5kg", "category": "Rice & Flour", "subcategory": "Rice", "description": "Short grain parboiled rice for fluffy idlis and soft dosas. Best for South Indian breakfast.", "images": ["https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400"], "unit_label": "5kg", "price": 11.99, "sale_price": None, "currency": "EUR", "stock_status": "low_stock", "stock_qty": 5, "featured": False, "seasonal": False, "tags": ["south indian", "idli", "dosa"], "sort_order": 13, "reorder_score": 72, "search_keywords": ["idli rice", "parboiled", "dosa"]},
    {"id": "prod_005", "name": "Toor Dal 2kg", "slug": "toor-dal-2kg", "category": "Lentils & Pulses", "subcategory": "Dal", "description": "Split pigeon peas for classic sambar and dal tadka. Clean, well-sorted, and quick to cook.", "images": ["https://images.unsplash.com/photo-1612257416648-c4c9679a58b4?w=400"], "unit_label": "2kg", "price": 8.99, "sale_price": 7.49, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 35, "featured": True, "seasonal": False, "tags": ["popular", "sambar"], "sort_order": 20, "reorder_score": 90, "search_keywords": ["toor dal", "pigeon peas", "sambar dal"]},
    {"id": "prod_006", "name": "Moong Dal 1kg", "slug": "moong-dal-1kg", "category": "Lentils & Pulses", "subcategory": "Dal", "description": "Split green moong for khichdi, soups, and healthy everyday cooking.", "images": ["https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400"], "unit_label": "1kg", "price": 4.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 22, "featured": False, "seasonal": False, "tags": ["healthy", "light"], "sort_order": 21, "reorder_score": 75, "search_keywords": ["moong", "mung", "green lentil"]},
    {"id": "prod_007", "name": "Chana Dal 2kg", "slug": "chana-dal-2kg", "category": "Lentils & Pulses", "subcategory": "Dal", "description": "Split Bengal gram, great for dal preparations, snacks, and chutneys.", "images": ["https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400"], "unit_label": "2kg", "price": 7.49, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 18, "featured": False, "seasonal": False, "tags": ["chana", "bengal gram"], "sort_order": 22, "reorder_score": 68, "search_keywords": ["chana dal", "bengal gram", "chickpea"]},
    {"id": "prod_008", "name": "MDH Sambar Masala 500g", "slug": "mdh-sambar-masala-500g", "category": "Spices & Masala", "subcategory": "Masala Blends", "description": "Classic MDH sambar masala blend. Authentic South Indian taste in every batch.", "images": ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400"], "unit_label": "500g", "price": 5.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 40, "featured": True, "seasonal": False, "tags": ["MDH", "sambar", "masala"], "sort_order": 30, "reorder_score": 85, "search_keywords": ["sambar masala", "MDH", "spice blend"]},
    {"id": "prod_009", "name": "Turmeric Powder 400g", "slug": "turmeric-powder-400g", "category": "Spices & Masala", "subcategory": "Ground Spices", "description": "Bright golden turmeric powder. High curcumin content, vibrant colour.", "images": ["https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400"], "unit_label": "400g", "price": 3.49, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 55, "featured": False, "seasonal": False, "tags": ["turmeric", "haldi"], "sort_order": 31, "reorder_score": 82, "search_keywords": ["turmeric", "haldi", "yellow spice"]},
    {"id": "prod_010", "name": "Everest Garam Masala 200g", "slug": "everest-garam-masala-200g", "category": "Spices & Masala", "subcategory": "Masala Blends", "description": "Aromatic garam masala for curries, gravies, and rice dishes. Everest quality.", "images": ["https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400"], "unit_label": "200g", "price": 4.29, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 30, "featured": False, "seasonal": False, "tags": ["garam masala", "everest", "curry"], "sort_order": 32, "reorder_score": 78, "search_keywords": ["garam masala", "curry spice", "everest"]},
    {"id": "prod_011", "name": "Mustard Seeds 500g", "slug": "mustard-seeds-500g", "category": "Spices & Masala", "subcategory": "Whole Spices", "description": "Black mustard seeds for tempering. Essential for South Indian cooking.", "images": ["https://images.unsplash.com/photo-1599909631676-3b4c05f58259?w=400"], "unit_label": "500g", "price": 2.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 45, "featured": False, "seasonal": False, "tags": ["mustard", "tempering", "tadka"], "sort_order": 33, "reorder_score": 70, "search_keywords": ["mustard seeds", "rai", "tempering"]},
    {"id": "prod_012", "name": "Idhayam Sesame Oil 1L", "slug": "idhayam-sesame-oil-1l", "category": "Oils & Ghee", "subcategory": "Cooking Oils", "description": "Cold-pressed sesame oil from Idhayam. Rich nutty flavour, widely used in South Indian cooking.", "images": ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"], "unit_label": "1L", "price": 9.99, "sale_price": 8.49, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 22, "featured": True, "seasonal": False, "tags": ["sesame oil", "gingelly", "idhayam"], "sort_order": 40, "reorder_score": 88, "search_keywords": ["sesame oil", "gingelly oil", "til oil"]},
    {"id": "prod_013", "name": "Amul Pure Ghee 1kg", "slug": "amul-pure-ghee-1kg", "category": "Oils & Ghee", "subcategory": "Ghee", "description": "Pure cow ghee from Amul. Authentic taste for dals, rotis, and sweets.", "images": ["https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=400"], "unit_label": "1kg", "price": 18.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 12, "featured": True, "seasonal": False, "tags": ["ghee", "amul", "pure"], "sort_order": 41, "reorder_score": 86, "search_keywords": ["ghee", "clarified butter", "amul ghee"]},
    {"id": "prod_014", "name": "Coconut Oil 1L", "slug": "coconut-oil-1l", "category": "Oils & Ghee", "subcategory": "Cooking Oils", "description": "Pure cold-pressed coconut oil, ideal for Kerala cooking and hair care.", "images": ["https://images.unsplash.com/photo-1555285793-7b7a4f2a91bc?w=400"], "unit_label": "1L", "price": 7.49, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 18, "featured": False, "seasonal": False, "tags": ["coconut oil", "Kerala"], "sort_order": 42, "reorder_score": 74, "search_keywords": ["coconut oil", "nariyal tel", "virgin coconut"]},
    {"id": "prod_015", "name": "Haldirams Bhujia 400g", "slug": "haldirams-bhujia-400g", "category": "Snacks & Biscuits", "subcategory": "Namkeen", "description": "Crispy besan noodle snack from Haldirams. A perennial Indian teatime favourite.", "images": ["https://images.unsplash.com/photo-1617692855027-33b14f061079?w=400"], "unit_label": "400g", "price": 4.49, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 50, "featured": False, "seasonal": False, "tags": ["haldirams", "namkeen", "snack"], "sort_order": 50, "reorder_score": 80, "search_keywords": ["bhujia", "haldirams", "namkeen snack"]},
    {"id": "prod_016", "name": "Parle-G Biscuits 800g", "slug": "parle-g-biscuits-800g", "category": "Snacks & Biscuits", "subcategory": "Biscuits", "description": "India's most loved glucose biscuit. Perfect with chai.", "images": ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400"], "unit_label": "800g", "price": 3.49, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 60, "featured": False, "seasonal": False, "tags": ["parle-g", "biscuit", "chai"], "sort_order": 51, "reorder_score": 77, "search_keywords": ["parle g", "glucose biscuit", "chai biscuit"]},
    {"id": "prod_017", "name": "MTR Rava Idli Mix 500g", "slug": "mtr-rava-idli-mix-500g", "category": "Ready to Cook", "subcategory": "Breakfast Mixes", "description": "Ready mix for soft rava idlis in 20 minutes. No grinding needed.", "images": ["https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400"], "unit_label": "500g", "price": 3.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 25, "featured": True, "seasonal": False, "tags": ["MTR", "rava idli", "instant"], "sort_order": 60, "reorder_score": 82, "search_keywords": ["rava idli", "mtr", "instant mix", "breakfast mix"]},
    {"id": "prod_018", "name": "Taj Mahal Tea 500g", "slug": "taj-mahal-tea-500g", "category": "Drinks & Tea", "subcategory": "Tea", "description": "Premium Assam blend with a robust, golden brew. The quintessential Indian chai tea.", "images": ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400"], "unit_label": "500g", "price": 7.99, "sale_price": 6.99, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 30, "featured": True, "seasonal": False, "tags": ["tea", "chai", "assam"], "sort_order": 70, "reorder_score": 89, "search_keywords": ["taj mahal tea", "chai", "assam tea"]},
    {"id": "prod_019", "name": "Fresh Bitter Gourd 500g", "slug": "fresh-bitter-gourd-500g", "category": "Fresh Vegetables", "subcategory": "Gourds", "description": "Fresh karela for classic bitter gourd fry, sambar, and curry.", "images": ["https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400"], "unit_label": "500g", "price": 2.99, "sale_price": None, "currency": "EUR", "stock_status": "in_stock", "stock_qty": 10, "featured": False, "seasonal": True, "tags": ["vegetable", "karela", "fresh"], "sort_order": 80, "reorder_score": 60, "search_keywords": ["bitter gourd", "karela", "pavakka"]},
    {"id": "prod_020", "name": "Alphonso Mangoes Box (12pc)", "slug": "alphonso-mangoes-box", "category": "Seasonal Fruits", "subcategory": "Mangoes", "description": "Season's finest Alphonso mangoes from Ratnagiri. Sweet, fibreless, and incredibly aromatic.", "images": ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=400"], "unit_label": "12 pcs", "price": 24.99, "sale_price": 21.99, "currency": "EUR", "stock_status": "low_stock", "stock_qty": 4, "featured": True, "seasonal": True, "tags": ["mango", "seasonal", "alphonso", "premium"], "sort_order": 1, "reorder_score": 95, "search_keywords": ["alphonso mango", "hapus", "ratnagiri mango"]},
]

CUSTOMERS = [
    {
        "id": "cust_001",
        "name": "Priya Nair",
        "phone": "+353871234567",
        "email": "priya@example.com",
        "addresses": [
            {"id": "addr_001", "label": "Home", "line1": "14 Oak Drive", "line2": "", "city": "Cork", "postcode": "T12 AB12", "instructions": "Ring bell"}
        ],
        "whatsapp_opt_in": True,
        "default_address_id": "addr_001"
    },
    {
        "id": "cust_002",
        "name": "Rahul Sharma",
        "phone": "+353876543210",
        "email": "rahul@example.com",
        "addresses": [
            {"id": "addr_002", "label": "Home", "line1": "7 Maple Close", "line2": "Ballincollig", "city": "Cork", "postcode": "T12 XY34", "instructions": "Leave at door"}
        ],
        "whatsapp_opt_in": True,
        "default_address_id": "addr_002"
    }
]

ORDERS = [
    {
        "id": "ord_001",
        "customer_id": "cust_001",
        "guest_name": None,
        "guest_phone": None,
        "items": [
            {"product_id": "prod_001", "product_name": "Ponni Rice 5kg", "unit_label": "5kg", "quantity": 2, "unit_price": 12.99, "line_total": 25.98},
            {"product_id": "prod_005", "product_name": "Toor Dal 2kg", "unit_label": "2kg", "quantity": 1, "unit_price": 7.49, "line_total": 7.49},
            {"product_id": "prod_018", "product_name": "Taj Mahal Tea 500g", "unit_label": "500g", "quantity": 1, "unit_price": 6.99, "line_total": 6.99},
        ],
        "subtotal": 40.46,
        "delivery_fee": 3.50,
        "total": 43.96,
        "delivery_address": {"id": "addr_001", "label": "Home", "line1": "14 Oak Drive", "line2": "", "city": "Cork", "postcode": "T12 AB12", "instructions": "Ring bell"},
        "status": "completed",
        "notes": "Please include invoice",
        "created_at": "2025-05-15T10:30:00",
        "whatsapp_notified": True
    },
    {
        "id": "ord_002",
        "customer_id": "cust_001",
        "guest_name": None,
        "guest_phone": None,
        "items": [
            {"product_id": "prod_012", "product_name": "Idhayam Sesame Oil 1L", "unit_label": "1L", "quantity": 2, "unit_price": 8.49, "line_total": 16.98},
            {"product_id": "prod_013", "product_name": "Amul Pure Ghee 1kg", "unit_label": "1kg", "quantity": 1, "unit_price": 18.99, "line_total": 18.99},
        ],
        "subtotal": 35.97,
        "delivery_fee": 3.50,
        "total": 39.47,
        "delivery_address": {"id": "addr_001", "label": "Home", "line1": "14 Oak Drive", "line2": "", "city": "Cork", "postcode": "T12 AB12", "instructions": "Ring bell"},
        "status": "new",
        "notes": None,
        "created_at": "2025-06-01T14:00:00",
        "whatsapp_notified": False
    }
]

USERS = {
    "+353871234567": {"id": "cust_001", "name": "Priya Nair", "password": "password123", "is_admin": False},
    "+353876543210": {"id": "cust_002", "name": "Rahul Sharma", "password": "password123", "is_admin": False},
    "admin": {"id": "admin_001", "name": "Admin", "password": "admin123", "is_admin": True},
}
