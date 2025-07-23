import axios from 'axios';
import { AuthResponse, ApiResponse, Product, Order, User, DashboardStats } from '../types';

const API_BASE_URL = 'http://localhost:5100/api/v1';
// const API_BASE_URL = 'https://suiticase-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data: { email: string; password: string; role: string }) =>
    api.post<AuthResponse>('/auth/signup', data),
  
  verify: (data: { email: string; otp: string }) =>
    api.post<AuthResponse>('/auth/verify', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  resendOtp: (data: { email: string }) =>
    api.post<AuthResponse>('/auth/resend-otp', data),
};

export const sellerAPI = {
  getProducts: (page = 1, limit = 10) =>
    api.get<ApiResponse<Product[]>>(`/seller/products?page=${page}&limit=${limit}`),
  
  createProduct: (data: Omit<Product, '_id'>) =>
    api.post<ApiResponse<Product>>('/seller/products', data),
  
  updateProduct: (id: string, data: Partial<Product>) =>
    api.patch<ApiResponse<Product>>(`/seller/products/${id}`, data),
  
  markAsSold: (id: string) =>
    api.patch<ApiResponse<Product>>(`/seller/products/${id}/sold`),
  
  deleteProduct: (id: string) =>
    api.delete<ApiResponse>(`/seller/products/${id}`),
  
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/seller/dashboard'),
  
};

export const buyerAPI = {
  getProducts: (page = 1, limit = 10, material?: string) =>
    api.get<ApiResponse<Product[]>>(`/products`),
  
  placeOrder: (data: { productId: string; quantity: number; paymentMethod: string; shippingAddress: string; orderNotes?: string }) =>
    api.post<ApiResponse<Order>>('/orders', data),
  
  getOrders: (page = 1, limit = 10) =>
    api.get<ApiResponse<Order[]>>(`/orders`),
  
  cancelOrder: (id: string) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`),
  
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/orders/dashboard/stats'),
};

export const adminAPI = {
  getUsers: (page = 1, limit = 10, role?: string) =>
    api.get<ApiResponse<User[]>>(`/admin/users?page=${page}&limit=${limit}${role ? `&role=${role}` : ''}`),
  
  deleteUser: (id: string) =>
    api.delete<ApiResponse>(`/admin/users/${id}`),
  
  updateUserStatus: (id: string, isVerified: boolean) =>
    api.patch<ApiResponse<User>>(`/admin/users/${id}/status`, { isVerified }),
  
  getDashboard: () =>
    api.get<ApiResponse<DashboardStats>>('/admin/dashboard'),
  
  getSystemHealth: () =>
    api.get<ApiResponse>('/admin/system'),
};

export default api;