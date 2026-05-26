import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Package, Tag, ShoppingCart, Users } from 'lucide-react';
import api from '../../api/axiosConfig';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>

    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        const [productsRes, categoriesRes, ordersRes, usersRes] =
          await Promise.all([
            api.get('/products', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            api.get('/categories', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            api.get('/orders', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            api.get('/users', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const productList = Array.isArray(productsRes.data)
          ? productsRes.data
          : [];

        const categoryList = Array.isArray(categoriesRes.data)
          ? categoriesRes.data
          : [];

        const orderList = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        const userList = Array.isArray(usersRes.data) ? usersRes.data : [];

        setStats({
          products: productList.length,
          categories: categoryList.length,
          orders: orderList.length,
          users: userList.length,
        });
      } catch (err) {
        console.error('Lỗi khi lấy thống kê dashboard:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          label="Sản phẩm"
          value={stats.products}
          color="bg-blue-500"
        />

        <StatCard
          icon={Tag}
          label="Danh mục"
          value={stats.categories}
          color="bg-green-500"
        />

        <StatCard
          icon={ShoppingCart}
          label="Đơn hàng"
          value={stats.orders}
          color="bg-yellow-500"
        />

        <StatCard
          icon={Users}
          label="Người dùng"
          value={stats.users}
          color="bg-purple-500"
        />
      </div>

      {/* Welcome */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Chào mừng trở lại! 👋</h2>

        <p className="text-gray-500">
          Sử dụng sidebar để quản lý cửa hàng của bạn.
        </p>
      </div>
    </AdminLayout>
  );
}
