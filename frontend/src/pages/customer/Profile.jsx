import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import api from '../../api/axiosConfig';
import useAuthStore from '../../store/authStore';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Package,
  Zap,
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { token, fullName, email, login, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: fullName || '',
    phone: '',
    address: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    // Fetch profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await api.get('/orders/my', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error(err);
        }
        setLoadingOrders(false);
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await api.put('/users/me', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      login({
        ...JSON.parse(localStorage.getItem('auth') || '{}'),
        fullName: form.fullName,
      });
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError('Cập nhật thất bại!');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(
        '/users/me/password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
    }
    setLoading(false);
  };

  const STATUS_CONFIG = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
    SHIPPING: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
    DELIVERED: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
  };

  const tabs = [
    { key: 'info', label: 'Thông tin cá nhân', icon: User },
    { key: 'password', label: 'Đổi mật khẩu', icon: Lock },
    { key: 'orders', label: 'Đơn hàng', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {fullName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold">{fullName}</h1>
              <p className="text-blue-200 text-sm">{email}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setSuccess('');
                      setError('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition border-l-2
                                            ${
                                              activeTab === tab.key
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-transparent text-gray-600 hover:bg-gray-50'
                                            }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition border-l-2 border-transparent"
                >
                  <Zap size={18} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Alert */}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm">
                <CheckCircle size={16} /> {success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Tab: Thông tin */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Thông tin cá nhân
                </h2>
                <form onSubmit={handleUpdateInfo} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Họ tên
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Email không thể thay đổi
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="0901 234 567"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-3.5 text-gray-400"
                      />
                      <textarea
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="Số nhà, tên đường, phường/xã..."
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Đổi mật khẩu */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Đổi mật khẩu
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-5">
                  {[
                    {
                      key: 'current',
                      label: 'Mật khẩu hiện tại',
                      field: 'currentPassword',
                    },
                    { key: 'new', label: 'Mật khẩu mới', field: 'newPassword' },
                    {
                      key: 'confirm',
                      label: 'Xác nhận mật khẩu mới',
                      field: 'confirmPassword',
                    },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {item.label}
                      </label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type={showPass[item.key] ? 'text' : 'password'}
                          value={passwordForm[item.field]}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              [item.field]: e.target.value,
                            })
                          }
                          placeholder="••••••"
                          required
                          className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPass((p) => ({
                              ...p,
                              [item.key]: !p[item.key],
                            }))
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPass[item.key] ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Đổi mật khẩu
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Đơn hàng */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Đơn hàng gần đây
                  </h2>
                  <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xem tất cả <ChevronRight size={16} />
                  </button>
                </div>

                {loadingOrders ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                    Đang tải...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition text-sm"
                    >
                      Mua sắm ngay
                    </button>
                  </div>
                ) : (
                  orders.slice(0, 5).map((order) => {
                    const status =
                      STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
                        onClick={() => navigate('/orders')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">
                              Đơn #{order.id}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString(
                                'vi-VN',
                              )}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {order.orderItems
                              ?.map((i) => i.product?.name)
                              .join(', ')}
                          </p>
                          <p className="text-sm font-bold text-blue-600 flex-shrink-0 ml-4">
                            {Number(order.totalAmount).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
