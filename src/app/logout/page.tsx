'use client';
import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function Logout() {
  const token = Cookies.get('ppdb_admin');
  const router = useRouter();

  React.useEffect(() => {
    if (token) {
      Cookies.remove('ppdb_admin');
    }

    router.push('/');
  }, [token, router]);

  return (
    <main>
      <h3 className="text-2xl text-center">
        Please wait..
      </h3>
    </main>
  )
}
