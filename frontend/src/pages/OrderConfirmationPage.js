import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const order = state?.order;

  if (!order) { navigate('/'); return null; }

  const waMsg = encodeURIComponent(
    `Hi! I just placed order #${order.id} on Spice & Grain for €${order.total.toFixed(2)}. Looking forward to delivery!`
  );

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 40, maxWidth: 560, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Order <strong>#{order.id}</strong></p>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 15 }}>
          Thanks for your order. We'll be in touch shortly to confirm delivery.
        </p>

        <div className="card" style={{ padding: '20px 24px', marginBottom: 20, textAlign: 'left' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Order Details</h3>
          {order.items.map(i => (
            <div key={i.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>{i.product_name} × {i.quantity}</span>
              <span style={{ fontWeight: 600 }}>€{i.line_total.toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 10 }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>€{order.total.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
            📍 {order.delivery_address.line1}, {order.delivery_address.city}, {order.delivery_address.postcode}
          </div>
        </div>

        <a
          href={`https://wa.me/353894722935?text=${waMsg}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary btn-lg"
          style={{ width: '100%', marginBottom: 12, display: 'flex' }}
        >
          💬 Confirm via WhatsApp
        </a>

        {!user && (
          <div className="card" style={{ padding: '16px 20px', marginBottom: 16, background: 'var(--surface)' }}>
            <p style={{ fontSize: 14, marginBottom: 10 }}>
              💡 <strong>Save time next order</strong> — create an account to reorder in one tap.
            </p>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/register')}>
              Create Account
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => navigate('/')}>Home</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/shop')}>Shop Again</button>
        </div>
      </div>
    </div>
  );
}
