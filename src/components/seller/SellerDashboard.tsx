/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import React, { useEffect, useState } from "react";
import {
  Package,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Plus,
  X,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { sellerAPI } from "../../services/api";
import StatCard from "../common/StatCard";
import LoadingSpinner from "../common/LoadingSpinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

type ProductForm = {
  name: string;
  description?: string;
  material: string;
  height: number;
  width: number;
  depth?: number;
  rate: number;
  stock: number;
  features?: string[];
  color?: string;
};

type Product = {
  _id: string;
  name: string;
  material: string;
  rate: number;
  stock: number;
  color?: string;
  isSold?: boolean;
};

const SellerDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    material: "",
    height: 0,
    width: 0,
    depth: 0,
    rate: 0,
    stock: 0,
    features: [],
    color: "",
  });
  const [updateFormData, setUpdateFormData] = useState<ProductForm | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await sellerAPI.getDashboard();
      if (response.data.success && response.data.data) {
        setStats(response.data.data);
      }
    } catch {
      toast.error("Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await sellerAPI.getProducts(1, 20);
      if (response.data.success) {
        setProducts(response.data.data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (err) {
      toast.error("Could not load products");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isUpdateForm: boolean = false
  ) => {
    const { name, value } = e.target;
    const setFormDataFn = isUpdateForm ? setUpdateFormData : setFormData;

    setFormDataFn((prev: any) => ({
      ...prev,
      [name]:
        name === "height" ||
        name === "width" ||
        name === "depth" ||
        name === "rate" ||
        name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (isUpdateForm: boolean = false) => {
    try {
      const data = isUpdateForm ? updateFormData : formData;
      const { name, material, height, width, rate, stock } = data || {};
      if (!name || !material || !height || !width || !rate || !stock) {
        toast.error("Please fill in all required fields");
        return;
      }

      let response;
      if (isUpdateForm && selectedProductId) {
        response = await sellerAPI.updateProduct(
          selectedProductId,
          data as any
        );
      } else {
        response = await sellerAPI.createProduct(data as any);
      }

      if (response.data.success) {
        toast.success(
          isUpdateForm
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        setShowAddModal(false);
        setShowUpdateModal(false);
        fetchDashboardStats();
        if (showProducts) fetchProducts();
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Server error: Failed to process product.";
      toast.error(message);
    }
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      const response = await sellerAPI.markAsSold(id);
      if (response.data.success) {
        toast.success("Product marked as sold!");
        fetchProducts();
        fetchDashboardStats();
      } else {
        toast.error(response.data.message || "Failed to mark product as sold.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Server error: Failed to mark product as sold.";
      toast.error(message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await sellerAPI.deleteProduct(id);
      if (response.data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error(response.data.message || "Failed to delete product.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        "Server error: Failed to delete product.";
      toast.error(message);
    }
  };

  const toggleProducts = () => {
    setShowProducts((prev) => !prev);
    if (!showProducts) {
      fetchProducts();
    }
  };

  const openUpdateModal = (product: Product) => {
    setSelectedProductId(product._id);
    setUpdateFormData({
      name: product.name,
      description: product.description,
      material: product.material,
      height: product.height,
      width: product.width,
      depth: product.depth,
      rate: product.rate,
      stock: product.stock,
      color: product.color || "",
    });
    setShowUpdateModal(true);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your suitcase inventory and sales
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(prev => !prev)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
         {showAddModal ? "close" : "Add Product"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats?.stats.totalProducts || 0}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Sold Products"
          value={`${stats?.stats.soldProducts || 0}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Available Products"
          value={stats?.stats.availableProducts || 0}
          icon={ShoppingBag}
          color="purple"
        />
        <StatCard
          title="Sold Percentage"
          value={stats?.stats.soldPercentage}
          icon={TrendingUp}
          color="yellow"
          change={{ value: 2.1, isPositive: true }}
        />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={toggleProducts}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium text-gray-900">Manage Products</h4>
                <p className="text-sm text-gray-600">
                  View, edit, and update your product listings
                </p>
              </div>
              {showProducts ? (
                <EyeOff className="text-gray-400" />
              ) : (
                <Eye className="text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity: string, index: number) => (
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

      {/* Product List Section */}
      {showProducts && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            All Products
          </h3>
          {products.length === 0 ? (
            <p className="text-sm text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Material: {product.material}
                  </p>
                  <p className="text-sm text-gray-600">Rate: ₹{product.rate}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </p>
                  {product.color && (
                    <p className="text-sm text-gray-600">
                      Color: {product.color}
                    </p>
                  )}
                  {product.isSold ? (
                    <p className="text-sm text-gray-600">
                      SOLD
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">NOT SOLD:</p>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => openUpdateModal(product)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleMarkAsSold(product._id)}
                      className="p-1 text-green-600 hover:text-green-800"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && ( 
        <ProductForm />
      )}

      {/* Update Product Modal */}
      {showUpdateModal && updateFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold mb-4">Update Product</h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={updateFormData.name}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Name"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="material"
                value={updateFormData.material}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Material"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="height"
                value={updateFormData.height}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Height"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="width"
                value={updateFormData.width}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Width"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="depth"
                value={updateFormData.depth}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Depth"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="rate"
                value={updateFormData.rate}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Rate"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="stock"
                value={updateFormData.stock}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Stock"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="color"
                value={updateFormData.color}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Color"
                className="border p-2 rounded"
              />
              <textarea
                name="description"
                value={updateFormData.description}
                onChange={(e) => handleInputChange(e, true)}
                placeholder="Description"
                className="border p-2 rounded col-span-2"
              />
            </div>
            <button
              onClick={() => handleSubmit(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
