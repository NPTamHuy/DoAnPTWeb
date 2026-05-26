import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/customer/Navbar';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import api from '../../api/axiosConfig';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  User,
  ChevronRight,
  Check,
} from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();
  const { token, fullName } = useAuthStore();
  const [step, setStep] = useState(1); // 1: cart, 2: checkout, 3: success
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: fullName || '',
    phone: '',
    address: '',
    note: '',
  });

  const total = getTotalPrice();
  const shipping = total >= 500000 ? 0 : 30000;
  const finalTotal = total + shipping;

  const handleOrder = async () => {
    if (!form.fullName || !form.phone || !form.address) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/orders',
        {
          shippingAddress: form.address,
          phone: form.phone,
          note: form.note,
          totalAmount: finalTotal,
          orderItems: items.map((i) => ({
            product: { id: i.id },
            quantity: i.quantity,
            price: i.price,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      clearCart();
      setStep(3);
    } catch (err) {
      alert('Đặt hàng thất bại, vui lòng thử lại!');
    }
    setLoading(false);
  };

  // Step 3 - Success
  if (step === 3)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-500 mb-8">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm nhất.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Progress */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[
              { n: 1, label: 'Giỏ hàng' },
              { n: 2, label: 'Thanh toán' },
              { n: 3, label: 'Hoàn tất' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition
                                        ${step >= s.n ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {step > s.n ? <Check size={16} /> : s.n}
                  </div>
                  <span
                    className={`text-sm font-medium ${step >= s.n ? 'text-blue-600' : 'text-gray-400'}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && <ChevronRight size={16} className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {items.length === 0 && step === 1 ? (
          <div className="text-center py-24">
            <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-500 mb-8">
              Hãy thêm sản phẩm vào giỏ hàng của bạn
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left */}
            <div className="lg:col-span-2 space-y-4">
              {step === 1 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">
                      Giỏ hàng ({items.length} sản phẩm)
                    </h1>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4"
                    >
                      <div
                        className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <Package size={32} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-600 font-medium mb-0.5">
                          {item.category?.name}
                        </p>
                        <h3
                          className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-blue-600 font-bold">
                          {Number(item.price).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between shrink-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2.5 py-1.5 hover:bg-gray-50 transition text-gray-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-200 min-w-10 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            className="px-2.5 py-1.5 hover:bg-gray-50 transition text-gray-600 disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {(Number(item.price) * item.quantity).toLocaleString(
                            'vi-VN',
                          )}
                          ₫
                        </p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ArrowLeft size={16} /> Tiếp tục mua sắm
                  </button>
                </>
              ) : (
                // Step 2 - Checkout form
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">
                    Thông tin giao hàng
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        <User size={14} className="inline mr-1" />
                        Họ tên người nhận *
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        placeholder="Nguyễn Văn A"
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        <Phone size={14} className="inline mr-1" />
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="0901 234 567"
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        <MapPin size={14} className="inline mr-1" />
                        Địa chỉ giao hàng *
                      </label>
                      <textarea
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        rows={3}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Ghi chú
                      </label>
                      <textarea
                        value={form.note}
                        onChange={(e) =>
                          setForm({ ...form, note: e.target.value })
                        }
                        placeholder="Giao hàng giờ hành chính, gọi trước khi giao..."
                        rows={2}
                        className="w-full border border-gray-200 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Phương thức thanh toán
                    </h3>
                    <div className="border-2 border-blue-600 bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Thanh toán khi nhận hàng (COD)
                        </p>
                        <p className="text-xs text-gray-500">
                          Kiểm tra hàng trước khi thanh toán
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Order summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Tóm tắt đơn hàng
                </h2>

                {/* Items summary */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package
                            size={20}
                            className="text-gray-300 m-auto mt-2.5"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 shrink-0">
                        {(Number(item.price) * item.quantity).toLocaleString(
                          'vi-VN',
                        )}
                        ₫
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium">
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span
                      className={
                        shipping === 0
                          ? 'text-green-600 font-medium'
                          : 'font-medium'
                      }
                    >
                      {shipping === 0
                        ? 'Miễn phí'
                        : `${shipping.toLocaleString('vi-VN')}₫`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      🎉 Miễn phí ship đơn trên 500K
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Tổng cộng</span>
                    <span className="font-bold text-blue-600 text-lg">
                      {finalTotal.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <button
                  onClick={() => {
                    if (!token) {
                      navigate('/login');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  Tiến hành đặt hàng <ChevronRight size={18} />
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Quay lại giỏ hàng
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
