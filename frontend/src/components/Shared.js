import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

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
    <header className="top-header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          JK <span>Seasonal</span>
        </div>

        {/* Search — hidden on small screens */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, margin: '0 16px', display: 'flex' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text-light)', pointerEvents: 'none' }}>🔍</span>
            <input
              className="form-input"
              style={{ width: '100%', padding: '8px 12px 8px 30px', fontSize: 13, background: 'var(--surface-2)' }}
              placeholder="Search products…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Actions — single line, no wrap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'nowrap' }}>
          {user ? (
            <>
              {user.is_admin && (
                <button className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/admin')}>Admin</button>
              )}
              <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/account')}>
                👤 {user.name.split(' ')[0]}
              </button>
              <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={logout}>Out</button>
            </>
          ) : (
            <button className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={() => navigate('/login')}>Sign In</button>
          )}
          <button
            className="btn btn-primary btn-sm"
            style={{ whiteSpace: 'nowrap', flexShrink: 0, position: 'relative', paddingRight: totalItems > 0 ? 10 : 14 }}
            onClick={() => navigate('/cart')}
          >
            🛒 {totalItems > 0 && (
              <span style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: 99,
                padding: '1px 6px', fontSize: 11, fontWeight: 800, marginLeft: 2
              }}>{totalItems}</span>
            )}
          </button>
        </div>
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
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--surface-2)', overflow: 'hidden' }}>
        {product.images?.[0] && (
          <img
            src={product.images[0]} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => e.target.style.display = 'none'}
          />
        )}
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.seasonal && <span className="badge badge-orange">🍂 Seasonal</span>}
          {hasDiscount && <span className="badge badge-red">Sale</span>}
          {product.stock_status === 'low_stock' && <span className="badge badge-orange">Low Stock</span>}
          {product.stock_status === 'out_of_stock' && <span className="badge badge-red">Out of Stock</span>}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, marginBottom: 10, color: 'var(--text)' }}>{product.name}</h3>

        {/* Price + Add button — always on one line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'nowrap' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>€{price.toFixed(2)}</span>
              {hasDiscount && <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>€{product.price.toFixed(2)}</span>}
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, whiteSpace: 'nowrap' }}>{product.unit_label}</p>
          </div>
          <button
            className="btn btn-primary"
            style={{ borderRadius: '50%', width: 34, height: 34, padding: 0, fontSize: 20, flexShrink: 0, lineHeight: 1 }}
            onClick={handleAdd}
            disabled={product.stock_status === 'out_of_stock'}
          >+</button>
        </div>
      </div>
    </div>
  );
}
