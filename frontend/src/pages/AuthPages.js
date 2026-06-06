import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../hooks/useApi';
import { useAuth, useToast } from '../context/AppContext';

export function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi(form);
      login(data);
      showToast(`Welcome back, ${data.name}! 👋`);
      navigate(data.is_admin ? '/admin' : '/account');
    } catch {
      showToast('Invalid phone or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>
        <div className="card" style={{ padding: '28px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" placeholder="+353..." value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-muted)' }}>
            New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create account</Link>
          </div>
          <hr />
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            Demo: <code>+353871234567</code> / <code>password123</code><br/>
            Admin: <code>admin</code> / <code>admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', phone: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerApi(form);
      login(data);
      showToast(`Account created! Welcome, ${data.name} 🎉`);
      navigate('/account');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Start ordering in minutes</p>
        </div>
        <div className="card" style={{ padding: '28px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Full Name', field: 'name', type: 'text', ph: 'Your full name' },
              { label: 'Phone Number', field: 'phone', type: 'tel', ph: '+353...' },
              { label: 'Password', field: 'password', type: 'password', ph: 'Min 6 characters' },
              { label: 'Email (optional)', field: 'email', type: 'email', ph: 'your@email.com' },
            ].map(f => (
              <div key={f.field} className="form-group">
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} placeholder={f.ph}
                  value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                  required={f.field !== 'email'} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
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
