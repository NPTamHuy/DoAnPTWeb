import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import api from '../../api/axiosConfig';
import useAuthStore from '../../store/authStore';
import {
  Package,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
} from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ xác nhận',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    color: 'bg-blue-100 text-blue-700',
    icon: CheckCircle,
  },
  SHIPPING: {
    label: 'Đang giao',
    color: 'bg-purple-100 text-purple-700',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Đã giao',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
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
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  const tabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PENDING', label: 'Chờ xác nhận' },
    { key: 'CONFIRMED', label: 'Đã xác nhận' },
    { key: 'SHIPPING', label: 'Đang giao' },
    { key: 'DELIVERED', label: 'Đã giao' },
    { key: 'CANCELLED', label: 'Đã hủy' },
  ];

  const filtered =
    activeTab === 'ALL' ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Trang chủ
          </button>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Đơn hàng của tôi</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Đơn hàng của tôi
        </h1>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-6 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition
                                    ${
                                      activeTab === tab.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
              >
                {tab.label}
                {tab.key !== 'ALL' && (
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                                        ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {orders.filter((o) => o.status === tab.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-100 rounded w-1/4 mb-4" />
                <div className="h-16 bg-gray-100 rounded mb-4" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
            <ShoppingBag size={56} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium mb-2">
              Chưa có đơn hàng nào
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Hãy mua sắm và đặt hàng ngay!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const status =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = status.icon;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        Đơn #{order.id}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${status.color}`}
                    >
                      <StatusIcon size={13} />
                      {status.label}
                    </span>
                  </div>

                  {/* Order items */}
                  <div className="px-6 py-4">
                    {order.orderItems?.map((item, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-4 ${i > 0 ? 'mt-4 pt-4 border-t border-gray-50' : ''}`}
                      >
                        <div
                          className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                          onClick={() =>
                            navigate(`/product/${item.product?.id}`)
                          }
                        >
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              navigate(`/product/${item.product?.id}`)
                            }
                          >
                            {item.product?.name || 'Sản phẩm'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 shrink-0">
                          {(Number(item.price) * item.quantity).toLocaleString(
                            'vi-VN',
                          )}
                          ₫
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        Giao đến:{' '}
                      </span>
                      {order.shippingAddress}
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Nút hủy — chỉ hiện khi PENDING */}
                      {order.status === 'PENDING' && (
                        <button
                          onClick={async () => {
                            if (!confirm('Bạn có chắc muốn hủy đơn hàng này?'))
                              return;
                            try {
                              const token = localStorage.getItem('token');
                              await api.put(
                                `/orders/${order.id}/status`,
                                { status: 'CANCELLED' },
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                },
                              );
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o.id === order.id
                                    ? { ...o, status: 'CANCELLED' }
                                    : o,
                                ),
                              );
                            } catch (err) {
                              alert('Hủy đơn thất bại!');
                            }
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition"
                        >
                          <XCircle size={15} />
                          Hủy đơn hàng
                        </button>
                      )}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-400 mb-0.5">
                          Tổng tiền
                        </p>
                        <p className="text-blue-600 font-bold">
                          {Number(order.totalAmount).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          © 2026 TechShop. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
