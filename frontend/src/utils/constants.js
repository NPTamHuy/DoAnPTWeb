import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

export const STATUS_CONFIG = {
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

export const STATUS_OPTIONS = [
  'PENDING',
  'CONFIRMED',
  'SHIPPING',
  'DELIVERED',
  'CANCELLED',
];

export const DEFAULT_SPECS = [
  'Chip AI',
  'Loại card đồ họa',
  'Dung lượng RAM',
  'Loại RAM',
  'Số khe RAM',
  'Ổ cứng',
  'Kích thước màn hình',
  'Công nghệ màn hình',
  'Pin',
  'Hệ điều hành',
  'Độ phân giải màn hình',
  'Loại CPU',
  'Cổng giao tiếp',
];
