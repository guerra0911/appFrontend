// api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:8000',
  baseURL: 'http://192.168.2.131:8000',
  // baseURL: 'http://18.119.118.178:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiWithoutAuth = axios.create({
  baseURL: 'http://192.168.2.131:8000',
  // baseURL: 'http://18.119.118.178:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.setAuthToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;
