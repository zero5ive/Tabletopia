// API 설정 파일
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8002/ws';

// 이미지 URL 헬퍼
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path; // 이미 전체 URL인 경우
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const getRestaurantImageUrl = (filename) => {
  if (!filename) return '';
  return `${API_BASE_URL}/uploads/restaurants/${filename}`;
};

export const getMenuImageUrl = (filename) => {
  if (!filename) return '';
  return `${API_BASE_URL}/uploads/menus/${filename}`;
};
