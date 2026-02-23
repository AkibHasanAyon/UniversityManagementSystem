import axios from 'axios';

//const BASE_URL = 'https://vondobaba.pythonanywhere.com';
const BASE_URL = 'http://localhost:1111';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 + token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
            refresh: refreshToken,
          });
          const refreshPayload = res.data.data || res.data;
          const newAccess = refreshPayload.access;
          localStorage.setItem('access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed — clear tokens and force re-login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth helpers ───────────────────────────────────────────────

export async function login(email, password) {
  const res = await api.post('/api/auth/login/', { email, password });

  // Backend wraps response: { status, message, data: { access, refresh, user } }
  const payload = res.data.data || res.data;

  const accessToken = payload.access_token || payload.access;
  const refreshToken = payload.refresh_token || payload.refresh;

  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);

  const user = payload.user;
  localStorage.setItem('user', JSON.stringify(user));

  return user;
}

export async function logout() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await api.post('/api/auth/logout/', { refresh: refreshToken });
    }
  } catch (e) {
    // Ignore logout errors — we still clear local state
    console.warn('Logout API call failed:', e);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
}

export async function forgotPassword(email) {
  const res = await api.post('/api/auth/forgot-password/', { email });
  return res.data.data || res.data;
}

export async function verifyOtp(email, otp) {
  const res = await api.post('/api/auth/verify-otp/', { email, otp });
  return res.data.data || res.data;
}

export async function resetPassword(email, otp, newPassword) {
  const res = await api.post('/api/auth/reset-password/', { email, otp, new_password: newPassword });
  return res.data.data || res.data;
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

export default api;
