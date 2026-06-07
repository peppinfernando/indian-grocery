import axios from 'axios';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '/api';
  }
  return `http://${hostname}:8000/api`;
};

const api = axios.create({ baseURL: getBaseURL() });

export const getProducts = (params) => api.get('/products/', { params }).then(r => r.data);
export const getFeatured = () => api.get('/products/featured').then(r => r.data);
export const getSeasonal = () => api.get('/products/seasonal').then(r => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then(r => r.data);
export const createProduct = (data) => api.post('/products/', data).then(r => r.data);
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data).then(r => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then(r => r.data);
export const getCategories = () => api.get('/categories/').then(r => r.data);
export const getOrders = (params) => api.get('/orders/', { params }).then(r => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const createOrder = (data) => api.post('/orders/', data).then(r => r.data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, null, { params: { status } }).then(r => r.data);
export const login = (data) => api.post('/auth/login', data).then(r => r.data);
export const register = (data) => api.post('/auth/register', data).then(r => r.data);
export const getCustomer = (id) => api.get(`/customers/${id}`).then(r => r.data);
export const updateCustomer = (id, data) => api.patch(`/customers/${id}`, data).then(r => r.data);
export const getDashboard = () => api.get('/admin/dashboard').then(r => r.data);
