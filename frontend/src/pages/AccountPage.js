import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart, useToast } from '../context/AppContext';
import { getOrders } from '../hooks/useApi';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    getOrders({ customer_id: user.customer_id }).then(setOrders).finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addItem({
        id: item.product_id, name: item.product_name, unit_label: item.unit_label,
        price: item.unit_price, sale_price: null, images: []
      }, item.quantity);
    });
    showToast(`${order.items.length} items re-added to cart 🛒`);
    navigate('/cart');
  };

  const statusColor = { new: 'badge-orange', confirmed: 'badge-green', packed: 'badge-green', out_for_delivery: 'badge-purple', completed: 'badge-green', cancelled: 'badge-red' };

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 20, maxWidth: 700 }}>
        {/* Profile header */}
        <div className="card" style={{ padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white', fontWeight: 700 }}>
              {user.name[0]}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Member account</p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: 4, marginBottom: 20 }}>
          {['orders', 'profile'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: 'var(--radius-md)',
                background: tab === t ? 'var(--white)' : 'transparent',
                fontWeight: 600, fontSize: 14, color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', transition: 'all 0.18s'
              }}
            >
              {t === 'orders' ? '📦 Orders' : '👤 Profile'}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <>
            <h2 className="section-title">Order History</h2>
            {loading ? <div className="spinner" /> : orders.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your orders here</p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>Shop Now</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {orders.map(order => (
                  <div key={order.id} className="card" style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>#{order.id}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{new Date(order.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${statusColor[order.status] || 'badge-green'}`} style={{ textTransform: 'capitalize' }}>{order.status.replace('_', ' ')}</span>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)' }}>€{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                      {order.items.map(i => `${i.product_name} ×${i.quantity}`).join(' · ')}
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => handleReorder(order)}>
                      🔄 Reorder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'profile' && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Profile Details</h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={user.name} readOnly style={{ background: 'var(--surface)' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Customer ID</label>
                <input className="form-input" value={user.customer_id} readOnly style={{ background: 'var(--surface)', fontSize: 13 }} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>Profile editing coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
