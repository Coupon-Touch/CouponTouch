import axios from 'axios';

const Axios = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
Axios.interceptors.request.use(
  config => {
    // Retrieve the latest token from localStorage
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(config);
    return config;
  },
  error => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default Axios;
