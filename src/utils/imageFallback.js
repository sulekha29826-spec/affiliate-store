export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';

export const CATEGORY_FALLBACK_MAP = {
  electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  fashion: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  appliances: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
  beauty: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&auto=format&fit=crop&q=80',
  home: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
};

export function handleImageError(event, category = 'electronics') {
  if (!event || !event.target) return;
  event.target.onerror = null; // Prevent infinite loop
  const fallback = CATEGORY_FALLBACK_MAP[category?.toLowerCase()] || DEFAULT_FALLBACK_IMAGE;
  event.target.src = fallback;
}
