import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth, useToast } from '../context/AppContext';
import { createOrder } from '../hooks/useApi';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const delivery = subtotal >= 50 ? 0 : 3.50;
  const total = subtotal + delivery;

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('Cork');
  const [postcode, setPostcode] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (items.length === 0) { navigate('/cart'); return null; }

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Required';
    if (!phone.trim()) e.phone = 'Required';
    if (!line1.trim()) e.line1 = 'Required';
    if (!city.trim()) e.city = 'Required';
    if (!postcode.trim()) e.postcode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderData = {
        customer_id: user?.customer_id || null,
        guest_name: user ? null : name,
        guest_phone: user ? null : phone,
        items: items.map(i => ({ ...i })),
        delivery_address: {
          label: 'Home', line1, line2, city, postcode, instructions
        },
        notes: notes || null
      };
      const order = await createOrder(orderData);
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    border: `1.5px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface-2)',
    color: 'var(--text)',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    WebkitTextFillColor: 'var(--text)',
    boxSizing: 'border-box',
  });

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cart')} style={{ marginBottom: 16 }}>← Back to Cart</button>
        <h1 className="section-title">Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Contact */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Contact Details</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={inputStyle('name')}
                  />
                  {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+353..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={inputStyle('phone')}
                  />
                  {errors.phone && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Delivery Address</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    placeholder="House number & street"
                    value={line1}
                    onChange={e => setLine1(e.target.value)}
                    style={inputStyle('line1')}
                  />
                  {errors.line1 && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.line1}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    placeholder="Apartment, area (optional)"
                    value={line2}
                    onChange={e => setLine2(e.target.value)}
                    style={inputStyle('line2')}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      placeholder="Cork"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      style={inputStyle('city')}
                    />
                    {errors.city && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Eircode *</label>
                    <input
                      type="text"
                      placeholder="T12 XXXX"
                      value={postcode}
                      onChange={e => setPostcode(e.target.value)}
                      style={inputStyle('postcode')}
                    />
                    {errors.postcode && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.postcode}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Instructions</label>
                  <input
                    type="text"
                    placeholder="Ring bell, leave at door…"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    style={inputStyle('instructions')}
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Order Notes</h3>
              <textarea
                placeholder="Any special requests…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ ...inputStyle('notes'), minHeight: 80, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ padding: '20px 24px', position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, fontFamily: 'var(--font-display)' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {items.map(i => (
                  <div key={i.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', flex: 1 }}>{i.product_name} × {i.quantity}</span>
                    <span style={{ fontWeight: 600 }}>€{i.line_total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, marginTop: 12 }}>
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
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', marginTop: 14, border: '1px solid var(--border)' }}>
                💳 Payment on delivery · Cash or card accepted
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 16 }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Placing Order…' : 'Place Order →'}
              </button>
              {!user && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                  Ordering as guest ·{' '}
                  <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in</span>
                  {' '}for faster reorder
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
