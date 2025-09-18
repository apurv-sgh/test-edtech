import api from './api';

export const fetchTopCategories = async () => {
  console.log('[categories.js] fetching /api/categories/top ...');
  const res = await api.get('/api/categories/top');
  console.log('[categories.js] response status:', res.status);
  console.log('[categories.js] response data:', res.data);
  // Support both { success, categories } and array for resilience
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.categories)) return res.data.categories;
  return [];
};

export const fetchCategoryBySlug = async (slug) => {
  console.log('[categories.js] fetching /api/categories/' + slug + ' ...');
  const res = await api.get('/api/categories/' + slug);
  console.log('[categories.js] by-slug status:', res.status);
  console.log('[categories.js] by-slug data:', res.data);
  return res.data?.category || null;
};

export default { fetchTopCategories };


