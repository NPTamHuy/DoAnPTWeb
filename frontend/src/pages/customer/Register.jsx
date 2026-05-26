import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import {
  Zap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
    setLoading(false);
  };

  const passwordStrength = () => {
    if (form.password.length === 0) return null;
    if (form.password.length < 6)
      return { label: 'Yếu', color: 'bg-red-500', width: 'w-1/3' };
    if (form.password.length < 10)
      return { label: 'Trung bình', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: 'Mạnh', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12 text-white">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Zap size={22} className="text-blue-600" />
          </div>
          <span className="font-bold text-2xl">TechShop</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Tham gia cùng
            <br />
            <span className="text-blue-200">TechShop</span> ngay!
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Tạo tài khoản miễn phí và bắt đầu mua sắm công nghệ với giá tốt
            nhất.
          </p>
          <div className="space-y-3">
            {[
              'Đăng ký miễn phí, không mất phí',
              'Theo dõi đơn hàng dễ dàng',
              'Nhận thông báo khuyến mãi sớm nhất',
              'Tích điểm và nhận ưu đãi đặc biệt',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100">
                <CheckCircle
                  size={16}
                  className="text-blue-300 flex-shrink-0"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300 text-sm">
          © 2026 TechShop. All rights reserved.
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div
            className="flex items-center gap-2 mb-8 lg:hidden cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">TechShop</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản
            </h2>
            <p className="text-gray-500">Điền thông tin để đăng ký miễn phí</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Họ tên *
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
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email *
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Mật khẩu *
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Độ mạnh mật khẩu</span>
                    <span
                      className={`font-medium ${
                        strength.label === 'Yếu'
                          ? 'text-red-500'
                          : strength.label === 'Trung bình'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                      }`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`}
                    />
                  </div>
                </div>
              )}
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
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0901 234 567"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ← Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
