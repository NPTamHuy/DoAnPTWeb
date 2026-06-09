import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import useAuthStore from '../../store/authStore';
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  Package,
  Bot,
  User,
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Xin chào! Mình là trợ lý tư vấn của TechShop 🛒\nBạn cần tìm sản phẩm gì? Hãy mô tả nhu cầu của bạn nhé!',
      products: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const parseMessage = (content) => {
    return content.replace(/\[ID:\d+\]/g, '').trim();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!token) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Bạn cần đăng nhập để sử dụng tính năng tư vấn nhé! 😊',
          products: [],
          isLogin: true,
        },
      ]);
      return;
    }

    const userMsg = { role: 'user', content: input, products: [] };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post(
        '/chat',
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: parseMessage(res.data.message),
          products: res.data.products || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, mình đang gặp sự cố. Bạn thử lại sau nhé!',
          products: [],
        },
      ]);
    }
    setLoading(false);
  };

  const handleClear = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.delete('/chat/session', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {}
    setMessages([
      {
        role: 'assistant',
        content: 'Đã xóa lịch sử chat! Mình có thể giúp gì cho bạn? 😊',
        products: [],
      },
    ]);
  };

  return (
    <>
      {/* Nút chat nổi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-140 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">TechShop AI</p>
                <p className="text-blue-200 text-xs">
                  Tư vấn sản phẩm thông minh
                </p>
              </div>
            </div>
            {token && (
              <button
                onClick={handleClear}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Xóa lịch sử"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1
                                    ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  {msg.role === 'user' ? (
                    <User size={14} className="text-white" />
                  ) : (
                    <Bot size={14} className="text-gray-600" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}
                >
                  {/* Bubble */}
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                                        ${
                                          msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-sm'
                                            : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'
                                        }`}
                  >
                    {msg.content}
                    {msg.isLogin && (
                      <button
                        onClick={() => navigate('/login')}
                        className="block mt-2 text-blue-600 bg-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-50 transition"
                      >
                        Đăng nhập ngay
                      </button>
                    )}
                  </div>

                  {/* Product cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 w-full">
                      {msg.products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            navigate(`/product/${p.id}`);
                            setIsOpen(false);
                          }}
                          className="bg-white border border-gray-100 rounded-xl p-2.5 flex gap-2.5 cursor-pointer hover:shadow-md hover:border-blue-200 transition"
                        >
                          <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} className="text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
                              {p.name}
                            </p>
                            <p className="text-blue-600 font-bold text-xs mt-1">
                              {formatPrice(p.price)}
                            </p>
                            <p
                              className={`text-xs mt-0.5 ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}
                            >
                              {p.stock > 0 ? `Còn ${p.stock} sp` : 'Hết hàng'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-gray-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý nhanh */}
          {messages.length === 1 && (
            <div className="px-3 py-2 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400 mb-1.5">Gợi ý:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Laptop dưới 20 triệu',
                  'Điện thoại chụp ảnh đẹp',
                  'iPad cho học sinh',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full hover:bg-blue-100 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn..."
                rows={1}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-24"
                style={{ height: 'auto' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">
              Enter để gửi • Shift+Enter xuống dòng
            </p>
          </div>
        </div>
      )}
    </>
  );
}
