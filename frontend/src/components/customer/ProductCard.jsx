import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import StarRating from './StarRating';
import { getProductStats } from '../../api/productApi';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ average: 0, count: 0 });

  useEffect(() => {
    getProductStats(product.id).then(setStats);
  }, [product.id]);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <Package size={48} />
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Sắp hết
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
              Hết hàng
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-600 font-medium mb-1">
          {product.category?.name || 'Khác'}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug min-h-10">
          {product.name}
        </h3>
        <StarRating average={stats.average} count={stats.count} />
        <div className="flex items-center justify-between mt-3">
          <span className="text-blue-600 font-bold">
            {Number(product.price).toLocaleString('vi-VN')}₫
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
