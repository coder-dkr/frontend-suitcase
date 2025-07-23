import React from 'react';
import { Package, Calendar, CreditCard, MapPin, FileText, X } from 'lucide-react';
import { Order } from '../../types';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancel = order.status === 'pending';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {typeof order.product === 'object' ? order.product.name : 'Product'}
            </h3>
            {order.orderNumber && (
              <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span className="capitalize">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </span>
          </div>

          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 mt-0.5" />
            <span className="line-clamp-2">{order.shippingAddress}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-gray-600">Quantity: </span>
            <span className="font-medium text-gray-900">{order.quantity}</span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-600">Total Amount: </span>
            <span className="font-bold text-green-600 text-lg">₹{order.totalAmount}</span>
          </div>

          {typeof order.product === 'object' && (
            <div className="text-sm">
              <span className="text-gray-600">Material: </span>
              <span className="font-medium text-gray-900 capitalize">{order.product.material}</span>
            </div>
          )}
        </div>
      </div>

      {/* Order Notes */}
      {order.orderNotes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Order Notes:</p>
              <p className="text-sm text-gray-600 mt-1">{order.orderNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Features */}
      {typeof order.product === 'object' && order.product.features && order.product.features.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Product Features:</p>
          <div className="flex flex-wrap gap-1">
            {order.product.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {canCancel && onCancel && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => onCancel(order._id)}
            className="inline-flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;