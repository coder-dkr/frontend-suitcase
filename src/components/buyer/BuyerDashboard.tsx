/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, Clock, CheckCircle } from 'lucide-react';
import { buyerAPI } from '../../services/api';
import { DashboardStats, Product, Order } from '../../types';
import StatCard from '../common/StatCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import ProductCard from './ProductCard';
import OrderCard from './OrderCard';
import OrderForm from './OrderForm';

const BuyerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await buyerAPI.getDashboard();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await buyerAPI.getProducts();
      if (response.data.success) {
        setProducts(response.data.data.products);
      }
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await buyerAPI.getOrders();
      if (response.data.success) {
        setOrders(response.data.data.orders);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setShowOrderForm(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await buyerAPI.cancelOrder(orderId);
      if (response.data.success) {
        toast.success('Order cancelled successfully!');
        fetchOrders();
      } else {
        toast.error(response.data.message || 'Failed to cancel order.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Server error: Failed to cancel order.';
      toast.error(message);
    }
  };

  const handleOrderSuccess = () => {
    setShowOrderForm(false);
    fetchOrders();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-1">Browse and purchase premium suitcases</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.stats?.totalOrders || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Pending orders"
          value={`${stats?.stats.pendingOrders || 0}`}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Cancelled Orders"
          value={stats?.stats.cancelledOrders}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Orders"
          value={stats?.stats.deliveredOrders}
          icon={CheckCircle}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/buyer/products'}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">Browse Products</h4>
              <p className="text-sm text-gray-600">Explore our premium suitcase collection</p>
            </button>
            <button
              onClick={() => window.location.href = '/buyer/orders'}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">View Orders</h4>
              <p className="text-sm text-gray-600">Track your order history and status</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-gray-600">No orders found.</p>
            ) : (
              orders.length > 0 && orders.map((order) => (
                <OrderCard key={order._id} order={order} onCancel={handleCancelOrder} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onOrderClick={handleOrderClick} />
          ))}
        </div>
      </div>

      {showOrderForm && selectedProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-scroll">
      <OrderForm
        product={selectedProduct}
        onSuccess={handleOrderSuccess}
        onCancel={() => setShowOrderForm(false)}
      />
    </div>
  </div>
)}

    </div>
  );
};

export default BuyerDashboard;
