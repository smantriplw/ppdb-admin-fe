import { useThemeSwitcher } from '@/contexts/themeContext';
import React from 'react';

export const Container = ({ children }:{ children: React.ReactNode }) => {
    const themer = useThemeSwitcher();
    return (
        <div className={`mt-10 md:mx-auto ${themer.theme === 'dracula' ? 'bg-[#091426]' : 'bg-[#F6F6F6]'} shadow-md rounded-md md:w-1/2 md:h-1/2 p-5 flex flex-col items-center`}>
            {children}
        </div>
    )
}
