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
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 60%, var(--primary-light) 100%)',
        color: 'white', padding: '36px 20px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', opacity: 0.8, marginBottom: 10, textTransform: 'uppercase' }}>🌿 Fresh from the source</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>
          Your weekly Indian<br />groceries, sorted.
        </h1>
        <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
          Premium staples, fresh vegetables, spices and snacks — delivered to Cork.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }} onClick={() => navigate('/shop')}>
            Shop Now
          </button>
          <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }} onClick={() => navigate('/shop?seasonal=true')}>
            🍂 Seasonal
          </button>
        </div>
        {/* WhatsApp CTA */}
        <div style={{ marginTop: 20, fontSize: 13, opacity: 0.75 }}>
          Already order on WhatsApp? <span style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/shop')}>Browse the full catalogue →</span>
        </div>
      </div>

      {/* Delivery strip */}
      <div style={{ background: 'var(--secondary)', color: 'white', textAlign: 'center', padding: '10px 20px', fontSize: 13, fontWeight: 600 }}>
        🚚 Free delivery on orders over €50 · Cork & Surrounds
      </div>

      {/* Categories */}
      <div className="container" style={{ marginTop: 28 }}>
        <h2 className="section-title">Browse Categories</h2>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              style={{
                flex: '0 0 auto', background: 'var(--white)', border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)', padding: '12px 18px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                minWidth: 80, transition: 'all 0.18s', boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = ''; }}
            >
              <span style={{ fontSize: 26 }}>{cat.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.3, maxWidth: 68 }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="container" style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>⭐ Featured Products</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?featured=true')}>View all</button>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Seasonal */}
      {seasonal.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #FDF0E0, #FAF7F2)', marginTop: 28, padding: '28px 0' }}>
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
      <div className="container" style={{ marginTop: 32, marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
          {[
            { icon: '🌿', title: 'Fresh & Authentic', desc: 'Sourced directly from trusted Indian brands' },
            { icon: '🚚', title: 'Cork Delivery', desc: 'Fast local delivery across Cork & Munster' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Order queries answered on WhatsApp' },
          ].map(t => (
            <div key={t.title} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '18px 14px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
