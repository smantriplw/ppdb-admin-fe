import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeState = {
    theme: 'lofi' | 'dracula';
    toggle: () => void;
}
export const useThemeSwitcher = create(persist<ThemeState>(
    (set, get) => ({
        theme: 'dracula',
        toggle: () => set({ ...get(), theme: get().theme === 'dracula' ? 'lofi' : 'dracula' }),
    }),  {
        name: 'theme',
        storage: createJSONStorage(() => localStorage)
    }
));
