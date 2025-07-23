import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, Clock, CheckCircle } from 'lucide-react';
import { buyerAPI } from '../../services/api';
import { DashboardStats } from '../../types';
import StatCard from '../common/StatCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const BuyerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await buyerAPI.getDashboard();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
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
        <button
          onClick={() => window.location.href = '/buyer/products'}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Browse Products
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Total Spent"
          value={`₹${stats?.totalRevenue || 0}`}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value="3"
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Completed Orders"
          value="12"
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Premium Leather Suitcase</p>
                <p className="text-sm text-gray-600">Ordered on Dec 15, 2023</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Delivered
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Hard Shell Travel Case</p>
                <p className="text-sm text-gray-600">Ordered on Dec 12, 2023</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;