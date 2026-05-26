import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  categoryId: '',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const [p, c] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(Array.isArray(p.data) ? p.data : []);
      setCategories(Array.isArray(c.data) ? c.data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      alert('Upload ảnh thất bại!');
    }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) return;
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        category: form.categoryId ? { id: parseInt(form.categoryId) } : null,
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/products', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditId(null);
      fetchData();
    } catch (err) {
      alert('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl || '',
      categoryId: p.category?.id || '',
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    await api.delete(`/products/${id}`);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
          <button
            onClick={() => {
              setShowModal(true);
              setEditId(null);
              setForm(emptyForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} /> Thêm sản phẩm
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-500 text-sm">ID</th>
              <th className="text-left px-6 py-3 text-gray-500 text-sm">
                Tên sản phẩm
              </th>
              <th className="text-left px-6 py-3 text-gray-500 text-sm">
                Danh mục
              </th>
              <th className="text-left px-6 py-3 text-gray-500 text-sm">Giá</th>
              <th className="text-left px-6 py-3 text-gray-500 text-sm">
                Tồn kho
              </th>
              <th className="text-left px-6 py-3 text-gray-500 text-sm">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Chưa có sản phẩm nào
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{p.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {p.category?.name || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">
                    {Number(p.price).toLocaleString('vi-VN')}₫
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tên sản phẩm *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Mô tả"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Giá (VNĐ) *"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Tồn kho"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Upload ảnh từ máy */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600 font-medium">
                  Hình ảnh sản phẩm
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border px-4 py-2 rounded-lg text-sm"
                />
                {uploading && (
                  <p className="text-sm text-blue-500">Đang upload ảnh...</p>
                )}
                {form.imageUrl && (
                  <div className="flex items-center gap-3">
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => setForm({ ...form, imageUrl: '' })}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>

              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editId ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
