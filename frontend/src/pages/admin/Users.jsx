import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axiosConfig';
import { Search, Users, Shield, User, Ban, CheckCircle } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchTab = activeTab === 'ALL' || u.role === activeTab;
    const matchSearch =
      search === '' ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: users.length },
    {
      key: 'CUSTOMER',
      label: 'Khách hàng',
      count: users.filter((u) => u.role === 'CUSTOMER').length,
    },
    {
      key: 'ADMIN',
      label: 'Admin',
      count: users.filter((u) => u.role === 'ADMIN').length,
    },
  ];

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <User size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Khách hàng</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter((u) => u.role === 'CUSTOMER').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
            <Shield size={22} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Quản trị viên</p>
            <p className="text-2xl font-bold text-gray-900">
              {users.filter((u) => u.role === 'ADMIN').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition
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
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm người dùng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-gray-400">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Người dùng
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Số điện thoại
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Vai trò
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0
                                                ${user.role === 'ADMIN' ? 'bg-purple-500' : 'bg-blue-500'}`}
                      >
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.fullName || '—'}
                        </p>
                        <p className="text-xs text-gray-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">{user.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-600">{user.phone || '—'}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full
                                            ${
                                              user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}
                    >
                      {user.role === 'ADMIN' ? (
                        <Shield size={12} />
                      ) : (
                        <User size={12} />
                      )}
                      {user.role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full
                                            ${
                                              user.active !== false
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                    >
                      {user.active !== false ? (
                        <>
                          <CheckCircle size={12} /> Hoạt động
                        </>
                      ) : (
                        <>
                          <Ban size={12} /> Bị khóa
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
