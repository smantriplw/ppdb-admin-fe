import React from 'react';

export const Container = ({ children, isCenter = true }:{ children: React.ReactNode, isCenter?: boolean; }) => {
    return (
        <div className={`md:mx-auto bg-[#091426] shadow-md rounded-md md:w-1/2 md:h-1/2 p-5 flex flex-col items-center`}>
            {children}
        </div>
    )
}