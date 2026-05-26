import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import StarRating from '../../components/customer/StarRating';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import api from '../../api/axiosConfig';
import {
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Package,
  Minus,
  Plus,
  Check,
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [myReview, setMyReview] = useState({ rating: 5, comment: '' });
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setSelectedImage(0);

        // Fetch related products
        const allRes = await api.get('/products');
        const all = Array.isArray(allRes.data) ? allRes.data : [];
        const related = all
          .filter(
            (p) =>
              p.id !== res.data.id && p.category?.id === res.data.category?.id,
          )
          .slice(0, 4);
        setRelatedProducts(related);

        // Fetch reviews
        const [reviewsRes, statsRes] = await Promise.all([
          api.get(`/reviews/product/${id}`),
          api.get(`/reviews/product/${id}/stats`),
        ]);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const allImages = product
    ? [
        ...(product.imageUrl ? [{ imageUrl: product.imageUrl }] : []),
        ...(product.images || []).filter(
          (img) => img.imageUrl !== product.imageUrl,
        ),
      ]
    : [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const filledSpecs = product?.specs?.filter((s) => s.specValue?.trim()) || [];

  const addItem = useCartStore((s) => s.addItem);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded-2xl" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-24 text-gray-400">
          Sản phẩm không tồn tại
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate('/')}
              className="hover:text-blue-600"
            >
              Trang chủ
            </button>
            <ChevronRight size={14} />
            <button
              onClick={() => navigate('/')}
              className="hover:text-blue-600"
            >
              {product.category?.name || 'Sản phẩm'}
            </button>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main product section */}
        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden aspect-square flex items-center justify-center p-8">
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImage]?.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Package size={80} className="text-gray-200" />
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl border-2 overflow-hidden transition
                                            ${selectedImage === i ? 'border-blue-600' : 'border-gray-100 hover:border-blue-300'}`}
                  >
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Category + Title */}
            <div>
              <span className="text-blue-600 text-sm font-medium">
                {product.category?.name || 'Sản phẩm'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating
                average={stats.average}
                count={stats.count}
                size={16}
              />
              <span className="text-sm text-gray-300">|</span>
              <span
                className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}
              >
                {product.stock > 0
                  ? `Còn ${product.stock} sản phẩm`
                  : 'Hết hàng'}
              </span>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-2xl p-5">
              <p className="text-3xl font-bold text-blue-600">
                {Number(product.price).toLocaleString('vi-VN')}₫
              </p>
              <p className="text-sm text-gray-500 mt-1">Đã bao gồm VAT</p>
            </div>

            {/* Quick specs */}
            {filledSpecs.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Thông số nổi bật
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filledSpecs.slice(0, 6).map((spec, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-xs text-gray-400">
                        {spec.specName}
                      </span>
                      <span className="text-xs font-medium text-gray-800 mt-0.5">
                        {spec.specValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Số lượng:
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition text-gray-600"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-12 text-center border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-3 py-2 hover:bg-gray-50 transition text-gray-600"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition
                                        ${
                                          addedToCart
                                            ? 'bg-green-500 text-white'
                                            : product.stock === 0
                                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                >
                  {addedToCart ? (
                    <Check size={18} />
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                  {addedToCart ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
                </button>
                <button className="p-3.5 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition">
                  <Heart size={20} />
                </button>
                <button className="p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                  <Share2 size={20} />
                </button>
              </div>
              <button
                disabled={product.stock === 0}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold rounded-xl transition"
              >
                Mua ngay
              </button>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: 'BH 12 tháng' },
                { icon: Truck, text: 'Miễn phí ship' },
                { icon: RotateCcw, text: 'Đổi trả 30 ngày' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl text-center"
                >
                  <item.icon size={18} className="text-blue-600" />
                  <span className="text-xs text-gray-600 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description + Specs */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Description */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Mô tả sản phẩm
            </h2>
            {product.description ? (
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            ) : (
              <p className="text-gray-400 text-sm">Chưa có mô tả</p>
            )}
          </div>

          {/* Full specs */}
          {filledSpecs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Thông số kỹ thuật
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                {filledSpecs.map((spec, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-2 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <div className="px-4 py-3 flex items-center border-r border-gray-100">
                      <span className="text-sm font-semibold text-gray-700">
                        {spec.specName}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex items-center">
                      <span className="text-sm text-gray-600">
                        {spec.specValue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="h-44 bg-gray-50 overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <Package size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      {p.category?.name}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-sm">
                      {Number(p.price).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Reviews */}
      <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
          {stats.count > 0 && (
            <div className="flex items-center gap-4 bg-yellow-50 border border-yellow-100 px-5 py-3 rounded-2xl">
              <div className="text-center">
                <p className="text-4xl font-bold text-yellow-500 leading-none">
                  {stats.average}
                </p>
                <p className="text-xs text-gray-400 mt-1">/ 5 điểm</p>
              </div>
              <div className="w-px h-10 bg-yellow-200" />
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(stats.average)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200 fill-gray-200'
                      }
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {stats.count} lượt đánh giá
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Write review */}
        {token && !hasReviewed && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Viết đánh giá của bạn
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Đánh giá
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setMyReview((r) => ({ ...r, rating: star }))
                      }
                    >
                      <Star
                        size={32}
                        className={
                          star <= myReview.rating
                            ? 'text-yellow-400 fill-yellow-400 hover:scale-110 transition-transform'
                            : 'text-gray-200 fill-gray-200 hover:text-yellow-300 hover:fill-yellow-300 transition-colors'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-lg border border-gray-200">
                    {
                      ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][
                        myReview.rating
                      ]
                    }
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nhận xét
                </label>
                <textarea
                  value={myReview.comment}
                  onChange={(e) =>
                    setMyReview((r) => ({ ...r, comment: e.target.value }))
                  }
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                  rows={3}
                  className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <button
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    const token = localStorage.getItem('token');
                    await api.post(`/reviews/product/${id}`, myReview, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const [r, s] = await Promise.all([
                      api.get(`/reviews/product/${id}`),
                      api.get(`/reviews/product/${id}/stats`),
                    ]);
                    setReviews(Array.isArray(r.data) ? r.data : []);
                    setStats(s.data);
                    setHasReviewed(true);
                  } catch (err) {
                    alert(err.response?.data?.message || 'Có lỗi xảy ra!');
                  }
                  setSubmitting(false);
                }}
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        )}

        {!token && (
          <div className="bg-blue-50 rounded-2xl p-5 mb-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Đăng nhập để đánh giá sản phẩm này
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Đăng nhập
            </button>
          </div>
        )}

        {/* Review list */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Star size={40} className="mx-auto mb-3 opacity-20" />
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {r.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {r.user?.fullName || 'Người dùng'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < r.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200 fill-gray-200'
                        }
                      />
                    ))}
                    <span className="text-xs font-semibold text-yellow-600 ml-1">
                      {r.rating}.0
                    </span>
                  </div>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3">
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          © 2026 TechShop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
