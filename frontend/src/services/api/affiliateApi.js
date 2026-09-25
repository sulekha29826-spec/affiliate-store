import api from './index';
export const trackClick = (data) => api.post('/affiliate/click', data);
