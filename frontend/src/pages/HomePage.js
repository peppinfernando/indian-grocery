import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeatured, getCategories, getSeasonal } from '../hooks/useApi';
import { ProductCard } from '../components/Shared';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFeatured(), getCategories(), getSeasonal()])
      .then(([f, c, s]) => { setFeatured(f); setCategories(c); setSeasonal(s); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page-content fade-up">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0A0A0A 0%, #111111 50%, #0F1A0A 100%)',
        padding: '52px 20px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid #1A1A1A'
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#A8FF3E 1px, transparent 1px), linear-gradient(90deg, #A8FF3E 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,255,62,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.2)',
            borderRadius: 99, padding: '6px 14px', marginBottom: 20
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#A8FF3E', display: 'inline-block', animation: 'glowPulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#A8FF3E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Now delivering in Cork</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 7vw, 56px)',
            fontWeight: 800, lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.03em',
            color: '#F0F0F0'
          }}>
            Fresh Indian groceries<br />
            <span style={{ color: '#A8FF3E' }}>delivered.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Premium staples, seasonal produce, and authentic brands — straight to your door in Cork & Munster.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
              Shop Now →
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/shop?seasonal=true')}>
              🍂 Seasonal
            </button>
          </div>
          <p style={{ marginTop: 20, fontSize: 12, color: '#555' }}>
            Already order on WhatsApp?{' '}
            <span style={{ color: '#A8FF3E', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/shop')}>
              Browse the full catalogue →
            </span>
          </p>
        </div>
      </div>

      {/* Delivery strip */}
      <div style={{
        background: '#A8FF3E', color: '#0A0A0A', textAlign: 'center',
        padding: '10px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em'
      }}>
        🚚 FREE DELIVERY ON ORDERS OVER €50 · CORK & SURROUNDS
      </div>

      {/* Categories */}
      <div className="container" style={{ marginTop: 32 }}>
        <h2 className="section-title">Browse Categories</h2>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              style={{
                flex: '0 0 auto', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '14px 18px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                minWidth: 82, transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.3, maxWidth: 68, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="container" style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>⭐ Featured</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?featured=true')}>View all</button>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Seasonal */}
      {seasonal.length > 0 && (
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginTop: 36, padding: '32px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: 4 }}>🍂 Seasonal Picks</h2>
                <p className="section-subtitle" style={{ margin: 0 }}>Limited stock — order while available</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?seasonal=true')}>View all</button>
            </div>
            <div className="products-grid">
              {seasonal.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Trust strip */}
      <div className="container" style={{ marginTop: 36, marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: '🌿', title: 'Fresh & Authentic', desc: 'Sourced directly from trusted Indian brands' },
            { icon: '🚚', title: 'Cork Delivery', desc: 'Fast local delivery across Cork & Munster' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Order queries answered on WhatsApp' },
          ].map(t => (
            <div key={t.title} style={{
              background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
              padding: '20px 16px', border: '1px solid var(--border)', textAlign: 'center'
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{t.icon}</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-display)' }}>{t.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
