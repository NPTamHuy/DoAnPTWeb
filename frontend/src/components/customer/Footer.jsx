import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Footer({ categories = [] }) {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg">TechShop</span>
            </div>
            <p className="text-gray-400 text-sm">
              Cửa hàng điện tử chính hãng, uy tín hàng đầu Việt Nam.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Sản phẩm</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigate(`/products?category=${c.id}`)}
                    className="hover:text-white transition"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Chính sách bảo hành</li>
              <li>Chính sách đổi trả</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Liên hệ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📞 1800 1234</li>
              <li>📧 support@techshop.vn</li>
              <li>📍 TP. Hồ Chí Minh</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 TechShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
