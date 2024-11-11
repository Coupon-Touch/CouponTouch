import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const Axios: AxiosInstance = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
Axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Request Config:', config);
    }

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default Axios;
