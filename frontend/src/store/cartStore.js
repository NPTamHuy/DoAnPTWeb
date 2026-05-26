import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart') || '[]'),

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((i) => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = items.map((i) =>
        i.id === product.id
          ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
          : i,
      );
    } else {
      newItems = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          category: product.category,
          quantity,
        },
      ];
    }
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems });
  },

  removeItem: (id) => {
    const newItems = get().items.filter((i) => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    const newItems = get().items.map((i) =>
      i.id === id ? { ...i, quantity } : i,
    );
    localStorage.setItem('cart', JSON.stringify(newItems));
    set({ items: newItems });
  },

  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  getTotalPrice: () =>
    get().items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
}));

export default useCartStore;
