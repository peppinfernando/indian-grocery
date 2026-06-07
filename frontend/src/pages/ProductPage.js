import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../hooks/useApi';
import { useCart, useToast } from '../context/AppContext';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    getProduct(id).then(setProduct).catch(() => navigate('/shop')).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="spinner" />;
  if (!product) return null;

  const price = product.sale_price || product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  const handleAdd = () => {
    addItem(product, qty);
    showToast(`${qty}× ${product.name} added to cart 🛒`);
  };

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 16, maxWidth: 800 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          ← Back
        </button>

        {/* Stack vertically on mobile, side by side on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          gap: 20,
        }}>
          {/* Responsive grid via media query workaround */}
          <style>{`
            @media (min-width: 640px) {
              .product-grid { grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; }
            }
          `}</style>

          <div className="product-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr)',
            gap: 20,
          }}>
            {/* Image */}
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--surface-2)', aspectRatio: '1', position: 'relative' }}>
              {product.images?.[0] ? (
                <img
                  src={product.images[0]} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>🥘</div>
              )}
              <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {product.seasonal && <span className="badge badge-orange">🍂 Seasonal</span>}
                {hasDiscount && <span className="badge badge-red">Sale</span>}
              </div>
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span className="tag">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, margin: '12px 0 8px', lineHeight: 1.2 }}>{product.name}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>{product.description}</p>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>€{price.toFixed(2)}</span>
                {hasDiscount && <span style={{ fontSize: 16, color: 'var(--text-light)', textDecoration: 'line-through' }}>€{product.price.toFixed(2)}</span>}
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>per {product.unit_label}</span>
              </div>

              {/* Stock */}
              <div>
                {product.stock_status === 'in_stock' && <span className="badge badge-green">✓ In Stock</span>}
                {product.stock_status === 'low_stock' && <span className="badge badge-orange">⚡ Low Stock — {product.stock_qty} left</span>}
                {product.stock_status === 'out_of_stock' && <span className="badge badge-red">Out of Stock</span>}
              </div>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {product.tags.map(t => <span key={t} className="tag">#{t}</span>)}
                </div>
              )}

              <hr />

              {/* Add to cart */}
              {product.stock_status !== 'out_of_stock' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="qty-stepper">
                    <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                  </div>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAdd}>
                    Add to Cart — €{(price * qty).toFixed(2)}
                  </button>
                </div>
              )}

              <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                🚚 Free delivery on orders over €50 · 💬 Questions? WhatsApp us
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
