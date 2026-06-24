import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // 1. Skip Authorization header for refresh-token request
    if (config.url === 'auth/refresh-token') {
      return config;
    }

    // 2. Get token from localStorage or Cookies
    const token = localStorage.getItem("accessToken") || Cookies.get("accessToken");
    
    if (token) {
      // 3. Use .set() for better compatibility with Axios 1.x headers
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401, code is TOKEN_EXPIRED, and not already retried
    if (error.response?.status === 401 && error.response?.data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await axiosInstance.post('auth/refresh-token');
        const { accessToken } = response.data.data;

        // Store new access token
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          Cookies.set("accessToken", accessToken, { expires: 7 });
        }

        processQueue(null, accessToken);

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails, clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          Cookies.remove("accessToken");
          
          // Get current locale from pathname
          const locale = window.location.pathname.split('/')[1] || 'en';
          window.location.href = `/${locale}/login`; 
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
