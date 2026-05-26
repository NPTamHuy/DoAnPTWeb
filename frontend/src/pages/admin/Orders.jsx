import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package,
  Search,
  ChevronDown,
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

const STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'SHIPPING',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      alert('Cập nhật thất bại!');
    }
    setUpdatingId(null);
  };

  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: orders.length },
    ...STATUS_OPTIONS.map((s) => ({
      key: s,
      label: STATUS_CONFIG[s].label,
      count: orders.filter((o) => o.status === s).length,
    })),
  ];

  const filtered = orders.filter((o) => {
    const matchTab = activeTab === 'ALL' || o.status === activeTab;
    const matchSearch =
      search === '' ||
      String(o.id).includes(search) ||
      o.shippingAddress?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {STATUS_OPTIONS.map((s) => {
          const config = STATUS_CONFIG[s];
          const Icon = config.icon;
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setActiveTab(s)}
              className={`bg-white rounded-xl border p-4 text-left hover:shadow-md transition
                                ${activeTab === s ? 'border-blue-500 shadow-md' : 'border-gray-100'}`}
            >
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full mb-2 ${config.color}`}
              >
                <Icon size={12} />
                {config.label}
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition
                                    ${
                                      activeTab === tab.key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full
                                    ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white text-gray-500'}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative flex-shrink-0">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Đơn hàng
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Sản phẩm
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Khách hàng
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Địa chỉ
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tổng tiền
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Cập nhật
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => {
                  const status =
                    STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          #{order.id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                'vi-VN',
                              )
                            : '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {order.orderItems?.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              {item.product?.imageUrl && (
                                <img
                                  src={item.product.imageUrl}
                                  alt=""
                                  className="w-8 h-8 object-cover rounded-lg flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate max-w-40">
                                  {item.product?.name || 'Sản phẩm'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  x{item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.orderItems?.length > 2 && (
                            <p className="text-xs text-gray-400">
                              +{order.orderItems.length - 2} sản phẩm khác
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.user?.fullName || '—'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.user?.email || ''}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-600 max-w-36 line-clamp-2">
                          {order.shippingAddress}
                        </p>
                        {order.phone && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {order.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-blue-600">
                          {Number(order.totalAmount).toLocaleString('vi-VN')}₫
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full ${status.color}`}
                        >
                          <StatusIcon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            disabled={
                              updatingId === order.id ||
                              order.status === 'DELIVERED' ||
                              order.status === 'CANCELLED'
                            }
                            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_CONFIG[s].label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                        {updatingId === order.id && (
                          <p className="text-xs text-blue-500 mt-1">
                            Đang cập nhật...
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
