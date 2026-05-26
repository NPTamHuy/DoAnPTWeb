import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  email: localStorage.getItem('email') || null,
  fullName: localStorage.getItem('fullName') || null,

  login: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('email', data.email);
    localStorage.setItem('fullName', data.fullName);
    set({
      token: data.token,
      role: data.role,
      email: data.email,
      fullName: data.fullName,
    });
  },

  logout: () => {
    localStorage.clear();
    set({ token: null, role: null, email: null, fullName: null });
  },
}));

export default useAuthStore;
