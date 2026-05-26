import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import {
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Zap,
  Package,
  LogOut,
  Settings,
} from 'lucide-react';
import api from '../../api/axiosConfig';

export default function Navbar({ onSearch, hideCategory = false }) {
  const [searchVal, setSearchVal] = useState('');
  const [categories, setCategories] = useState([]);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { token, fullName, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []));
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setShowCatMenu(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <nav className="bg-blue-600 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-blue-600" />
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">
              TechShop
            </span>
          </div>

          {/* Danh mục dropdown */}
          {!hideCategory && (
            <div ref={catRef} className="relative shrink-0">
              <button
                onClick={() => setShowCatMenu(!showCatMenu)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                <Package size={16} />
                <span>Danh mục</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showCatMenu ? 'rotate-180' : ''}`}
                />
              </button>
              {showCatMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <button
                    onClick={() => {
                      navigate('/products');
                      setShowCatMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                  >
                    <Package size={16} />
                    Tất cả sản phẩm
                  </button>
                  <hr className="my-1" />
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigate(`/products?category=${c.id}`);
                        setShowCatMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Bạn muốn mua gì hôm nay?"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  onSearch?.(e.target.value);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-white hover:bg-blue-700 px-3 py-2 rounded-xl transition shrink-0 relative"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              Giỏ hàng
            </span>
          </button>

          {/* User */}
          {token ? (
            <div ref={userRef} className="relative shrink-0">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-xl transition"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">
                    {fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium max-w-20 truncate">
                  {fullName}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {role === 'ADMIN' && (
                    <>
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2 font-medium"
                      >
                        <Settings size={15} /> Quản trị
                      </button>
                      <hr className="my-1" />
                    </>
                  )}
                  <button
                    onClick={() => {
                      navigate('/orders');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Đơn hàng của tôi
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User size={15} /> Tài khoản
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={15} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition shrink-0"
            >
              <User size={16} />
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
