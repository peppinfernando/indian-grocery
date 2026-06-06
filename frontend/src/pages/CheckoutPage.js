import React, { useState } from 'react';
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

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    line1: '', line2: '', city: 'Cork', postcode: '', instructions: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (items.length === 0) { navigate('/cart'); return null; }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.line1.trim()) e.line1 = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.postcode.trim()) e.postcode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderData = {
        customer_id: user?.customer_id || null,
        guest_name: user ? null : form.name,
        guest_phone: user ? null : form.phone,
        items: items.map(i => ({ ...i })),
        delivery_address: {
          label: 'Home', line1: form.line1, line2: form.line2,
          city: form.city, postcode: form.postcode, instructions: form.instructions
        },
        notes: form.notes || null
      };
      const order = await createOrder(orderData);
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, field, placeholder, type = 'text' }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        style={errors[field] ? { borderColor: 'var(--danger)' } : {}}
      />
      {errors[field] && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors[field]}</span>}
    </div>
  );

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 20 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cart')} style={{ marginBottom: 16 }}>← Back to Cart</button>
        <h1 className="section-title">Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Contact */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Contact Details</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="Full Name *" field="name" placeholder="Your name" />
                <Field label="Phone Number *" field="phone" placeholder="+353..." type="tel" />
              </div>
            </div>

            {/* Delivery */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Delivery Address</h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <Field label="Address Line 1 *" field="line1" placeholder="House number & street" />
                <Field label="Address Line 2" field="line2" placeholder="Apartment, area (optional)" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="City *" field="city" placeholder="Cork" />
                  <Field label="Eircode *" field="postcode" placeholder="T12 XXXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Instructions</label>
                  <input className="form-input" placeholder="Ring bell, leave at door…" value={form.instructions} onChange={e => set('instructions', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card" style={{ padding: '20px 24px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Order Notes</h3>
              <textarea
                className="form-input"
                style={{ resize: 'vertical', minHeight: 80 }}
                placeholder="Any special requests or notes for your order…"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="card" style={{ padding: '20px 24px', position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
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
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span>€{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                  <span>{delivery === 0 ? <span style={{ color: 'var(--primary)', fontWeight: 600 }}>FREE</span> : `€${delivery.toFixed(2)}`}</span>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                  <span>Total</span><span style={{ color: 'var(--primary)' }}>€{total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
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
                  Ordering as guest · <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Sign in</span> for faster reorder
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
