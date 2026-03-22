import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// 로그인된 유저 ID를 모든 요청 헤더에 첨부
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('erp_user');
    if (raw) {
      const user = JSON.parse(raw) as { userId: number };
      config.headers['X-User-Id'] = String(user.userId);
    }
  } catch {
    // ignore
  }
  return config;
});

export default api;
