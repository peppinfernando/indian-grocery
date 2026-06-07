import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

const ADMIN_WA = '353894722935';

function buildAdminMessage(order) {
  const items = (order.items || []).map(i => i.product_name + ' x' + i.quantity + ' - EUR ' + (i.line_total || 0).toFixed(2)).join('\n');
  const addr = order.delivery_address || {};
  return 'New Order #' + order.id + '\n\n' +
    'Customer: ' + (order.guest_name || 'Registered') + '\n' +
    'Phone: ' + (order.guest_phone || 'N/A') + '\n\n' +
    'Items:\n' + items + '\n\n' +
    'Total: EUR ' + (order.total || 0).toFixed(2) + '\n' +
    'Delivery fee: EUR ' + (order.delivery_fee || 0).toFixed(2) + '\n\n' +
    'Deliver to:\n' + (addr.line1 || '') + ', ' + (addr.city || '') + ', ' + (addr.postcode || '') + '\n' +
    (addr.instructions ? 'Note: ' + addr.instructions : '') + '\n' +
    (order.notes ? 'Order notes: ' + order.notes : '');
}

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const notified = useRef(false);
  const order = state && state.order;

  useEffect(function() {
    if (order && !notified.current) {
      notified.current = true;
      // Auto-open WhatsApp to notify admin
      setTimeout(function() {
        const msg = encodeURIComponent(buildAdminMessage(order));
        window.open('https://wa.me/' + ADMIN_WA + '?text=' + msg, '_blank');
      }, 1500);
    }
  }, [order]);

  if (!order) { navigate('/'); return null; }

  const waMsg = encodeURIComponent(buildAdminMessage(order));

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 40, maxWidth: 540, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 8, fontStyle: 'italic' }}>Order Placed!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>Order <strong>#{order.id}</strong></p>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>
          Thank you! We are confirming your order and will be in touch shortly.
        </p>

        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, textAlign: 'left' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Order Details</h3>
          {(order.items || []).map(function(i) {
            return (
              <div key={i.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>{i.product_name} x{i.quantity}</span>
                <span style={{ fontWeight: 600 }}>EUR {(i.line_total || 0).toFixed(2)}</span>
              </div>
            );
          })}
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, marginTop: 10 }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>EUR {(order.total || 0).toFixed(2)}</span>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            Delivering to: {order.delivery_address && order.delivery_address.line1}, {order.delivery_address && order.delivery_address.city}, {order.delivery_address && order.delivery_address.postcode}
          </div>
        </div>

        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: 16, fontSize: 13, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Order notification sent to admin via WhatsApp</p>
          <p>If WhatsApp did not open automatically, tap the button below to notify us.</p>
        </div>

        <a href={'https://wa.me/' + ADMIN_WA + '?text=' + waMsg} target="_blank" rel="noreferrer"
          className="btn btn-secondary btn-lg"
          style={{ width: '100%', marginBottom: 10, display: 'flex', textDecoration: 'none', justifyContent: 'center' }}>
          💬 Send Order to WhatsApp
        </a>

        {!user && (
          <div className="card" style={{ padding: '16px 20px', marginBottom: 14, background: 'var(--surface-2)' }}>
            <p style={{ fontSize: 13, marginBottom: 10 }}>Save time next order - create an account to reorder in one tap.</p>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={function() { navigate('/register'); }}>Create Account</button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={function() { navigate('/'); }}>Home</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={function() { navigate('/shop'); }}>Shop Again</button>
        </div>
      </div>
    </div>
  );
}
