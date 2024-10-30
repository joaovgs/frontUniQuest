import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type CustomAxiosRequestConfig = AxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
  baseURL: 'https://uniquest-production.up.railway.app',
  // baseURL: 'http://localhost:3333',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const refreshResponse = await api.patch('/token/refresh', {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const newToken = refreshResponse.data.token;
        localStorage.setItem('authToken', newToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erro ao renovar o token:', refreshError);
        localStorage.removeItem('authToken');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
