'use client';
import React from 'react';

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
}

export const SessionContext = React.createContext<UserSession | undefined>(undefined);