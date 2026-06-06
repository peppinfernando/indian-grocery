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
          Spice<span>&</span>Grain
        </div>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 380, margin: '0 20px' }}>
          <input
            className="form-input"
            style={{ width: '100%', padding: '8px 14px', fontSize: 14 }}
            placeholder="Search rice, dal, ghee…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              {user.is_admin && (
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}>Admin</button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/account')}>
                👤 {user.name.split(' ')[0]}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>Sign In</button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
            🛒 Cart {totalItems > 0 && <span style={{ background: 'var(--secondary)', borderRadius: 8, padding: '1px 6px', fontSize: 11, marginLeft: 2 }}>{totalItems}</span>}
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
    { icon: '🔍', label: 'Search', to: '/shop' },
    { icon: '🛒', label: 'Cart', to: '/cart', badge: totalItems },
    { icon: '👤', label: 'Account', to: '/account' },
  ];

  return (
    <nav className="mobile-nav">
      {items.map(item => (
        <button
          key={item.to + item.label}
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
    showToast(`Added ${product.name} to cart 🛒`);
    if (onAdd) onAdd(product);
  };

  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
      <div style={{ position: 'relative', paddingTop: '100%', background: 'var(--surface)', overflow: 'hidden' }}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=🥘'}
          alt={product.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.seasonal && <span className="badge badge-orange">🍂 Seasonal</span>}
          {hasDiscount && <span className="badge badge-red">SALE</span>}
          {product.stock_status === 'low_stock' && <span className="badge badge-orange">Low Stock</span>}
          {product.stock_status === 'out_of_stock' && <span className="badge badge-red">Out of Stock</span>}
        </div>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>{product.category}</p>
        <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginBottom: 8, color: 'var(--text)' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>€{price.toFixed(2)}</span>
            {hasDiscount && <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 4 }}>€{product.price.toFixed(2)}</span>}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{product.unit_label}</span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, fontSize: 18 }}
            onClick={handleAdd}
            disabled={product.stock_status === 'out_of_stock'}
          >+</button>
        </div>
      </div>
    </div>
  );
}
