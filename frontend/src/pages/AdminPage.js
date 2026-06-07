import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../context/AppContext';
import { getDashboard, getProducts, getOrders, getCategories, updateProduct, updateOrderStatus, deleteProduct } from '../hooks/useApi';

const ADMIN_WHATSAPP = '353894722935';
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';

async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error('Upload failed');
}

// ── Image Uploader ──────────────────────────────────────────────
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
      setPreview(url); onUpload(url); showToast('Image uploaded ✓');
    } catch { showToast('Upload failed — check Cloudinary config'); setPreview(currentImage || ''); }
    finally { setUploading(false); }
  }, [currentImage, onUpload, showToast]);

  return (
    <div>
      <div className={`drop-zone ${dragging ? 'dragging' : ''}`} style={{ position: 'relative', minHeight: 110 }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}>
        {preview ? (
          <img src={preview} alt={productName} style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 8 }} />
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{dragging ? 'Drop here' : 'Drag & drop or click to upload'}</p>
          </div>
        )}
        {uploading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <div className="spinner" style={{ margin: 0 }} />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// ── Product Edit Modal ──────────────────────────────────────────
function ProductEditModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product.name, price: product.price,
    sale_price: product.sale_price || '',
    stock_status: product.stock_status, stock_qty: product.stock_qty,
    description: product.description, featured: product.featured,
    seasonal: product.seasonal, images: product.images || [],
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(product.id, { ...form, price: parseFloat(form.price), sale_price: form.sale_price ? parseFloat(form.sale_price) : null, stock_qty: parseInt(form.stock_qty) });
      onClose();
    } catch { showToast('Save failed'); }
    finally { setSaving(false); }
  };

  const inp = { padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', width: '100%', fontFamily: 'var(--font-body)' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', border: '1px solid var(--border)' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>Edit Product</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <ImageUploader currentImage={form.images[0]} productName={form.name} onUpload={url => set('images', [url])} />
          </div>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Price (€)</label>
              <input style={inp} type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sale Price (€)</label>
              <input style={inp} type="number" step="0.01" value={form.sale_price} placeholder="Optional" onChange={e => set('sale_price', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Stock Status</label>
              <select style={{ ...inp }} value={form.stock_status} onChange={e => set('stock_status', e.target.value)}>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input style={inp} type="number" value={form.stock_qty} onChange={e => set('stock_qty', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={form.seasonal} onChange={e => set('seasonal', e.target.checked)} /> Seasonal
            </label>
          </div>
        </div>
        <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Nav ───────────────────────────────────────────────────
function AdminNav({ tab, setTab }) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products', label: '📦 Products' },
    { id: 'orders', label: '🧾 Orders' },
    { id: 'categories', label: '🏷️ Categories' },
    { id: 'customers', label: '👥 Customers' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24, overflowX: 'auto', border: '1px solid var(--border)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex: '0 0 auto', padding: '9px 16px', border: 'none', borderRadius: 'var(--radius-md)',
          background: tab === t.id ? 'var(--primary)' : 'transparent',
          fontWeight: 600, fontSize: 13, color: tab === t.id ? '#fff' : 'var(--text-muted)',
          cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────
function DashboardTab({ data, setTab }) {
  if (!data) return <div className="spinner" />;

  const StatCard = ({ icon, label, value, color = 'var(--primary)', onClick, sub }) => (
    <div className="card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.15s' }}
      onClick={onClick}
      onMouseEnter={e => onClick && (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={e => onClick && (e.currentTarget.style.transform = 'none')}
    >
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: color + '18', border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{value}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: color, marginTop: 2 }}>{sub}</p>}
      </div>
      {onClick && <span style={{ marginLeft: 'auto', color: 'var(--text-light)', fontSize: 16 }}>→</span>}
    </div>
  );

  const statusColor = { new: 'var(--secondary)', confirmed: 'var(--primary)', packed: 'var(--primary)', out_for_delivery: '#7b35cc', completed: 'var(--primary)', cancelled: 'var(--danger)' };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        <StatCard icon="🧾" label="Total Orders" value={data.total_orders} onClick={() => setTab('orders')} sub="Click to view all" />
        <StatCard icon="🔔" label="New Orders" value={data.new_orders} color="var(--secondary)" onClick={() => setTab('orders')} sub="Needs attention" />
        <StatCard icon="⏳" label="Pending" value={data.pending_orders} color="#7b35cc" onClick={() => setTab('orders')} />
        <StatCard icon="⚠️" label="Low Stock" value={data.low_stock_count} color="var(--danger)" onClick={() => setTab('products')} sub="Click to manage" />
        <StatCard icon="👥" label="Customers" value={data.total_customers} onClick={() => setTab('customers')} />
        <StatCard icon="💶" label="Revenue" value={`€${data.total_revenue}`} color="var(--primary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Orders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Orders</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setTab('orders')}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.recent_orders.map(o => (
              <div key={o.id} className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setTab('orders')}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700 }}>#{o.id}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.items?.length} items</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{o.total?.toFixed(2)}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: statusColor[o.status] || '#666', textTransform: 'uppercase' }}>{o.status?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best Sellers</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setTab('products')}>Manage →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.best_sellers.map((p, i) => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                onClick={() => setTab('products')}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)', minWidth: 24 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.category}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{p.price?.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Products Tab ────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filter, setFilter] = useState('all'); // all, featured, seasonal, low_stock
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

  const filtered = products.filter(p => {
    if (filter === 'featured') return p.featured;
    if (filter === 'seasonal') return p.seasonal;
    if (filter === 'low_stock') return p.stock_status === 'low_stock' || p.stock_status === 'out_of_stock';
    return true;
  });

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {editingProduct && <ProductEditModal product={editingProduct} onSave={handleSave} onClose={() => setEditingProduct(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Products ({filtered.length})</h2>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'all', label: `All (${products.length})` },
            { id: 'featured', label: `⭐ Featured (${products.filter(p => p.featured).length})` },
            { id: 'seasonal', label: `🍂 Seasonal (${products.filter(p => p.seasonal).length})` },
            { id: 'low_stock', label: `⚠️ Low Stock (${products.filter(p => p.stock_status !== 'in_stock').length})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={filter === f.id ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ whiteSpace: 'nowrap' }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <table>
          <thead>
            <tr>{['Image', 'Product', 'Price', 'Sale', 'Status', 'Qty', '⭐', '🍂', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', background: 'var(--surface-2)' }}>
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🥘</div>}
                  </div>
                </td>
                <td><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.unit_label} · {p.category}</div></td>
                <td style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{p.price?.toFixed(2)}</td>
                <td style={{ color: 'var(--danger)', fontSize: 12 }}>{p.sale_price ? `€${p.sale_price?.toFixed(2)}` : '—'}</td>
                <td><span className={`badge ${p.stock_status === 'in_stock' ? 'badge-green' : p.stock_status === 'low_stock' ? 'badge-orange' : 'badge-red'}`}>{p.stock_status?.replace('_', ' ')}</span></td>
                <td style={{ fontWeight: 600 }}>{p.stock_qty}</td>
                <td>{p.featured ? '⭐' : '—'}</td>
                <td>{p.seasonal ? '🍂' : '—'}</td>
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

// ── Orders Tab ──────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  useEffect(() => { getOrders().then(setOrders).finally(() => setLoading(false)); }, []);

  const handleStatus = async (id, status) => {
    const updated = await updateOrderStatus(id, status);
    setOrders(os => os.map(o => o.id === id ? updated : o));
    showToast('Status updated ✓');
  };

  const notifyWhatsApp = (order) => {
    const items = order.items.map(i => `• ${i.product_name} x${i.quantity} — €${i.line_total?.toFixed(2)}`).join('\n');
    const addr = order.delivery_address;
    const msg = encodeURIComponent(`🛒 New Order #${order.id}\n\nCustomer: ${order.guest_name || 'Registered'}\nPhone: ${order.guest_phone || 'N/A'}\n\nItems:\n${items}\n\nTotal: €${order.total?.toFixed(2)}\n\nDeliver to:\n${addr?.line1}, ${addr?.city}, ${addr?.postcode}\n${addr?.instructions || ''}`);
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, '_blank');
  };

  const statuses = ['new', 'confirmed', 'packed', 'out_for_delivery', 'completed', 'cancelled'];
  const statusColor = { new: 'var(--secondary)', confirmed: 'var(--primary)', packed: 'var(--primary)', out_for_delivery: '#7b35cc', completed: 'var(--primary)', cancelled: 'var(--danger)' };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Orders ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'new', 'confirmed', 'packed', 'out_for_delivery', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={filter === s ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
              {s === 'all' ? `All (${orders.length})` : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(order => (
          <div key={order.id} className="card" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, fontFamily: 'var(--font-display)' }}>#{order.id}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {order.guest_name || 'Registered'} · {order.guest_phone || ''}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 2 }}>
                  📍 {order.delivery_address?.line1}, {order.delivery_address?.city}, {order.delivery_address?.postcode}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{order.total?.toFixed(2)}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>+€{order.delivery_fee?.toFixed(2)} delivery</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              {order.items?.map(i => `${i.product_name} ×${i.quantity}`).join(' · ')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <select value={order.status} onChange={e => handleStatus(order.id, e.target.value)}
                style={{ border: `1.5px solid ${statusColor[order.status] || 'var(--border)'}`, borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: statusColor[order.status], background: 'var(--surface)', fontFamily: 'var(--font-body)' }}>
                {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
              </select>
              <button className="btn btn-ghost btn-sm" style={{ color: '#25D366', borderColor: '#25D366' }} onClick={() => notifyWhatsApp(order)}>
                💬 WhatsApp
              </button>
              {order.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>📝 {order.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Categories Tab ──────────────────────────────────────────────
function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getCategories(), getProducts()])
      .then(([c, p]) => { setCategories(c); setProducts(p); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  const catProducts = selectedCat ? products.filter(p => p.category === selectedCat) : [];
  const seasonal = products.filter(p => p.seasonal);
  const featured = products.filter(p => p.featured);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
      {/* Category list */}
      <div>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Special filters */}
          {[
            { id: '__seasonal', name: 'Seasonal Items', icon: '🍂', count: seasonal.length },
            { id: '__featured', name: 'Featured Products', icon: '⭐', count: featured.length },
          ].map(c => (
            <button key={c.id} onClick={() => setSelectedCat(c.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: selectedCat === c.id ? 'var(--primary)' : 'var(--surface)',
                color: selectedCat === c.id ? '#fff' : 'var(--text)',
                border: `1px solid ${selectedCat === c.id ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left', width: '100%',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              }}>
              <span>{c.icon}</span>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{c.count}</span>
            </button>
          ))}
          <hr />
          {categories.map(c => (
            <button key={c.id} onClick={() => setSelectedCat(c.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                background: selectedCat === c.name ? 'var(--primary)' : 'var(--surface)',
                color: selectedCat === c.name ? '#fff' : 'var(--text)',
                border: `1px solid ${selectedCat === c.name ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left', width: '100%',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              }}>
              <span>{c.icon}</span>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{products.filter(p => p.category === c.name).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products in selected category */}
      <div>
        {!selectedCat ? (
          <div className="empty-state">
            <div className="icon">👈</div>
            <h3>Select a category</h3>
            <p>Click a category to see its products</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, fontFamily: 'var(--font-display)' }}>
              {selectedCat === '__seasonal' ? '🍂 Seasonal Items' : selectedCat === '__featured' ? '⭐ Featured Products' : selectedCat}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>({catProducts.length || seasonal.length || featured.length} products)</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {(selectedCat === '__seasonal' ? seasonal : selectedCat === '__featured' ? featured : catProducts).map(p => (
                <div key={p.id} className="card" style={{ padding: 12 }}>
                  <div style={{ aspectRatio: '1', background: 'var(--surface-2)', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🥘</div>}
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{p.name}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{(p.sale_price || p.price)?.toFixed(2)}</p>
                  <span className={`badge ${p.stock_status === 'in_stock' ? 'badge-green' : p.stock_status === 'low_stock' ? 'badge-orange' : 'badge-red'}`} style={{ marginTop: 6, display: 'inline-block' }}>{p.stock_status?.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Admin Page ─────────────────────────────────────────────
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
      <div className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>Admin Panel</h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>JK Seasonal management</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>← Storefront</button>
        </div>
        <AdminNav tab={tab} setTab={setTab} />
        {tab === 'dashboard' && <DashboardTab data={dashData} setTab={setTab} />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'categories' && <CategoriesTab />}
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
