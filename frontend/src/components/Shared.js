import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

export function Header({ onSearch }) {
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
        <div className="header-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          JK<span>Seasonal</span>
        </div>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, margin: '0 20px' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-light)' }}>🔍</span>
            <input
              className="form-input"
              style={{ width: '100%', padding: '8px 14px 8px 34px', fontSize: 13, background: 'var(--surface-2)' }}
              placeholder="Search rice, dal, spices…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <>
              {user.is_admin && (
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}>Admin</button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/account')}>
                👤 {user.name.split(' ')[0]}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={logout}>Out</button>
            </>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/cart')} style={{ position: 'relative', gap: 6 }}>
            🛒
            {totalItems > 0 && (
              <span style={{ background: '#0A0A0A', color: 'var(--primary)', borderRadius: 8, padding: '1px 6px', fontSize: 11, fontWeight: 800 }}>{totalItems}</span>
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
    { icon: '⌂', label: 'Home', to: '/' },
    { icon: '◫', label: 'Shop', to: '/shop' },
    { icon: '🛒', label: 'Cart', to: '/cart', badge: totalItems },
    { icon: '◷', label: 'Orders', to: '/account' },
    { icon: '◉', label: 'Account', to: '/account' },
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

export function ProductCard({ product, onAdd }) {
  const { addItem } = useCart();
  const { showToast } = require('../context/AppContext').useToast();
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast(`Added to cart ✓`);
    if (onAdd) onAdd(product);
  };

  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="card" style={{ cursor: 'pointer', background: 'var(--surface)' }}
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--surface-3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--surface-2)', overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || ''}
          alt={product.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.seasonal && <span className="badge badge-orange">Seasonal</span>}
          {hasDiscount && <span className="badge badge-red">Sale</span>}
          {product.stock_status === 'low_stock' && <span className="badge badge-orange">Low Stock</span>}
          {product.stock_status === 'out_of_stock' && <span className="badge badge-red">Out of Stock</span>}
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 10, color: 'var(--text)' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{price.toFixed(2)}</span>
            {hasDiscount && <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 4 }}>€{product.price.toFixed(2)}</span>}
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: 1 }}>{product.unit_label}</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, fontSize: 16, flexShrink: 0 }}
            onClick={handleAdd}
            disabled={product.stock_status === 'out_of_stock'}
          >+</button>
        </div>
      </div>
    </div>
  );
}
