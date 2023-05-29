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
}

export type UserAction = {
    updateState: (state: UserSession) => void;
    setToken: (token: string) => void;
    loadUserInfo: () => void;
}

export const useSessionStore = create<UserSession & UserAction>((set, state) => ({
    email: '',
    id: 0,
    status: UserStatus.NonActive,
    username: '',
    updateState: (state) => set(() => state),
    setToken: (token) => set((st) => ({ ...st, token })),
    loadUserInfo: () => {
        const st = state();
        fetch('https://ppdb.api.sman3palu.sch.id/api/auth', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${st.token}`,
            },
        }).then(r => r.json()).then(res => {
            set((st) => ({ ...st, ...res.data }));
        });
    },
}));
