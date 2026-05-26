import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import ProductCard from '../../components/customer/ProductCard';
import api from '../../api/axiosConfig';
import { Package, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const activeCategory = searchParams.get('category') || 'all';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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

  const setCategory = (id) => {
    if (id === 'all') searchParams.delete('category');
    else searchParams.set('category', id);
    setSearchParams(searchParams);
  };

  const filtered = products
    .filter((p) => {
      const matchCat =
        activeCategory === 'all' || p.category?.id === parseInt(activeCategory);
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const activeCatName =
    activeCategory === 'all'
      ? 'Tất cả sản phẩm'
      : categories.find((c) => String(c.id) === activeCategory)?.name ||
        'Sản phẩm';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={setSearch} hideCategory />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Trang chủ
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{activeCatName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal size={16} className="text-gray-500" />
                <h3 className="font-bold text-gray-900 text-sm">Danh mục</h3>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition flex items-center justify-between
                                        ${
                                          activeCategory === 'all'
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                >
                  <span>Tất cả</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full
                                        ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {products.length}
                  </span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(String(c.id))}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition flex items-center justify-between
                                            ${
                                              activeCategory === String(c.id)
                                                ? 'bg-blue-600 text-white font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                  >
                    <span>{c.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full
                                            ${activeCategory === String(c.id) ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {products.filter((p) => p.category?.id === c.id).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Price range */}
              <div className="border-t border-gray-100 mt-4 pt-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">
                  Sắp xếp
                </h3>
                <div className="space-y-1">
                  {[
                    { value: 'default', label: 'Mặc định' },
                    { value: 'price-asc', label: 'Giá tăng dần' },
                    { value: 'price-desc', label: 'Giá giảm dần' },
                    { value: 'name', label: 'Tên A-Z' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition
                                                ${
                                                  sortBy === opt.value
                                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                {activeCatName}
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filtered.length} sản phẩm)
                </span>
              </h1>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
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
              <div className="text-center py-24 text-gray-400">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
