import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeatured, getCategories, getSeasonal } from '../hooks/useApi';
import { ProductCard } from '../components/Shared';

const WHATSAPP = '353894722934';

function Footer() {
  return (
    <footer style={{ background: '#0F3D26', color: '#fff', padding: '32px 20px 20px', marginTop: 48 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 24 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, fontStyle: 'italic', color: '#fff', marginBottom: 6 }}>JK Seasonal</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 10 }}>
              Premium Indian groceries delivered across Cork, Limerick & Galway.
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              "வீட்டு சுவையை உங்கள் வீட்டிற்கே"
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>Bringing the taste of home, to your home</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Delivery Areas</p>
            {['Cork City & County', 'Limerick City & County', 'Galway City & County'].map(a => (
              <p key={a} style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#5DB87A', fontSize: 9 }}>●</span> {a}
              </p>
            ))}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>Free delivery on orders over €50</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Get in Touch</p>
            <a href={'https://wa.me/' + WHATSAPP + '?text=Hi%20JK%20Seasonal!'}
              target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#25D366', color: '#fff', padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', marginBottom: 8 }}>
              💬 WhatsApp Us
            </a>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              Order queries & delivery questions — fast replies guaranteed.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>© 2025 JK Seasonal. All rights reserved.</p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>உங்கள் நம்பகமான இந்திய மளிகை கடை</p>
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

      {/* Hero — compact, editorial */}
      <div style={{
        background: 'linear-gradient(135deg, #0F3D26 0%, #1A5C3A 100%)',
        padding: '28px 20px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(200,98,26,0.12)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 480 }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                Cork · Limerick · Galway
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,5vw,34px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 10, fontStyle: 'italic' }}>
                Authentic Indian groceries,<br/>delivered to your door.
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 16, lineHeight: 1.6 }}>
                Premium staples, seasonal produce and trusted brands — straight from source to your kitchen.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 600, fontSize: 13 }} onClick={() => navigate('/shop')}>
                  Shop Now →
                </button>
                <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 13 }} onClick={() => navigate('/shop?seasonal=true')}>
                  🍂 Seasonal
                </button>
              </div>
            </div>
            {/* Stats strip */}
            <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
              {[['200+', 'Products'], ['3', 'Cities'], ['Free', 'Over €50']].map(([val, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lbl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery strip */}
      <a href={'https://wa.me/' + WHATSAPP + '?text=Hi%20JK%20Seasonal!%20I%20have%20a%20question.'}
        target="_blank" rel="noreferrer"
        style={{ background: 'var(--secondary)', color: '#fff', textAlign: 'center', padding: '8px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', display: 'block', textDecoration: 'none' }}>
        🚚 FREE DELIVERY OVER €50 &nbsp;·&nbsp; CORK · LIMERICK · GALWAY &nbsp;·&nbsp; 💬 QUESTIONS? WHATSAPP US
      </a>

      {/* Categories */}
      <div className="container" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 className="section-title" style={{ marginBottom: 0, fontSize: 18 }}>Shop by Category</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => navigate('/shop?category=' + encodeURIComponent(cat.name))}
              style={{
                flex: '0 0 auto', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '10px 14px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                minWidth: 72, transition: 'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 600, textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.3, maxWidth: 64, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="container" style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Products</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?featured=true')}>View all</button>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Seasonal */}
      {seasonal.length > 0 && (
        <div style={{ background: 'linear-gradient(160deg, #FBF3EB, #F9F6F1)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginTop: 32, padding: '24px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
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

      {/* Trust strip */}
      <div className="container" style={{ marginTop: 28, marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { icon: '🌿', title: 'Fresh & Authentic', desc: 'Sourced from trusted Indian brands' },
            { icon: '🚚', title: 'Cork · Limerick · Galway', desc: 'Fast delivery across Munster & Connacht' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Quick replies on WhatsApp' },
          ].map(t => (
            <div key={t.title} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '16px 14px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 7 }}>{t.icon}</div>
              <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{t.title}</h4>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
