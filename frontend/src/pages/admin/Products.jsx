import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import { Plus, Pencil, Trash2, X, Search, Tag, Package } from 'lucide-react';

export default function Products() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTag, setActiveTag] = useState('all');
  const [search, setSearch] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [catEditId, setCatEditId] = useState(null);
  const navigate = useNavigate();

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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchTag =
      activeTag === 'all' || p.category?.id === parseInt(activeTag);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  const handleDeleteProduct = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    await api.delete(`/products/${id}`);
    fetchData();
  };

  const handleCatSubmit = async () => {
    if (!catForm.name.trim()) return;
    const token = localStorage.getItem('token');
    try {
      if (catEditId) {
        await api.put(`/categories/${catEditId}`, catForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/categories', catForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowCatModal(false);
      setCatForm({ name: '', description: '' });
      setCatEditId(null);
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDeleteCat = async (id) => {
    if (!confirm('Xóa danh mục này?')) return;
    const token = localStorage.getItem('token');
    await api.delete(`/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  return (
    <AdminLayout>
      {/* Tab switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${tab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Package size={16} /> Sản phẩm
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${tab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Tag size={16} /> Danh mục
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {tab === 'products' && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={() => navigate('/admin/products/create')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Plus size={16} /> Thêm sản phẩm
            </button>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setActiveTag('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition
                                ${activeTag === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Tất cả ({products.length})
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTag(String(c.id))}
                className={`px-3 py-1 rounded-full text-xs font-medium transition
                                    ${activeTag === String(c.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {c.name} (
                {products.filter((p) => p.category?.id === c.id).length})
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-400">
              Chưa có sản phẩm nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition group"
                >
                  <div className="relative h-44 bg-gray-50">
                    {p.imageUrl || (p.images && p.images[0]) ? (
                      <img
                        src={p.imageUrl || p.images[0]?.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={40} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                        className="p-1.5 bg-white rounded-lg shadow text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 bg-white rounded-lg shadow text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      {p.category?.name || 'Chưa phân loại'}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-bold text-sm">
                        {Number(p.price).toLocaleString('vi-VN')}₫
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium
                                                ${
                                                  p.stock > 10
                                                    ? 'bg-green-100 text-green-700'
                                                    : p.stock > 0
                                                      ? 'bg-yellow-100 text-yellow-700'
                                                      : 'bg-red-100 text-red-700'
                                                }`}
                      >
                        {p.stock} cái
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {tab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Danh sách danh mục
            </h2>
            <button
              onClick={() => {
                setShowCatModal(true);
                setCatEditId(null);
                setCatForm({ name: '', description: '' });
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Plus size={16} /> Thêm danh mục
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Tag size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{c.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {products.filter((p) => p.category?.id === c.id).length}{' '}
                        sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setCatForm({
                          name: c.name,
                          description: c.description || '',
                        });
                        setCatEditId(c.id);
                        setShowCatModal(true);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteCat(c.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {c.description && (
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                    {c.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold">
                {catEditId ? 'Sửa danh mục' : 'Thêm danh mục'}
              </h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={catForm.name}
                  onChange={(e) =>
                    setCatForm({ ...catForm, name: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Mô tả
                </label>
                <textarea
                  value={catForm.description}
                  onChange={(e) =>
                    setCatForm({ ...catForm, description: e.target.value })
                  }
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCatSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  {catEditId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
