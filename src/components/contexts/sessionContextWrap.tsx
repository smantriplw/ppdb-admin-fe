'use client';

import { SessionContext } from "@/contexts/sessionContext";

export const SessionContextWrap = ({ children }: React.PropsWithChildren) => {
    return (
        <SessionContext.Provider value={undefined}>
            {children}
        </SessionContext.Provider>
    )
}