import api from './index';
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (slug) => api.get(`/products/${slug}`);
export const getFeatured = () => api.get('/products/featured');
export const getTrending = () => api.get('/products/trending');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
