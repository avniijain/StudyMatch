import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend base URL
});

export const setupInterceptors = (logout) => {
  // Request interceptor → attach token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor → handle token expiry
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout(); // instantly updates UI
      }
      return Promise.reject(error);
    }
  );
};

export default api;
