import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth, useToast } from '../context/AppContext';
import { createOrder } from '../hooks/useApi';

const EIRCODE_API = 'https://jk-eircode-api.peppinfernando.workers.dev';

async function lookupEircode(eircode) {
  const clean = eircode.replace(/\s/g, '').toUpperCase();
  const formatted = clean.length >= 7 ? `${clean.slice(0,3)} ${clean.slice(3)}` : clean;
  const res = await fetch(`${EIRCODE_API}/eircode?q=${encodeURIComponent(formatted)}`);
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || 'Not found');
  return data;
}

function parseAddress(formattedAddress) {
  // formattedAddress: "14 Main Street, Ballincollig, Co. Cork, T12 A123, Ireland"
  const parts = formattedAddress.split(',').map(p => p.trim()).filter(Boolean);
  // Remove "Ireland" from end
  const filtered = parts.filter(p => p !== 'Ireland');
  
  let line1 = '', line2 = '', city = '', county = '', postcode = '';

  // Last part is usually the Eircode
  const eircodeRegex = /^[A-Z0-9]{3}\s[A-Z0-9]{4}$/;
  if (filtered.length > 0 && eircodeRegex.test(filtered[filtered.length - 1])) {
    postcode = filtered[filtered.length - 1];
    filtered.pop();
  }

  // County is usually "Co. Something"
  const countyIdx = filtered.findIndex(p => p.startsWith('Co.'));
  if (countyIdx !== -1) {
    county = filtered[countyIdx].replace('Co. ', '');
    filtered.splice(countyIdx, 1);
  }

  if (filtered.length >= 1) line1 = filtered[0];
  if (filtered.length >= 2) line2 = filtered[1];
  if (filtered.length >= 3) city = filtered[2];
  else if (filtered.length >= 2) city = filtered[1];

  return { line1, line2, city, county, postcode };
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const delivery = subtotal >= 50 ? 0 : 3.50;
  const total = subtotal + delivery;

  const [name, setName] = useState(user?.name || '');
  const [isdCode, setIsdCode] = useState('+353');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [postcode, setPostcode] = useState('');
  const [eircodeInput, setEircodeInput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [eircodeLoading, setEircodeLoading] = useState(false);
  const [eircodeFound, setEircodeFound] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  if (items.length === 0) { navigate('/cart'); return null; }

  const handleEircodeSearch = async () => {
    if (!eircodeInput.trim()) { showToast('Enter an Eircode first'); return; }
    setEircodeLoading(true);
    setEircodeFound(false);
    try {
      const data = await lookupEircode(eircodeInput);
      const parsed = parseAddress(data.formattedAddress);
      if (parsed.line1) setLine1(parsed.line1);
      if (parsed.line2) setLine2(parsed.line2);
      if (parsed.city) setCity(parsed.city);
      if (parsed.county) setCounty(parsed.county);
      if (parsed.postcode) {
        setPostcode(parsed.postcode);
        setEircodeInput(parsed.postcode);
      } else {
        setPostcode(eircodeInput.toUpperCase());
      }
      setEircodeFound(true);
      showToast('Address found — please verify ✓');
    } catch (err) {
      showToast('Eircode not found — please enter address manually');
    } finally {
      setEircodeLoading(false);
    }
  };

  const validateStep1 = () => {
    const e = {};
    if (!name.trim()) e.name = 'Required';
    if (!phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!line1.trim()) e.line1 = 'Required';
    if (!city.trim()) e.city = 'Required';
    if (!postcode.trim()) e.postcode = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const orderData = {
        customer_id: user?.customer_id || null,
        guest_name: user ? null : name,
        guest_phone: user ? null : (isdCode + phone.replace(/\s/g, '').replace(/^0/, '')),
        items: items.map(i => ({ ...i })),
        delivery_address: { label: 'Home', line1, line2, city, postcode, instructions },
        notes: notes || null
      };
      const order = await createOrder(orderData);
      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  };

  const inp = (hasError) => ({
    padding: '14px 16px',
    border: `1.5px solid ${hasError ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '16px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    width: '100%',
    boxSizing: 'border-box',
    WebkitTextFillColor: 'var(--text)',
    transition: 'border-color 0.18s',
  });

  const card = {
    background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-light)', padding: '20px',
    boxShadow: 'var(--shadow-sm)'
  };

  return (
    <div className="page-content fade-up" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '16px 16px 40px' }}>

        <button className="btn btn-ghost btn-sm" onClick={() => step > 1 ? setStep(step - 1) : navigate('/cart')} style={{ marginBottom: 16 }}>
          ← {step > 1 ? 'Back' : 'Cart'}
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          {['Contact', 'Delivery', 'Review'].map((label, i) => (
            <React.Fragment key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: step >= i + 1 ? 'var(--primary)' : 'var(--surface-2)',
                  color: step >= i + 1 ? '#fff' : 'var(--text-muted)',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--primary)' : 'var(--border)' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Contact */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Contact Details</h2>
            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" placeholder="Your full name" value={name}
                    onChange={e => setName(e.target.value)} style={inp(errors.name)}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = errors.name ? 'var(--danger)' : 'var(--border)'}
                  />
                  {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>Required</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: errors.phone ? '1.5px solid var(--danger)' : '1.5px solid var(--border)' }}>
                    <input type="text" value={isdCode}
                      onChange={e => setIsdCode(e.target.value.replace(/[^+0-9]/g, ''))}
                      style={{ width: 68, flexShrink: 0, textAlign: 'center', background: 'var(--surface-2)', fontWeight: 700, borderRight: '1.5px solid var(--border)', color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)', fontSize: 13, padding: '14px 8px', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box' }}
                      maxLength={5} placeholder="+353" />
                    <input type="tel" placeholder="87 123 4567" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/[^0-9 -]/g, ''))}
                      style={{ ...inp(false), borderRadius: 0, border: 'none', flex: 1 }}
                      maxLength={12} />
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 3 }}>ISD code prefilled — edit if outside Ireland</p>
                  {errors.phone && <span style={{ fontSize: 12, color: 'var(--danger)' }}>Required</span>}
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleNext}>
              Continue to Delivery →
            </button>
            {!user && (
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                Have an account?{' '}
                <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>Sign in</span>
                {' '}for faster checkout
              </p>
            )}
          </div>
        )}

        {/* Step 2: Delivery */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Delivery Address</h2>

            {/* Eircode lookup */}
            <div style={{ ...card, background: 'linear-gradient(135deg, #f0f7f3, #fdfaf5)', border: '1.5px solid #c8e6d4' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                🔍 Eircode Lookup
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                Enter your Eircode to automatically fill your address
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="e.g. T12 A123"
                  value={eircodeInput}
                  onChange={e => setEircodeInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleEircodeSearch()}
                  style={{ ...inp(false), flex: 1, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  maxLength={8}
                />
                <button className="btn btn-primary" onClick={handleEircodeSearch}
                  disabled={eircodeLoading} style={{ flexShrink: 0, minWidth: 80 }}>
                  {eircodeLoading ? '…' : 'Find'}
                </button>
              </div>
              {eircodeFound && (
                <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 8, fontWeight: 600 }}>
                  ✓ Address filled below — check and correct if needed
                </p>
              )}
            </div>

            {/* Address fields */}
            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Address Line 1 *</label>
                  <input type="text" placeholder="14 Oak Drive" value={line1}
                    onChange={e => setLine1(e.target.value)} style={inp(errors.line1)}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = errors.line1 ? 'var(--danger)' : 'var(--border)'}
                  />
                  {errors.line1 && <span style={{ fontSize: 12, color: 'var(--danger)' }}>Required</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Address Line 2 <span style={{ color: 'var(--text-light)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                  <input type="text" placeholder="Area or townland" value={line2}
                    onChange={e => setLine2(e.target.value)} style={inp(false)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">City / Town *</label>
                    <input type="text" placeholder="Cork" value={city}
                      onChange={e => setCity(e.target.value)} style={inp(errors.city)}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = errors.city ? 'var(--danger)' : 'var(--border)'}
                    />
                    {errors.city && <span style={{ fontSize: 12, color: 'var(--danger)' }}>Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">County</label>
                    <input type="text" placeholder="Cork" value={county}
                      onChange={e => setCounty(e.target.value)} style={inp(false)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Eircode *</label>
                  <input type="text" placeholder="T12 A123" value={postcode}
                    onChange={e => setPostcode(e.target.value.toUpperCase())}
                    style={{ ...inp(errors.postcode), letterSpacing: '0.06em', textTransform: 'uppercase' }}
                    maxLength={8}
                  />
                  {errors.postcode && <span style={{ fontSize: 12, color: 'var(--danger)' }}>Required</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Instructions</label>
                  <input type="text" placeholder="Ring bell, leave at door…" value={instructions}
                    onChange={e => setInstructions(e.target.value)} style={inp(false)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Notes</label>
                  <textarea placeholder="Any special requests…" value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{ ...inp(false), minHeight: 72, resize: 'vertical' }} />
                </div>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleNext}>
              Review Order →
            </button>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Review Order</h2>
            <div style={card}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Items</p>
              {items.map(i => (
                <div key={i.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{i.product_name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i.unit_label} × {i.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 700, color: 'var(--primary)' }}>€{i.line_total.toFixed(2)}</p>
                </div>
              ))}
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 10 }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span><span>€{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 8 }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span>{delivery === 0 ? <span style={{ color: 'var(--primary)', fontWeight: 700 }}>FREE</span> : `€${delivery.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20, marginTop: 14 }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{total.toFixed(2)}</span>
              </div>
            </div>

            <div style={card}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Delivering to</p>
              <p style={{ fontSize: 15, fontWeight: 700 }}>{name}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{phone}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{line1}{line2 ? `, ${line2}` : ''}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{city}{county ? `, Co. ${county}` : ''}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{postcode}</p>
              {instructions && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>📝 {instructions}</p>}
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setStep(1)}>✏️ Edit details</button>
            </div>

            <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', border: '1px solid var(--border-light)' }}>
              💳 Payment on delivery — cash or card accepted
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Placing Order…' : `Place Order — €${total.toFixed(2)} →`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
