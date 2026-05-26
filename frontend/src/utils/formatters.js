export const formatPrice = (price) =>
  Number(price).toLocaleString('vi-VN') + '₫';

export const formatDate = (date, options = {}) => {
  const defaultOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(date).toLocaleDateString('vi-VN', {
    ...defaultOptions,
    ...options,
  });
};

export const formatDateTime = (date) =>
  new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
