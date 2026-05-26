import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/admin/categories', icon: Tag, label: 'Danh mục' },
  { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
  { path: '/admin/users', icon: Users, label: 'Người dùng' },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { fullName, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <span className="font-bold text-lg">⚡ TechShop</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition
                                    ${isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-gray-700 p-4">
          {sidebarOpen && (
            <p className="text-sm text-gray-400 mb-2 truncate">{fullName}</p>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 text-red-400 hover:bg-gray-700 rounded transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-700">
            {menuItems.find((m) => m.path === location.pathname)?.label ||
              'Dashboard'}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
