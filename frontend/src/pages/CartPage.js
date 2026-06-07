import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart();
  const { user } = useAuth();
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
      <div className="container" style={{ paddingTop: 20, maxWidth: 640 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>Cart ({items.length})</h1>
          <button className="btn btn-ghost btn-sm" onClick={clearCart}>Clear all</button>
        </div>

        {/* Sign in prompt — single line */}
        {!user && (
          <div style={{
            background: 'var(--surface-2)', borderRadius: 'var(--radius-md)',
            padding: '12px 16px', marginBottom: 16, border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'nowrap'
          }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap' }}>
              💡 Sign in for faster reorder
            </p>
            <button
              className="btn btn-outline btn-sm"
              style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        )}

        {/* Cart items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {items.map(item => (
            <div key={item.product_id} className="card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Image */}
              <img
                src={item.image || ''}
                alt={item.product_name}
                style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', flexShrink: 0 }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              {/* Name + price */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.unit_label} · €{item.unit_price.toFixed(2)} each</p>
              </div>
              {/* Qty stepper + price + remove — all on one line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div className="qty-stepper">
                  <button className="qty-btn" onClick={() => updateQty(item.product_id, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.product_id, item.quantity + 1)}>+</button>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', minWidth: 52, textAlign: 'right', fontFamily: 'var(--font-display)' }}>€{item.line_total.toFixed(2)}</span>
                <button
                  onClick={() => removeItem(item.product_id)}
                  style={{ background: 'none', border: 'none', fontSize: 16, color: 'var(--text-light)', padding: 4, cursor: 'pointer', flexShrink: 0 }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: '20px 22px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, fontFamily: 'var(--font-display)' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
              <span>{delivery === 0
                ? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>FREE</span>
                : `€${delivery.toFixed(2)}`}
              </span>
            </div>
            {delivery > 0 && (
              <p style={{ fontSize: 12, color: 'var(--secondary)', background: 'var(--surface-2)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--border)' }}>
                Add €{(50 - subtotal).toFixed(2)} more for free delivery
              </p>
            )}
            <hr />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{total.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 18 }} onClick={() => navigate('/checkout')}>
            Checkout →
          </button>
          <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
