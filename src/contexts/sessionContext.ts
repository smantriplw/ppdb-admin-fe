'use client';
import { create } from 'zustand';

export enum UserStatus  {
    FullAdmin = 2,
    Admin     = 1,
    NonActive = 0
}

export type UserSession = {
    id: number;
    username: string;
    email: string;
    status: UserStatus;
    token?: string;
    failed: boolean;
}

export type UserAction = {
    updateState: (state: UserSession) => void;
    setToken: (token: string) => void;
    loadUserInfo: (cb?: () => void) => void;
    reset: () => void;
}

export const useSessionStore = create<UserSession & UserAction>((set, state) => ({
    email: '',
    id: 0,
    status: UserStatus.NonActive,
    username: '',
    failed: false,
    updateState: (state) => set(() => state),
    setToken: (token) => set((st) => ({ ...st, token })),
    loadUserInfo: (onFail) => {
        const st = state();
        if (!st.failed) fetch('/api/auth/profile', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${st.token}`,
            },
        }).then(r => {
            if (r.status !== 200) {
                if (onFail) onFail();

                set((st) => ({ ...st, failed: true }));
                return r.text();
            }

            return r.json();
        }).then(res => {
            if (typeof res === 'string') return;

            set((st) => ({ ...st, ...res.data, failed: false, }));
        }).catch(() => {
            if (onFail) onFail();
            set((st) => ({ ...st, failed: true }))
        });
    },
    reset: () => set(() => ({
        email: '',
        id: 0,
        status: UserStatus.NonActive,
        username: '',
        token: undefined,
        failed: false,
    })),
}));
