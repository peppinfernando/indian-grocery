import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeatured, getCategories, getSeasonal } from '../hooks/useApi';
import { ProductCard } from '../components/Shared';

const WHATSAPP = '353894722934';

function Footer() {
  return (
    <footer style={{ background: '#0F3D26', color: '#fff', padding: '28px 20px 16px', marginTop: 40 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 20 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, fontStyle: 'italic', color: '#fff', marginBottom: 6 }}>JK Seasonal</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
              Premium Indian groceries delivered across Cork, Limerick & Galway.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 9 }}>Delivery Areas</p>
            {['Cork City & County', 'Limerick City & County', 'Galway City & County'].map(a => (
              <p key={a} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#5DB87A', fontSize: 8 }}>●</span> {a}
              </p>
            ))}
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 7 }}>Free delivery on orders over €50</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 9 }}>Contact</p>
            <a href={'https://wa.me/' + WHATSAPP + '?text=Hi%20JK%20Seasonal!'}
              target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#25D366', color: '#fff', padding: '8px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>© 2025 JK Seasonal. All rights reserved.</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Your trusted Indian grocery store — Cork · Limerick · Galway 🇮🇪</p>
        </div>
      </div>
    </footer>
  );
}

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

      {/* Hero — slim, elegant */}
      <div style={{
        background: 'linear-gradient(135deg, #0F3D26 0%, #1A5C3A 100%)',
        padding: '20px 20px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            {/* Left — text */}
            <div style={{ maxWidth: 460 }}>
              <p style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7 }}>
                Cork · Limerick · Galway
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px,4vw,30px)', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: 10, fontStyle: 'italic' }}>
                Authentic Indian groceries,<br />delivered fresh.
              </h1>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn" style={{ background: '#fff', color: '#0F3D26', fontWeight: 600, fontSize: 12, padding: '9px 18px', borderRadius: 8 }} onClick={() => navigate('/shop')}>
                  Shop Now →
                </button>
                <button className="btn" style={{ background: 'transparent', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 12, padding: '9px 18px', borderRadius: 8 }} onClick={() => navigate('/shop?seasonal=true')}>
                  🍂 Seasonal
                </button>
              </div>
            </div>
            {/* Right — stats */}
            <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
              {[['200+', 'Products'], ['3', 'Cities'], ['€50+', 'Free delivery']].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery strip */}
      <a href={'https://wa.me/' + WHATSAPP + '?text=Hi%20JK%20Seasonal!%20I%20have%20a%20question.'}
        target="_blank" rel="noreferrer"
        style={{ background: 'var(--secondary)', color: '#fff', textAlign: 'center', padding: '7px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', display: 'block', textDecoration: 'none' }}>
        🚚 FREE DELIVERY OVER €50 &nbsp;·&nbsp; CORK · LIMERICK · GALWAY &nbsp;·&nbsp; 💬 WHATSAPP US
      </a>

      {/* Categories */}
      <div className="container" style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => navigate('/shop?category=' + encodeURIComponent(cat.name))}
              style={{
                flex: '0 0 auto', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '9px 12px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                minWidth: 68, transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: 20 }}>{cat.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.3, maxWidth: 60, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="container" style={{ marginTop: 26 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Products</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?featured=true')}>View all</button>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Seasonal */}
      {seasonal.length > 0 && (
        <div style={{ background: 'linear-gradient(160deg, #FBF3EB, #F9F6F1)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginTop: 30, padding: '22px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: 2 }}>🍂 Seasonal Picks</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Limited stock — order while available</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?seasonal=true')}>View all</button>
            </div>
            <div className="products-grid">
              {seasonal.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
