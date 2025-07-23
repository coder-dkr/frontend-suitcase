import React, { useEffect, useState } from 'react';
import { Package, DollarSign, TrendingUp, ShoppingBag, Plus } from 'lucide-react';
import { sellerAPI } from '../../services/api';
import { DashboardStats } from '../../types';
import StatCard from '../common/StatCard';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await sellerAPI.getDashboard();
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
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your suitcase inventory and sales</p>
        </div>
        <button
          onClick={() => window.location.href = '/seller/products/new'}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue || 0}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Orders This Month"
          value={stats?.totalOrders || 0}
          icon={ShoppingBag}
          color="purple"
        />
        <StatCard
          title="Growth Rate"
          value="12.5%"
          icon={TrendingUp}
          color="yellow"
          change={{ value: 2.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/seller/products'}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">Manage Products</h4>
              <p className="text-sm text-gray-600">View, edit, and update your product listings</p>
            </button>
            <button
              onClick={() => window.location.href = '/seller/bulk-update'}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900">Bulk Price Update</h4>
              <p className="text-sm text-gray-600">Update prices for multiple products by material</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">{activity}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;