import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

const WHATSAPP_NUMBER = '353895722935';

export function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 99,
      background: 'rgba(253,250,245,0.97)', borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(16px)', boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Row 1: Logo + Actions */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 54, maxWidth: 1200, margin: '0 auto', width: '100%'
      }}>
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          JK <span>Seasonal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user ? (
            <>
              {user.is_admin && (
                <button className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/admin')}>Admin</button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/account')}>
                👤 {user.name.split(' ')[0]}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/login')}>Sign In</button>
          )}
          <button
            className="btn btn-primary btn-sm"
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={() => navigate('/cart')}
          >
            🛒 {totalItems > 0 && (
              <span style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 99, padding: '1px 6px', fontSize: 11, fontWeight: 800, marginLeft: 2 }}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>
      {/* Row 2: Search bar — full width */}
      <div style={{ padding: '0 16px 10px', maxWidth: 1200, margin: '0 auto' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-light)', pointerEvents: 'none' }}>🔍</span>
            <input
              className="form-input"
              style={{ width: '100%', padding: '10px 12px 10px 34px', fontSize: 14, background: 'var(--surface-2)' }}
              placeholder="Search rice, dal, ghee, spices…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>Search</button>
        </form>
      </div>
    </header>
  );
}

export function MobileNav() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const items = [
    { icon: '🏠', label: 'Home', to: '/' },
    { icon: '🛍️', label: 'Shop', to: '/shop' },
    { icon: '🛒', label: 'Cart', to: '/cart', badge: totalItems },
    { icon: '📦', label: 'Orders', to: '/account' },
    { icon: '👤', label: 'Account', to: '/account' },
  ];

  return (
    <nav className="mobile-nav">
      {items.map(item => (
        <button key={item.to + item.label}
          className={`mobile-nav-item ${path === item.to ? 'active' : ''}`}
          onClick={() => navigate(item.to)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.badge > 0 && <span className="cart-badge">{item.badge}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = require('../context/AppContext').useToast();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast(`${product.name} added to cart 🛒`);
  };

  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--surface-2)', overflow: 'hidden' }}>
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'} />
        )}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.seasonal && <span className="badge badge-orange">🍂 Seasonal</span>}
          {hasDiscount && <span className="badge badge-red">Sale</span>}
          {product.stock_status === 'low_stock' && <span className="badge badge-orange">Low Stock</span>}
          {product.stock_status === 'out_of_stock' && <span className="badge badge-red">Out of Stock</span>}
        </div>
      </div>
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, marginBottom: 10, color: 'var(--text)' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>€{price.toFixed(2)}</span>
              {hasDiscount && <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through' }}>€{product.price.toFixed(2)}</span>}
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{product.unit_label}</p>
          </div>
          <button className="btn btn-primary"
            style={{ borderRadius: '50%', width: 34, height: 34, padding: 0, fontSize: 20, flexShrink: 0 }}
            onClick={handleAdd} disabled={product.stock_status === 'out_of_stock'}>+</button>
        </div>
      </div>
    </div>
  );
}

export { WHATSAPP_NUMBER };
