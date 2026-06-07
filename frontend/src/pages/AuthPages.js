import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../hooks/useApi';
import { useAuth, useToast } from '../context/AppContext';

const ADMIN_WA = '353894722935';

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
      // Try as-is first, then with +353 prefix for short numbers
      let phone = identifier.trim();
      const data = await loginApi({ phone, password });
      login(data);
      showToast('Welcome back, ' + data.name + '!');
      navigate(data.is_admin ? '/admin' : '/account');
    } catch {
      showToast('Invalid phone/name or password');
    } finally { setLoading(false); }
  };

  const inp = { padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'var(--font-body)', width: '100%', WebkitTextFillColor: 'var(--text)' };

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
            Demo: +353871234567 / password123 | Admin: admin / admin123
          </div>
        </div>
      </div>
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
      const fullPhone = phone.startsWith('+') ? phone : '+353' + phone.replace(/^0/, '');
      const data = await registerApi({ name, phone: fullPhone, password, email: email || null });
      login(data);
      showToast('Account created! Welcome, ' + data.name);
      navigate('/account');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Registration failed');
    } finally { setLoading(false); }
  };

  const inp = { padding: '13px 16px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'var(--font-body)', width: '100%', WebkitTextFillColor: 'var(--text)' };

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
              <div style={{ display: 'flex', gap: 0 }}>
                <div style={{ ...inp, width: 'auto', flexShrink: 0, background: 'var(--surface-2)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', padding: '13px 12px', whiteSpace: 'nowrap' }}>
                  🇮🇪 +353
                </div>
                <input style={{ ...inp, borderRadius: '0 var(--radius-md) var(--radius-md) 0', borderLeft: 'none' }}
                  type="tel" placeholder="87 123 4567"
                  value={phone} onChange={e => setPhone(e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} required />
              </div>
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
