'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
    role: string | null;
    username: string | null;
    setRole: (role: string | null) => void;
    setUsername: (username: string | null) => void;
    reset: () => void;
};

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            role: null,
            username: null,
            setRole: (role) => set({ role }),
            setUsername: (username) => set({ username }),
            reset: () => set({ role: null, username: null }),
        }),
        {
            name: "pjt-user-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUserStore;
