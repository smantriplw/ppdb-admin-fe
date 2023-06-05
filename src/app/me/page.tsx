'use client';
import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext'
// import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher';

type StatsJson = {
    archives: {
        all: number;
        complete: number;
        specified: Record<string, number>;
        daily: {
            todayCount: number;
            lastWeek: number;
        };
    };
}

export default function MePage() {
    const session = useSessionStore();
    const { data, isLoading } = useSWR<StatsJson>(session.token ? '/api/stats' : null, url => fetcher(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`,
        }
    }));

    return (
        <main>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row">
                    {/* <Image height={300} width={250} alt={'Logo SMAN3'} src="https://ppdb.sman3palu.sch.id/logo.png" className="max-w-sm rounded-lg" /> */}
                    <div>
                        <h1 className="text-5xl font-bold">Halo, <span className="uppercase">{session.username}</span></h1>
                        <p className="py-6">
                            Selamat datang verifikator di website PPDB Admin SMAN 3 Palu Tahun 2023/2024, harap memverifikasi data dengan jujur dan benar ya. Selamat memverifikasi, dan terimakasih!
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <Link className="btn btn-primary" href={'/verifikasi'}>verifikasi</Link>
                            <Link className="btn btn-secondary" href={'/users'}>users management</Link>
                        </div>
                    </div>
                    {!isLoading && data?.archives && !('errors' in data) && (
                        <div className="grid lg:grid-cols-1 grid-cols-2 gap-4">
                            <div className="stats stats-vertical lg:stats-horizontal">
                                <div className="stat">
                                    <h1 className="stat-title">
                                        Total Pendaftar
                                    </h1>
                                    <p className="stat-value">
                                        {data?.archives.all.toString() || '0'}
                                    </p>
                                </div>

                                <div className="stat">
                                    <h1 className="stat-title">
                                        Berkas Lengkap ({Math.floor(
                                            ((data?.archives.complete || 0) / (data?.archives.all || 0)) * 100
                                        )}%)
                                    </h1>
                                    <p className="stat-value">
                                        {data?.archives.complete.toString() || '0'}
                                    </p>
                                </div>

                                <div className="stat">
                                    <h1 className="stat-title">
                                        Berkas Belum Lengkap ({Math.floor(
                                            ((data ? (data?.archives.all - data?.archives.complete) : 0) / (data?.archives.all || 0)) * 100
                                        )}%)
                                    </h1>
                                    <p className="stat-value">
                                        {data ? (data.archives.all - data.archives.complete).toString() : '0'}
                                    </p>
                                </div>
                            </div>
                            <div className="stats stats-vertical lg:stats-horizontal">
                                <div className="stat">
                                    <h1 className="stat-title">
                                        Pendaftar Hari Ini
                                    </h1>
                                    <p className="stat-value">
                                        {data?.archives.daily.todayCount.toString() || '0'}
                                    </p>
                                </div>

                                <div className="stat">
                                    <h1 className="stat-title">
                                        Pendaftar Minggu Ini
                                    </h1>
                                    <p className="stat-value">
                                        {data?.archives.daily.lastWeek.toString() || '0'}
                                    </p>
                                </div>
                            </div>
                            <div className="stats stats-vertical lg:stats-horizontal">
                                {Object.entries(data?.archives.specified || {}).map(x => (
                                <div className={`stat${x[0] !== 'zonasi' ? ' hidden lg:block' : ''}`} key={x[0]}>
                                    <h1 className="stat-title">
                                        {x[0][0].toUpperCase() + x[0].slice(1)} ({Math.floor((x[1] / data?.archives.all!) * 100)}%)
                                    </h1>
                                    <p className="stat-value">
                                        {x[1].toString() || '0'}
                                    </p>
                                    </div> 
                                ))}
                            </div>
                            {Object.entries(data?.archives.specified || {}).slice(1).map(x => (
                            <div key={x[0]} className="stats stats-vertical lg:stats-horizontal lg:hidden">
                                <div className="stat">
                                    <h1 className="stat-title">
                                    {x[0][0].toUpperCase() + x[0].slice(1)} ({Math.floor((x[1] / data?.archives.all!) * 100)}%)
                                    </h1>
                                    <p className="stat-value">
                                        {x[1].toString() || '0'}
                                    </p>
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
