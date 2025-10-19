'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserState = {
    id: string | null;
    role: string | null;
    username: string | null;
    name: string | null;
    setID: (id: string | null) => void;
    setRole: (role: string | null) => void;
    setUsername: (username: string | null) => void;
    setName: (name: string | null) => void;
    reset: () => void;
    
};

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            id: null,
            role: null,
            username: null,
            name: null,
            setID: (id) => set({ id }),
            setRole: (role) => set({ role }),
            setUsername: (username) => set({ username }),
            setName: (name) => set({ name }),
            reset: () => set({ role: null, username: null, name: null }),
        }),
        {
            name: "pjt-user-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUserStore;
