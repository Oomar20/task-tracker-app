import { create } from 'zustand';

interface AuthState {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token:
        typeof window !== 'undefined'
            ? localStorage.getItem('auth_token')
            : null,

    setToken: (token) => {
        if (typeof window !== 'undefined') {
            if (token) localStorage.setItem('auth_token', token);
            else localStorage.removeItem('auth_token');
        }
        set({ token });
    },
}));
