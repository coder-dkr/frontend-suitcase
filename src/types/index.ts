export interface User {
  _id: string;
  email: string;
  role: "admin" | "seller" | "buyer";
  isVerified: boolean;
  createdAt: string;
}

export interface Product {
  _id?: string;
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
}

export interface Order {
  _id: string;
  buyer: string;
  product: Product;
  quantity: number;
  totalAmount: number;
  paymentMethod: "cod" | "online";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: string;
  orderNotes?: string;
  orderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    user?: User;
  };
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
  success: boolean;
  message: string;
  data: {
    userStats: {
      totalUsers: number;
      verifiedUsers: number;
      unverifiedUsers: number;
      usersByRole: {
        _id: string;
        count: number;
      }[];
    };
    productStats: {
      totalProducts: number;
      soldProducts: number;
      availableProducts: number;
      productsByMaterial: {
        _id: string;
        count: number;
      }[];
    };
    orderStats: {
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      ordersByStatus: {
        _id: string;
        count: number;
      }[];
      totalRevenue: number;
    };
    recentActivities: {
      recentUsers: {
        _id: string;
        email: string;
        role: string;
        isVerified: boolean;
        createdAt: string;
      }[];
      recentOrders: {
        _id: string;
        buyer: {
          _id: string;
          email: string;
        };
        product: {
          _id: string;
          name: string;
        };
        totalAmount: number;
        status: string;
        createdAt: string;
      }[];
    };
  };
}
