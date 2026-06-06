import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../hooks/useApi';
import { ProductCard } from '../components/Shared';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const seasonal = searchParams.get('seasonal') || '';

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (featured === 'true') params.featured = true;
    if (seasonal === 'true') params.seasonal = true;
    getProducts(params).then(setProducts).finally(() => setLoading(false));
  }, [category, search, featured, seasonal]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getCategories().then(setCategories); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (searchInput.trim()) p.set('search', searchInput.trim()); else p.delete('search');
    setSearchParams(p);
  };

  const setCategory = (cat) => {
    const p = new URLSearchParams();
    if (cat) p.set('category', cat);
    setSearchParams(p);
    setSearchInput('');
  };

  const title = search ? `Results for "${search}"`
    : category ? category
    : featured === 'true' ? '⭐ Featured Products'
    : seasonal === 'true' ? '🍂 Seasonal Products'
    : 'All Products';

  return (
    <div className="page-content fade-up">
      <div className="container" style={{ paddingTop: 20 }}>
        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Search products…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          {(search || category || featured || seasonal) && (
            <button type="button" className="btn btn-ghost" onClick={() => { setSearchParams({}); setSearchInput(''); }}>Clear</button>
          )}
        </form>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 20, scrollbarWidth: 'none' }}>
          <button
            className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: '0 0 auto', borderRadius: 99 }}
            onClick={() => setCategory('')}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`btn btn-sm ${category === cat.name ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: '0 0 auto', borderRadius: 99, whiteSpace: 'nowrap' }}
              onClick={() => setCategory(cat.name)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>{title}</h1>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{products.length} items</span>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
