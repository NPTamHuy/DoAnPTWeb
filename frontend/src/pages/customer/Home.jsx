import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import Footer from '../../components/customer/Footer';
import ProductCard from '../../components/customer/ProductCard';
import api from '../../api/axiosConfig';
import {
  Zap,
  Shield,
  Truck,
  Headphones,
  Package,
  ChevronRight,
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
        ]);
        setProducts(Array.isArray(p.data) ? p.data : []);
        setCategories(Array.isArray(c.data) ? c.data : []);
      } catch (err) {
        setProducts([]);
        setCategories([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(products.length, 5));
    }, 3500);
    return () => clearInterval(timer);
  }, [products]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearch} />

      {/* Hero Banner */}
      <section className="bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm mb-6">
                <Zap size={14} />
                <span>Công nghệ đỉnh cao, giá tốt nhất</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Khám phá thế giới
                <br />
                <span className="text-blue-200">công nghệ</span> hiện đại
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                Laptop, điện thoại, máy tính bảng chính hãng — bảo hành 12 tháng
                toàn quốc.
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/products')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
                >
                  Mua ngay
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="border border-white/30 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition"
                >
                  Xem danh mục
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="hidden md:block">
              {products.length > 0 && (
                <div className="relative">
                  <div
                    className="bg-white/10 backdrop-blur rounded-3xl p-6 cursor-pointer hover:bg-white/20 transition"
                    onClick={() =>
                      navigate(`/product/${products[currentSlide]?.id}`)
                    }
                  >
                    <div className="relative h-56 mb-4">
                      {products[currentSlide]?.imageUrl ? (
                        <img
                          key={currentSlide}
                          src={products[currentSlide].imageUrl}
                          alt={products[currentSlide].name}
                          className="w-full h-full object-contain rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
                          <Package size={64} className="text-white/30" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        {products[currentSlide]?.category?.name || 'Sản phẩm'}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold text-lg line-clamp-1 mb-1">
                      {products[currentSlide]?.name}
                    </h3>
                    <p className="text-blue-200 text-xl font-bold">
                      {Number(products[currentSlide]?.price).toLocaleString(
                        'vi-VN',
                      )}
                      ₫
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {products.slice(0, 5).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`transition-all rounded-full ${i === currentSlide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        (prev) =>
                          (prev - 1 + Math.min(products.length, 5)) %
                          Math.min(products.length, 5),
                      )
                    }
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        (prev) => (prev + 1) % Math.min(products.length, 5),
                      )
                    }
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: 'Miễn phí vận chuyển',
                desc: 'Đơn hàng trên 500K',
              },
              {
                icon: Shield,
                title: 'Bảo hành chính hãng',
                desc: '12 tháng toàn quốc',
              },
              { icon: Zap, title: 'Giao hàng nhanh', desc: 'Trong vòng 24h' },
              {
                icon: Headphones,
                title: 'Hỗ trợ 24/7',
                desc: 'Tư vấn miễn phí',
              },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <f.icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {f.title}
                  </p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Danh mục sản phẩm</h2>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => navigate('/products')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Package size={22} className="text-gray-500" />
            </div>
            <span className="text-xs font-medium text-gray-600">Tất cả</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/products?category=${c.id}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/50 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <Package size={22} className="text-gray-500" />
              </div>
              <span className="text-xs font-medium text-center text-gray-600">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Sản phẩm nổi bật
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filtered.length} sản phẩm)
            </span>
          </h2>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {filtered.length > 8 && (
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </section>

      <Footer categories={categories} />
    </div>
  );
}
