import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../context/AppContext';
import { getDashboard, getProducts, getOrders, updateProduct, updateOrderStatus, deleteProduct } from '../hooks/useApi';

function AdminNav({ tab, setTab }) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products', label: '📦 Products' },
    { id: 'orders', label: '🧾 Orders' },
    { id: 'customers', label: '👥 Customers' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 24, overflowX: 'auto' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{
          flex: '0 0 auto', padding: '10px 18px', border: 'none', borderRadius: 'var(--radius-md)',
          background: tab === t.id ? 'var(--white)' : 'transparent',
          fontWeight: 600, fontSize: 14, color: tab === t.id ? 'var(--primary)' : 'var(--text-muted)',
          cursor: 'pointer', boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none', transition: 'all 0.18s', whiteSpace: 'nowrap'
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = 'var(--primary)' }) {
  return (
    <div className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 800, color }}>{value}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
    </div>
  );
}

function DashboardTab({ data }) {
  if (!data) return <div className="spinner" />;
  const statusColor = { new: '#E8841A', confirmed: '#3D7A4F', packed: '#3D7A4F', out_for_delivery: '#7B4F8C', completed: '#3D7A4F', cancelled: '#D94040' };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard icon="🧾" label="Total Orders" value={data.total_orders} />
        <StatCard icon="🔔" label="New Orders" value={data.new_orders} color="var(--secondary)" />
        <StatCard icon="⏳" label="Pending" value={data.pending_orders} color="var(--accent)" />
        <StatCard icon="⚠️" label="Low Stock" value={data.low_stock_count} color="var(--danger)" />
        <StatCard icon="👥" label="Customers" value={data.total_customers} />
        <StatCard icon="💶" label="Total Revenue" value={`€${data.total_revenue}`} color="var(--primary)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Recent Orders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.recent_orders.map(o => (
              <div key={o.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>#{o.id}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.items.length} items</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>€{o.total.toFixed(2)}</p>
                  <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[o.status] || '#666', textTransform: 'capitalize' }}>{o.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Best Sellers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.best_sellers.map((p, i) => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-muted)', minWidth: 24 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.category}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>€{p.price.toFixed(2)}</span>
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
  const [editing, setEditing] = useState(null);
  const { showToast } = useToast();

  useEffect(() => { getProducts().then(setProducts).finally(() => setLoading(false)); }, []);

  const handleUpdate = async (id, field, value) => {
    try {
      await updateProduct(id, { [field]: value });
      setProducts(ps => ps.map(p => p.id === id ? { ...p, [field]: value } : p));
      showToast('Updated ✓');
      setEditing(null);
    } catch { showToast('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(ps => ps.filter(p => p.id !== id));
    showToast('Product deleted');
  };

  if (loading) return <div className="spinner" />;

  const stockColors = { in_stock: 'badge-green', low_stock: 'badge-orange', out_of_stock: 'badge-red' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>Products ({products.length})</h2>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--surface)' }}>
              {['Product', 'Category', 'Price', 'Stock Status', 'Qty', 'Featured', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>
                  <div>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.unit_label}</div>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{p.category}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                  {editing === p.id + '_price' ? (
                    <input type="number" step="0.01" defaultValue={p.price} autoFocus
                      style={{ width: 80, padding: '4px 8px', border: '1.5px solid var(--primary)', borderRadius: 6 }}
                      onBlur={e => handleUpdate(p.id, 'price', parseFloat(e.target.value))}
                      onKeyDown={e => e.key === 'Escape' && setEditing(null)} />
                  ) : (
                    <span onClick={() => setEditing(p.id + '_price')} style={{ cursor: 'pointer' }} title="Click to edit">€{p.price.toFixed(2)}</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={p.stock_status}
                    onChange={e => handleUpdate(p.id, 'stock_status', e.target.value)}
                    style={{ border: '1.5px solid var(--border)', borderRadius: 6, padding: '4px 8px', fontSize: 12, background: 'var(--white)' }}
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  {editing === p.id + '_qty' ? (
                    <input type="number" defaultValue={p.stock_qty} autoFocus
                      style={{ width: 60, padding: '4px 8px', border: '1.5px solid var(--primary)', borderRadius: 6 }}
                      onBlur={e => handleUpdate(p.id, 'stock_qty', parseInt(e.target.value))}
                      onKeyDown={e => e.key === 'Escape' && setEditing(null)} />
                  ) : (
                    <span onClick={() => setEditing(p.id + '_qty')} style={{ cursor: 'pointer' }} title="Click to edit">{p.stock_qty}</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  <input type="checkbox" checked={p.featured} onChange={e => handleUpdate(p.id, 'featured', e.target.checked)} />
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)', fontSize: 12 }} onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>💡 Click price or qty to edit inline. Changes save on blur.</p>
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
  const statusColor = { new: '#E8841A', confirmed: '#3D7A4F', packed: '#3D7A4F', out_for_delivery: '#7B4F8C', completed: '#3D7A4F', cancelled: '#D94040' };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <h2 className="section-title" style={{ marginBottom: 16 }}>Orders ({orders.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.map(order => (
          <div key={order.id} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>#{order.id}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {order.guest_name || 'Registered customer'} ·{' '}
                  {new Date(order.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  📍 {order.delivery_address.line1}, {order.delivery_address.city}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>€{order.total.toFixed(2)}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>+€{order.delivery_fee.toFixed(2)} delivery</p>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
              {order.items.map(i => `${i.product_name} ×${i.quantity}`).join(' · ')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <select
                value={order.status}
                onChange={e => handleStatus(order.id, e.target.value)}
                style={{
                  border: `1.5px solid ${statusColor[order.status] || '#666'}`,
                  borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 600,
                  color: statusColor[order.status], background: 'var(--white)'
                }}
              >
                {statuses.map(s => (
                  <option key={s} value={s} style={{ color: statusColor[s] || '#666', textTransform: 'capitalize' }}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {order.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Note: {order.notes}</p>}
            </div>
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
      <div className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>
            🏪 Admin Panel
          </h1>
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
            <p>Full customer list and search coming in Phase 2</p>
          </div>
        )}
      </div>
    </div>
  );
}
