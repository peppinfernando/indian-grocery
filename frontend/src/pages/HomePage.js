import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeatured, getCategories, getSeasonal } from '../hooks/useApi';
import { ProductCard } from '../components/Shared';


function Footer() {
  const WHATSAPP = '353894722934';
  const waMsg = encodeURIComponent('Hi JK Seasonal! I have a question about my order.');

  return (
    <footer style={{
      background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 100%)',
      color: '#fff', padding: '40px 20px 24px', marginTop: 40
    }}>
      <div className="container">
        {/* Slogan */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, fontStyle: 'italic', color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
            "வீட்டு சுவையை உங்கள் வீட்டிற்கே"
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4, letterSpacing: '0.03em' }}>
            Bringing the taste of home, to your home
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
            DELIVERING ACROSS CORK · LIMERICK · GALWAY
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 28, marginBottom: 36 }}>
          {/* About */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#A8D5B5' }}>JK Seasonal</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              Premium Indian groceries, fresh produce and authentic brands delivered to your door across Munster and beyond.
            </p>
          </div>

          {/* Delivery */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#A8D5B5' }}>Delivery Areas</p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Cork City & County', 'Limerick City & County', 'Galway City & County'].map(function(area) {
                return <li key={area} style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#A8D5B5', fontSize: 10 }}>✦</span> {area}
                </li>;
              })}
            </ul>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Free delivery on orders over €50</p>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#A8D5B5' }}>Contact Us</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={'https://wa.me/' + WHATSAPP + '?text=' + waMsg}
                target="_blank" rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#25D366', color: '#fff', padding: '10px 16px',
                  borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 700,
                  textDecoration: 'none', width: 'fit-content'
                }}>
                💬 WhatsApp Us
              </a>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                Order queries, delivery questions and product availability — we reply fast on WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            © 2025 JK Seasonal. All rights reserved.
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
            உங்கள் நம்பகமான இந்திய மளிகை கடை — Your trusted Indian grocery store
          </p>
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

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 55%, #40916C 100%)',
        padding: '52px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: -60, width: 280, height: 280,
          borderRadius: '50%', background: 'rgba(224,122,47,0.15)', pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            display: 'inline-block', fontSize: 12, fontWeight: 600,
            color: 'rgba(255,255,255,0.7)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: 16,
            background: 'rgba(255,255,255,0.1)', padding: '5px 14px',
            borderRadius: 99, border: '1px solid rgba(255,255,255,0.15)'
          }}>🌿 Delivering across Cork & Munster</p>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 6vw, 50px)',
            fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: '#fff',
            fontStyle: 'italic', letterSpacing: '-0.01em'
          }}>
            Your trusted Indian<br />grocery store
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Premium staples, seasonal produce, and authentic brands — delivered fresh to your door.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }} onClick={() => navigate('/shop')}>
              Shop Now →
            </button>
            <button className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/shop?seasonal=true')}>
              🍂 Seasonal
            </button>
          </div>

          <p style={{ marginTop: 22, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
            Already order on WhatsApp?{' '}
            <span style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/shop')}>
              Browse the full catalogue →
            </span>
          </p>
        </div>
      </div>

      {/* Delivery strip */}
      <a href="https://wa.me/353894722934?text=Hi%20JK%20Seasonal!%20I%20have%20a%20question." target="_blank" rel="noreferrer"
        style={{ background: 'var(--secondary)', color: '#fff', textAlign: 'center', padding: '10px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', display: 'block', textDecoration: 'none' }}>
        🚚 FREE DELIVERY OVER €50 &nbsp;·&nbsp; Cork, Limerick & Galway &nbsp;·&nbsp; 💬 Questions? WhatsApp us
      </a>

      {/* Categories */}
      <div className="container" style={{ marginTop: 32 }}>
        <h2 className="section-title">Shop by Category</h2>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
              style={{
                flex: '0 0 auto', background: 'var(--surface)', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: '14px 16px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                minWidth: 80, transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            >
              <span style={{ fontSize: 26 }}>{cat.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: 70, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="container" style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 4 }}>Featured Products</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Our most loved items this week</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?featured=true')}>View all</button>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Seasonal */}
      {seasonal.length > 0 && (
        <div style={{ background: 'linear-gradient(160deg, #FEF6EC, #FDFAF5)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', marginTop: 36, padding: '36px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: 4 }}>🍂 Seasonal Picks</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Limited stock — order while available</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop?seasonal=true')}>View all</button>
            </div>
            <div className="products-grid">
              {seasonal.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Trust */}
      <div className="container" style={{ marginTop: 36, marginBottom: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: '🌿', title: 'Fresh & Authentic', desc: 'Sourced directly from trusted Indian brands and suppliers' },
            { icon: '🚚', title: 'Cork Delivery', desc: 'Fast local delivery across Cork & Munster' },
            { icon: '💬', title: 'WhatsApp Support', desc: 'Order queries answered quickly on WhatsApp' },
          ].map(t => (
            <div key={t.title} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '22px 18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{t.icon}</div>
              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-display)' }}>{t.title}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
