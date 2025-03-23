import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string | null) => void;
  setUser: (user: any | null) => void;
  logout: () => void;
  signout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Ensure userId is removed
    set({ token: null, user: null });
  },
  signout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    set({ token: null });
  },
}));