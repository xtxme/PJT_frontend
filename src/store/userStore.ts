import { create } from "zustand";

type UserState = {
    role: string | null;
    setRole: (role: string | null) => void;
    reset: () => void;
};

const useUserStore = create<UserState>((set) => ({
    role: null,
    setRole: (role) => set({ role }),
    reset: () => set({ role: null }),
}));

export default useUserStore;
