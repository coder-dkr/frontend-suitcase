import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ShoppingCart, MapPin, CreditCard, FileText } from 'lucide-react';
import { buyerAPI } from '../../services/api';
import { Product } from '../../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const schema = yup.object({
  quantity: yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  paymentMethod: yup.string().oneOf(['cod', 'online'], 'Please select a payment method').required('Payment method is required'),
  shippingAddress: yup.string().required('Shipping address is required'),
  orderNotes: yup.string().max(200, 'Order notes cannot exceed 200 characters'),
});

type FormData = yup.InferType<typeof schema>;

interface OrderFormProps {
  product: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ product, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: 1,
      paymentMethod: 'cod',
    },
  });

  const quantity = watch('quantity', 1);
  const totalAmount = quantity * product.rate;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await buyerAPI.placeOrder({
        product: product._id,
        quantity: data.quantity,
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        orderNotes: data.orderNotes || undefined,
      });
      
      toast.success('Order placed successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto ">
      <div className="bg-white rounded-xl shadow-sm border overflow-y-scroll border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Place Order</h1>
            <p className="text-gray-600">Complete your purchase</p>
          </div>
        </div>

        {/* Product Summary */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Product:</span>
              <span className="font-medium text-gray-900">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Material:</span>
              <span className="font-medium text-gray-900 capitalize">{product.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-medium text-gray-900">
                {product.height} × {product.width}{product.depth ? ` × ${product.depth}` : ''} cm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unit Price:</span>
              <span className="font-medium text-gray-900">₹{product.rate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Stock:</span>
              <span className="font-medium text-gray-900">{product.stock} units</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity *
            </label>
            <input
              {...register('quantity')}
              type="number"
              min="1"
              max={product.stock}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  {...register('paymentMethod')}
                  type="radio"
                  value="cod"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive the product</p>
                  </div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  {...register('paymentMethod')}
                  type="radio"
                  value="online"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3 flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Online Payment</p>
                    <p className="text-sm text-gray-600">Pay securely online</p>
                  </div>
                </div>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
            )}
          </div>

          {/* Shipping Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('shippingAddress')}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your complete shipping address..."
              />
            </div>
            {errors.shippingAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.message}</p>
            )}
          </div>

          {/* Order Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                {...register('orderNotes')}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any special instructions or notes..."
              />
            </div>
            {errors.orderNotes && (
              <p className="mt-1 text-sm text-red-600">{errors.orderNotes.message}</p>
            )}
          </div>

          {/* Total Amount */}
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || product.stock === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;