'use client';
import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext'
import Image from 'next/image'

export default function MePage() {
    const session = useSessionStore();
    return (
        <main>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row">
                    <Image height={300} width={250} alt={'Logo SMAN3'} src="https://ppdb.sman3palu.sch.id/logo.png" className="max-w-sm rounded-lg" />
                    <div>
                        <h1 className="text-5xl font-bold">Halo, <span className="uppercase">{session.username}</span></h1>
                        <p className="py-6">
                            Selamat datang verifikator di website PPDB Admin SMAN 3 Palu Tahun 2023/2024, harap memverifikasi data dengan jujur dan benar ya. Selamat memverifikasi, dan terimakasih!
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="btn btn-primary">verifikasi</button>
                            <button className="btn btn-secondary">status</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
