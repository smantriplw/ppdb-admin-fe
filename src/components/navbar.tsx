'use client';
import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext';
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useThemeSwitcher } from '@/contexts/themeContext';

export const Navbar = () => {
    const router = useRouter();
    const path = usePathname();
    const session = useSessionStore();
    const theme = useThemeSwitcher();
    const tokenAdmin = Cookies.get('ppdb_admin');

    if (typeof document !== 'undefined')
        document.documentElement.setAttribute('data-theme', theme.theme);

    React.useEffect(() => {
        if (tokenAdmin) {
            if (!session.token) session.setToken(tokenAdmin);
            if (!session.username.length) session.loadUserInfo(() => {
                session.reset();
                Cookies.remove('ppdb_admin');
            });
        } else if (!tokenAdmin && path !== '/') {
            router.push('/');
        }
    }, [tokenAdmin, session, router, path]);
    return (
        <>
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><Link href={'/me'}>Homepage</Link></li>
                    {!session.token ? (
                    <>
                        <li><Link href='/login'>Login</Link></li>
                    </>
                    ) : (
                        <>
                            <li><Link href='/verifikasi'>Halaman Verifikasi</Link></li>
                            {session.status === 2 && (
                                <>
                                    <li>
                                        <Link href={'/users'}>Manage users</Link>
                                    </li>
                                </>
                            )}
                            <li><Link href='/logout'>Logout</Link></li>
                        </>
                    )}
                </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost normal-case text-xl">
                    Admin PPDB
                </a>
            </div>
            <div className="navbar-end">
                <input type="checkbox" className="toggle" checked={theme.theme === 'dracula'} onChange={() => {
                    theme.toggle();
                    document.documentElement.setAttribute('data-theme', theme.theme);
                }} />
            </div>
        </div>
        </>
    )
}
