import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: 'https://uniquest-production.up.railway.app',
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
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }; 

    if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.patch('/token/refresh');

        localStorage.setItem('authToken', refreshResponse.data.token);

        api.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse.data.token}`;

        return api(originalRequest); 
      } catch (refreshError) {
        console.error('Erro ao renovar o token:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
