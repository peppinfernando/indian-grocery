import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../hooks/useApi';
import { useAuth, useToast } from '../context/AppContext';

function PhoneField({ isdCode, setIsdCode, phone, setPhone, error }) {
  const base = {
    padding: '13px 12px', background: 'var(--surface)', color: 'var(--text)',
    fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)',
    WebkitTextFillColor: 'var(--text)', boxSizing: 'border-box', border: 'none',
  };
  return (
    <div>
      <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1.5px solid ' + (error ? 'var(--danger)' : 'var(--border)') }}>
        <input type="text" value={isdCode}
          onChange={e => setIsdCode(e.target.value.replace(/[^+0-9]/g, ''))}
          style={{ ...base, width: 68, flexShrink: 0, textAlign: 'center', background: 'var(--surface-2)', fontWeight: 700, borderRight: '1.5px solid var(--border)', color: 'var(--primary)', WebkitTextFillColor: 'var(--primary)', fontSize: 13 }}
          maxLength={5} placeholder="+353" />
        <input type="tel" value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^0-9\s\-]/g, ''))}
          placeholder="87 123 4567"
          style={{ ...base, flex: 1 }}
          maxLength={12} required />
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>ISD code prefilled — edit if calling from outside Ireland</p>
      {error && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>Required</p>}
    </div>
  );
}

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
      showToast('Invalid credentials — try your phone number or name');
    } finally { setLoading(false); }
  };

  const inp = { padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)', width: '100%', WebkitTextFillColor: 'var(--text)', boxSizing: 'border-box' };

  return (
    <div className="page-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, fontStyle: 'italic' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in with your phone number or name</p>
        </div>
        <div className="card" style={{ padding: '26px 22px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Phone Number or Name</label>
              <input style={inp} type="text" placeholder="+353 87 123 4567 or your name"
                value={identifier} onChange={e => setIdentifier(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
              <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 3 }}>Enter your registered phone number or full name</p>
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
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
            New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
          </div>
          <hr />
          <p style={{ fontSize: 10, color: 'var(--text-light)', textAlign: 'center' }}>Demo: +353871234567 / password123 &nbsp;|&nbsp; Admin: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [name, setName] = useState('');
  const [isdCode, setIsdCode] = useState('+353');
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
      const digits = phone.replace(/\s/g, '').replace(/^0/, '');
      const fullPhone = isdCode + digits;
      const data = await registerApi({ name, phone: fullPhone, password, email: email || null });
      login(data);
      showToast('Account created! Welcome, ' + data.name);
      navigate('/account');
    } catch (err) {
      showToast((err.response && err.response.data && err.response.data.detail) || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inp = { padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-body)', width: '100%', WebkitTextFillColor: 'var(--text)', boxSizing: 'border-box' };

  return (
    <div className="page-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, fontStyle: 'italic' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Start ordering in minutes</p>
        </div>
        <div className="card" style={{ padding: '26px 22px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input style={inp} type="text" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <PhoneField isdCode={isdCode} setIsdCode={setIsdCode} phone={phone} setPhone={setPhone} />
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
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
