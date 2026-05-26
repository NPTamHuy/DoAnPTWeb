import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import useAuthStore from '../../store/authStore';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      if (res.data.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError('Email hoặc mật khẩu không đúng');
    }
    setLoading(false);
  };

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
            Chào mừng trở lại!
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Đăng nhập để khám phá hàng nghìn sản phẩm công nghệ chính hãng với
            giá tốt nhất.
          </p>
          <div className="space-y-4">
            {[
              '🚀 Giao hàng nhanh trong 24h',
              '🛡️ Bảo hành chính hãng 12 tháng',
              '💰 Giá tốt nhất thị trường',
              '🔄 Đổi trả miễn phí 30 ngày',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100">
                <div className="w-1.5 h-1.5 bg-blue-300 rounded-full flex-shrink-0" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-500">Nhập thông tin tài khoản của bạn</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
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
