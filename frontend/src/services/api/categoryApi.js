import api from './index';
export const getCategories = () => api.get('/categories');
export const getCategoryProducts = (slug, params) => api.get(`/categories/${slug}/products`, { params });
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.patch(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
