import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../context/AppContext';
import { getDashboard, getProducts, getOrders, updateProduct, updateOrderStatus, deleteProduct } from '../hooks/useApi';

// ── Cloudinary upload helper ─────────────────────────────────────
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'YOUR_UPLOAD_PRESET';

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: formData
  });
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(data.error?.message || 'Upload failed');
}

// ── Drag & Drop Image Upload Component ──────────────────────────
function ImageUploader({ currentImage, onUpload, productName }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const inputRef = useRef();
  const { showToast } = useToast();

  const handleFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) { showToast('Please drop an image file'); return; }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setPreview(url);
      onUpload(url);
      showToast('Image uploaded ✓');
    } catch (err) {
      showToast('Upload failed — check Cloudinary config');
      setPreview(currentImage || '');
    } finally { setUploading(false); }
  }, [currentImage, onUpload, showToast]);

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div>
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''}`}
        style={{ position: 'relative', minHeight: 120 }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img src={preview} alt={productName}
              style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8, display: 'block' }} />
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 8, opacity: 0, transition: '0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >
              <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>Click or drop to replace</span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
              {dragging ? 'Drop image here' : 'Drag & drop image or click to browse'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-light)' }}>JPG, PNG, WEBP supported</p>
          </div>
        )}
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8
          }}>
            <div className="spinner" style={{ margin: 0 }} />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// ── Product Edit Modal ───────────────────────────────────────────
function ProductEditModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    sale_price: product.sale_price || '',
    stock_status: product.stock_status,
    stock_qty: product.stock_qty,
    description: product.description,
    featured: product.featured,
    seasonal: product.seasonal,
    images: product.images || [],
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        ...form,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_qty: parseInt(form.stock_qty),
      };
      await onSave(product.id, updates);
      onClose();
    } catch { showToast('Save failed'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      backdropFilter: 'blur(4px)'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflow: 'auto'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800 }}>Edit Product</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Image upload */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <ImageUploader
              currentImage={form.images[0]}
              productName={form.name}
              onUpload={url => set('images', [url])}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Price (€)</label>
              <input className="form-input" type="number" step="0.01" value={form.price}
                onChange={e => set('price', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sale Price (€) — optional</label>
              <input className="form-input" type="number" step="0.01" value={form.sale_price}
                placeholder="Leave blank for no sale"
                onChange={e => set('sale_price', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Stock Status</label>
              <select className="form-input" value={form.stock_status} onChange={e => set('stock_status', e.target.value)}>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input className="form-input" type="number" value={form.stock_qty}
                onChange={e => set('stock_qty', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" style={{ minHeight: 80, resize: 'vertical' }}
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
              <span>Featured product</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.seasonal} onChange={e => set('seasonal', e.target.checked)} />
              <span>Seasonal item</span>
            </label>
          </div>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Nav ────────────────────────────────────────────────────
function AdminNav({ tab, setTab }) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products', label: '📦 Products' },
    { id: 'orders', label: '🧾 Orders' },
    { id: 'customers', label: '👥 Customers' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24, overflowX: 'auto', border: '1px solid var(--border)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex: '0 0 auto', padding: '10px 18px', border: 'none', borderRadius: 'var(--radius-md)',
          background: tab === t.id ? 'var(--primary)' : 'transparent',
          fontWeight: 700, fontSize: 13, color: tab === t.id ? '#0A0A0A' : 'var(--text-muted)',
          cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-display)'
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, color = 'var(--primary)' }) {
  return (
    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{value}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      </div>
    </div>
  );
}

function DashboardTab({ data }) {
  if (!data) return <div className="spinner" />;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        <StatCard icon="🧾" label="Total Orders" value={data.total_orders} />
        <StatCard icon="🔔" label="New Orders" value={data.new_orders} color="var(--secondary)" />
        <StatCard icon="⏳" label="Pending" value={data.pending_orders} color="var(--accent)" />
        <StatCard icon="⚠️" label="Low Stock" value={data.low_stock_count} color="var(--danger)" />
        <StatCard icon="👥" label="Customers" value={data.total_customers} />
        <StatCard icon="💶" label="Revenue" value={`€${data.total_revenue}`} color="var(--primary)" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Orders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.recent_orders.map(o => (
              <div key={o.id} className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>#{o.id}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.items.length} items</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{o.total.toFixed(2)}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best Sellers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.best_sellers.map((p, i) => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', minWidth: 24 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.category}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const { showToast } = useToast();

  useEffect(() => { getProducts().then(setProducts).finally(() => setLoading(false)); }, []);

  const handleSave = async (id, updates) => {
    await updateProduct(id, updates);
    setProducts(ps => ps.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Product updated ✓');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(ps => ps.filter(p => p.id !== id));
    showToast('Product deleted');
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => setEditingProduct(null)}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Products ({products.length})</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click ✏️ to edit price, image & stock</p>
      </div>
      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <table>
          <thead>
            <tr>
              {['Image', 'Product', 'Price', 'Sale', 'Status', 'Qty', 'Featured', 'Actions'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: 'var(--surface-2)', flexShrink: 0 }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🥘</div>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.unit_label} · {p.category}</div>
                </td>
                <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{p.price.toFixed(2)}</td>
                <td style={{ color: 'var(--danger)', fontSize: 12 }}>{p.sale_price ? `€${p.sale_price.toFixed(2)}` : '—'}</td>
                <td>
                  <span className={`badge ${p.stock_status === 'in_stock' ? 'badge-green' : p.stock_status === 'low_stock' ? 'badge-orange' : 'badge-red'}`}>
                    {p.stock_status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{p.stock_qty}</td>
                <td>{p.featured ? <span style={{ color: 'var(--primary)', fontSize: 16 }}>★</span> : <span style={{ color: 'var(--text-light)' }}>☆</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => setEditingProduct(p)}>✏️ Edit</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => { getOrders().then(setOrders).finally(() => setLoading(false)); }, []);

  const handleStatus = async (id, status) => {
    const updated = await updateOrderStatus(id, status);
    setOrders(os => os.map(o => o.id === id ? updated : o));
    showToast('Status updated ✓');
  };

  const statuses = ['new', 'confirmed', 'packed', 'out_for_delivery', 'completed', 'cancelled'];
  const statusColor = { new: 'var(--secondary)', confirmed: 'var(--primary)', packed: 'var(--primary)', out_for_delivery: 'var(--accent)', completed: 'var(--primary)', cancelled: 'var(--danger)' };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: 16 }}>Orders ({orders.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders.map(order => (
          <div key={order.id} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 13, fontFamily: 'var(--font-display)' }}>#{order.id}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {order.guest_name || 'Registered'} · {new Date(order.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                  📍 {order.delivery_address.line1}, {order.delivery_address.city}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{order.total.toFixed(2)}</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              {order.items.map(i => `${i.product_name} ×${i.quantity}`).join(' · ')}
            </p>
            <select
              value={order.status}
              onChange={e => handleStatus(order.id, e.target.value)}
              style={{
                border: `1.5px solid ${statusColor[order.status] || 'var(--border)'}`,
                borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700,
                color: statusColor[order.status], background: 'var(--surface-2)',
                fontFamily: 'var(--font-display)', letterSpacing: '0.04em'
              }}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    if (!user?.is_admin) { navigate('/login'); return; }
    getDashboard().then(setDashData);
  }, [user, navigate]);

  if (!user?.is_admin) return null;

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Admin Panel
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>JK Seasonal management</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Storefront</button>
        </div>
        <AdminNav tab={tab} setTab={setTab} />
        {tab === 'dashboard' && <DashboardTab data={dashData} />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'customers' && (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>Customer Management</h3>
            <p>Coming in Phase 2</p>
          </div>
        )}
      </div>
    </div>
  );
}
