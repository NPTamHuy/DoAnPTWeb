import api from './axiosConfig';

export const getProductStats = async (productId) => {
  try {
    const res = await api.get(`/reviews/product/${productId}/stats`);
    return res.data;
  } catch {
    return { average: 0, count: 0 };
  }
};
