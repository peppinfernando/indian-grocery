import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ── Cart Context ────────────────────────────────────────────────
const CartContext = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)); }, [items]);

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, {
        product_id: product.id, product_name: product.name,
        unit_label: product.unit_label, unit_price: product.sale_price || product.price,
        quantity: qty, line_total: (product.sale_price || product.price) * qty,
        image: product.images?.[0] || ''
      }];
    });
  }, []);

  const updateQty = useCallback((product_id, qty) => {
    if (qty <= 0) return removeItem(product_id);
    setItems(prev => prev.map(i => i.product_id === product_id
      ? { ...i, quantity: qty, line_total: i.unit_price * qty } : i));
  }, []);

  const removeItem = useCallback((product_id) => {
    setItems(prev => prev.filter(i => i.product_id !== product_id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.line_total, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);

// ── Auth Context ────────────────────────────────────────────────
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.is_admin }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

// ── Toast Context ────────────────────────────────────────────────
const ToastContext = createContext();
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((msg, duration = 2000) => {
    setToast(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);
