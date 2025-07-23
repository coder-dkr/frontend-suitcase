import React from 'react';
import { Package, Ruler, Palette, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onOrderClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOrderClick }) => {
  const getMaterialColor = (material: string) => {
    switch (material) {
      case 'leather': return 'bg-amber-100 text-amber-800';
      case 'plastic': return 'bg-blue-100 text-blue-800';
      case 'fabric': return 'bg-green-100 text-green-800';
      case 'aluminum': return 'bg-gray-100 text-gray-800';
      case 'carbon-fiber': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Product Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getMaterialColor(product.material)}`}>
            {product.material}
          </span>
        </div>

        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Product Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Ruler className="h-4 w-4" />
            <span>
              {product.height} × {product.width}{product.depth ? ` × ${product.depth}` : ''} cm
            </span>
          </div>

          {product.color && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Palette className="h-4 w-4" />
              <span className="capitalize">{product.color}</span>
            </div>
          )}

          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                  +{product.features.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">₹{product.rate}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {product.stock > 0 ? (
                <span className="text-green-600">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </p>
          </div>

          <button
            onClick={() => onOrderClick?.(product)}
            disabled={product.stock === 0 || product.isSold}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 || product.isSold ? 'Sold Out' : 'Order Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;