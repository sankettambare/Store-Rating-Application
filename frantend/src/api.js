import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`; // Make sure 'Bearer ' is followed by space
  return cfg;
});

export default API;
