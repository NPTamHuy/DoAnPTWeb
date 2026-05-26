import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import { ArrowLeft, Plus, X, Upload, GripVertical } from 'lucide-react';

const DEFAULT_SPECS = [
  'Chip AI',
  'Loại card đồ họa',
  'Dung lượng RAM',
  'Loại RAM',
  'Số khe RAM',
  'Ổ cứng',
  'Kích thước màn hình',
  'Công nghệ màn hình',
  'Pin',
  'Hệ điều hành',
  'Độ phân giải màn hình',
  'Loại CPU',
  'Cổng giao tiếp',
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    active: true,
  });

  const [specs, setSpecs] = useState(
    DEFAULT_SPECS.map((name) => ({ specName: name, specValue: '' })),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/categories'),
        ]);
        const p = productRes.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          stock: p.stock || '',
          categoryId: p.category?.id || '',
          active: p.active ?? true,
        });
        setImages(p.images || []);
        setCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
        );

        // Merge specs: default + existing
        if (p.specs && p.specs.length > 0) {
          const existingMap = {};
          p.specs.forEach((s) => {
            existingMap[s.specName] = s.specValue;
          });
          const merged = DEFAULT_SPECS.map((name) => ({
            specName: name,
            specValue: existingMap[name] || '',
          }));
          // Add custom specs not in default
          p.specs.forEach((s) => {
            if (!DEFAULT_SPECS.includes(s.specName)) {
              merged.push({ specName: s.specName, specValue: s.specValue });
            }
          });
          setSpecs(merged);
        }
      } catch (err) {
        console.error(err);
      }
      setFetching(false);
    };
    fetchData();
  }, [id]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          const res = await api.post('/products/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return { imageUrl: res.data.url, sortOrder: images.length };
        }),
      );
      setImages((prev) => [...prev, ...uploads]);
    } catch (err) {
      alert('Upload ảnh thất bại!');
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpec = (index, value) => {
    setSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, specValue: value } : s)),
    );
  };

  const addCustomSpec = () => {
    setSpecs((prev) => [...prev, { specName: '', specValue: '' }]);
  };

  const removeSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) {
      alert('Vui lòng điền tên và giá sản phẩm!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        active: form.active,
        imageUrl: images[0]?.imageUrl || null,
        category: form.categoryId ? { id: parseInt(form.categoryId) } : null,
        images: images.map((img, i) => ({
          imageUrl: img.imageUrl,
          sortOrder: i,
        })),
        specs: specs.filter((s) => s.specValue.trim() !== ''),
      };
      await api.put(`/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/products');
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  if (fetching)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-gray-400">
          Đang tải...
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="text-sm text-gray-500">{form.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left */}
        <div className="col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Thông tin cơ bản
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={5}
                  className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Giá bán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Số lượng tồn kho
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border border-gray-200 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Hình ảnh sản phẩm
            </h2>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img
                    src={img.imageUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      Chính
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                <Upload size={20} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Thêm ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {uploading && (
              <p className="text-sm text-blue-500">Đang upload...</p>
            )}
            <p className="text-xs text-gray-400">
              Ảnh đầu tiên sẽ là ảnh đại diện.
            </p>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Thông số kỹ thuật
              </h2>
              <button
                onClick={addCustomSpec}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={16} /> Thêm thông số
              </button>
            </div>
            <div className="space-y-3">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-3">
                  <GripVertical
                    size={16}
                    className="text-gray-300 flex-shrink-0"
                  />
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={spec.specName}
                      onChange={(e) =>
                        setSpecs((prev) =>
                          prev.map((s, idx) =>
                            idx === i ? { ...s, specName: e.target.value } : s,
                          ),
                        )
                      }
                      placeholder="Tên thông số"
                      className="border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    />
                    <input
                      type="text"
                      value={spec.specValue}
                      onChange={(e) => updateSpec(i, e.target.value)}
                      placeholder="Giá trị"
                      className="border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => removeSpec(i)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Xuất bản
            </h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Hiển thị trên cửa hàng
              </span>
            </label>
            <div className="space-y-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Cập nhật sản phẩm'}
              </button>
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Danh mục
            </h2>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Xem trước
              </h2>
              <img
                src={images[0].imageUrl}
                alt="preview"
                className="w-full aspect-square object-cover rounded-lg border border-gray-100 mb-3"
              />
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {form.name}
              </p>
              <p className="text-blue-600 font-bold text-sm mt-1">
                {form.price
                  ? Number(form.price).toLocaleString('vi-VN') + '₫'
                  : '—'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
