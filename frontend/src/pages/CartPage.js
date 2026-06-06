import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/AppContext';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const delivery = subtotal >= 50 ? 0 : 3.50;
  const total = subtotal + delivery;

  if (items.length === 0) return (
    <div className="page-content">
      <div className="empty-state" style={{ paddingTop: 80 }}>
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>Browse Products</button>
      </div>
    </div>
  );

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 20, maxWidth: 700 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Your Cart ({items.length})</h1>
          <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear all</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {items.map(item => (
            <div key={item.product_id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
              <img
                src={item.image || 'https://via.placeholder.com/80x80?text=🥘'}
                alt={item.product_name}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', flexShrink: 0 }}
                onError={e => e.target.style.display = 'none'}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{item.product_name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.unit_label} · €{item.unit_price.toFixed(2)} each</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="qty-stepper">
                  <button className="qty-btn" onClick={() => updateQty(item.product_id, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', minWidth: 60, textAlign: 'right' }}>€{item.line_total.toFixed(2)}</span>
                <button onClick={() => removeItem(item.product_id)} style={{ background: 'none', border: 'none', fontSize: 18, color: 'var(--text-muted)', padding: 4, cursor: 'pointer' }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
              <span>{delivery === 0 ? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FREE</span> : `€${delivery.toFixed(2)}`}</span>
            </div>
            {delivery > 0 && (
              <p style={{ fontSize: 12, color: 'var(--secondary)', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                Add €{(50 - subtotal).toFixed(2)} more for free delivery
              </p>
            )}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>€{total.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }} onClick={() => navigate('/checkout')}>
            Proceed to Checkout →
          </button>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
