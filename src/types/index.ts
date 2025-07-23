export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'seller' | 'buyer';
  isVerified: boolean;
  createdAt: string;
}

export interface Product {
  _id: string;
  seller: string;
  name: string;
  description?: string;
  material: string;
  height: number;
  width: number;
  depth?: number;
  rate: number;
  stock: number;
  isSold: boolean;
  features?: string[];
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  buyer: string;
  product: Product;
  quantity: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: string;
  orderNotes?: string;
  orderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface DashboardStats {
  totalUsers?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  recentActivity?: any[];
}