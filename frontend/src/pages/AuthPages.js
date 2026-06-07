import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../hooks/useApi';
import { useAuth, useToast } from '../context/AppContext';

export function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ phone: identifier.trim(), password });
      login(data);
      showToast('Welcome back, ' + data.name + '!');
      navigate(data.is_admin ? '/admin' : '/account');
    } catch {
      showToast('Invalid phone/name or password');
    } finally { setLoading(false); }
  };

  const inp = { padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'var(--font-body)', width: '100%', WebkitTextFillColor: 'var(--text)', boxSizing: 'border-box' };

  return (
    <div className="page-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, fontStyle: 'italic' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in with your phone number or name</p>
        </div>
        <div className="card" style={{ padding: '28px 24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Phone Number or Name</label>
              <input style={inp} type="text" placeholder="Phone number or your name"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input style={inp} type="password" placeholder="Your password"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-muted)' }}>
            New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
          </div>
          <hr />
          <div style={{ fontSize: 11, color: 'var(--text-light)', textAlign: 'center' }}>
            Demo: +353871234567 / password123 &nbsp;|&nbsp; Admin: admin / admin123
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneInput({ value, onChange }) {
  const inp = {
    padding: '13px 14px',
    border: '1.5px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    fontFamily: 'var(--font-body)',
    WebkitTextFillColor: 'var(--text)',
    boxSizing: 'border-box',
    flex: 1,
    borderRadius: '0 var(--radius-md) var(--radius-md) 0',
    borderLeft: 'none',
    width: '100%',
  };

  return (
    <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
      <div style={{
        background: 'var(--surface-2)',
        padding: '13px 14px',
        fontSize: 14,
        color: 'var(--text-muted)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        userSelect: 'none',
        borderRight: '1.5px solid var(--border)',
      }}>
        🇮🇪 +353
      </div>
      <input
        style={inp}
        type="tel"
        placeholder="87 123 4567"
        value={value}
        onChange={e => {
          // Only allow digits, spaces, hyphens
          const clean = e.target.value.replace(/[^0-9\s\-]/g, '');
          onChange(clean);
        }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
        maxLength={12}
        required
      />
    </div>
  );
}

export function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build full phone: remove leading 0 if present, prepend +353
      const digits = phone.replace(/\s/g, '').replace(/^0/, '');
      const fullPhone = '+353' + digits;
      const data = await registerApi({ name, phone: fullPhone, password, email: email || null });
      login(data);
      showToast('Account created! Welcome, ' + data.name);
      navigate('/account');
    } catch (err) {
      showToast((err.response && err.response.data && err.response.data.detail) || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inp = { padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'var(--font-body)', width: '100%', WebkitTextFillColor: 'var(--text)', boxSizing: 'border-box' };

  return (
    <div className="page-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, fontStyle: 'italic' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Start ordering in minutes</p>
        </div>
        <div className="card" style={{ padding: '28px 24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input style={inp} type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <PhoneInput value={phone} onChange={setPhone} />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Irish number — enter digits after +353 (e.g. 87 123 4567)</p>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input style={inp} type="password" placeholder="Min 6 characters"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email (optional)</label>
              <input style={inp} type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
