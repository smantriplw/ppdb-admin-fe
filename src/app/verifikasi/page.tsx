'use client';

import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr'
import Fuse from 'fuse.js'

export default function VerifikasiPage() {
    const session = useSessionStore();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [query, setQuery] = React.useState<string>();
    const [selectedData, setSelectedData] = React.useState<any[]>([]);
    const [sortBy, setSortBy] = React.useState<string>('verificator_id:== \'null\'');
    const { data, isLoading, mutate } = useSWR(session.token ? `/api/archives?offset=200&page=${currentPage}` : null, url => fetcher(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
        },
    }).then(r => r.data), {
        onSuccess(data) {
            if (!data) {
                session.reset();
                return
            }
            cariForm(query || '');
        },
    });

    const sendVerifyNode = (id: string): void => {
        fetch(`/api/archives/${id}/verify`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            method: 'POST',
        }).finally(() => {
            mutate();
            setSelectedData(selectedData.filter(x => x.id !== id));
        });
    }

    const resolveDoc = (t: string) => {
        switch(t) {
            case 'prestasi':
                return 'certificate_path';
            case 'afirmasi':
                return 'kip_path';
            case 'mutasi':
                return 'mutation_path';
            default:
                return 'kk_path';
        }
    }

    React.useEffect(() => {
        setSelectedData(data?.archives || []);
    }, [data, sortBy]);


    const cariForm = React.useCallback((query: string) => {
        setQuery(query);
        if (!query.length) {
            setSelectedData(data?.archives || []);
            return;
        }

        const fuse = new Fuse(data?.archives || [], {
            keys: ['nisn', 'name', 'nik'],
        });
        const results = fuse.search(query);
        const values = sortBy.split(':');
        setSelectedData(results.map(x => x.item).filter((x: any) => eval(`'${x[values![0]]}'${values![1]}`)).sort());
    }, [data?.archives, sortBy]);

    React.useEffect(() => {
        cariForm(query || '');
    }, [query, cariForm]);

    return (
        <div>
            <div className="lg:px-40">
                    {!isLoading && (
                        <div className="join join-vertical lg:join-horizontal">
                            <div>
                                <div>
                                    <input className="input join-item" placeholder="Cari NISN/Nama" value={query} onChange={(ev) => cariForm(ev.target.value)}/>
                                </div>
                            </div>
                            <div className="join-item">
                                <div className="join">
                                    <button className="join-item btn" onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage-1)}>«</button>
                                    {currentPage > 1 && (
                                        <>
                                            <button className="join-item btn" onClick={() => setCurrentPage(1)}>1</button>
                                            {currentPage > 2 && <button className="join-item btn btn-disabled">...</button>}
                                        </>
                                    )}
                                    <button className="join-item btn btn-neutral">{currentPage}</button>
                                    {currentPage !== data?.totalPage && <button className="join-item btn" onClick={() => setCurrentPage(data?.nextPage)}>{data?.nextPage}</button>}
                                    <button className="join-item btn btn-disabled">...</button>
                                    <button className="join-item btn" onClick={() => setCurrentPage(data?.totalPage)}>{data?.totalPage}</button>
                                    <button className="join-item btn" onClick={() => setCurrentPage(currentPage === data?.totalPage ? data?.totalPage : currentPage+1)}>»</button>

                                    <div className="join-item">
                                        <select className="select w-full max-w-xs" value={sortBy} onChange={(ev) => setSortBy(ev.target.value)}>
                                            <option disabled selected>Sort by:</option>
                                            <option value="type:== 'zonasi'">Zonasi</option>
                                            <option value="type:== 'prestasi'">Prestasi</option>
                                            <option value="type:== 'afirmasi'">Afirmasi</option>
                                            <option value="type:== 'mutasi'">Mutasi</option>
                                            <option value="verificator_id:!== 'null'">Terverifikasi</option>
                                            <option value="verificator_id:== 'null'" selected>Tidak terverifikasi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <div className="overflow-x-auto">
                    {isLoading && <h1 className="text-2xl font-sans text-center">Loading <span className="loading loading-dots loading-lg"></span></h1>}
                    {!isLoading && data && (
                        <>
                            <table className="table">
                                <thead>
                                <tr className="lg:text-lg">
                                    <th>Actions</th>
                                    <th>Berkas/Kelamin</th>
                                    <th>Nama</th>
                                    <th>NISN</th>
                                    <th>NIK</th>
                                    <th>Nama Ayah</th>
                                    <th>Nama Ibu</th>
                                    <th>Asal Sekolah</th>
                                    <th>TTL</th>
                                    <th>Jalur</th>
                                    <th>Agama</th>
                                    <th>SKHU</th>
                                    <th>Foto Pas</th>
                                    <th>Dokumen Lain</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {selectedData.map((archive: any) => (
                                        <tr key={archive.id}>
                                            <th>
                                                <button className="btn btn-secondary text-sm" onClick={(ev) => {
                                                    ev.currentTarget.setAttribute('disabled', 'true');
                                                    sendVerifyNode(archive.id);
                                                }}>
                                                    verify
                                                </button>
                                            </th>
                                            <td>{archive.id.split('-')[0]}/{archive.gender}</td>
                                            <td>{archive.name}</td>
                                            <td>{archive.nisn}</td>
                                            <td>{archive.nik}</td>
                                            <td>{archive.father_name}</td>
                                            <td>{archive.mother_name}</td>
                                            <td>{archive.school}</td>
                                            <td>{archive.birthday}</td>
                                            <td>{archive.type.toUpperCase()}</td>
                                            <td>{archive.religion.toUpperCase()}</td>
                                            <td>
                                                {archive.skhu_path ? <a className="text-blue-600" href={`https://ppdb.api.sman3palu.sch.id/${archive.skhu_path?.replace('public', 'storage')}`} target="_blank">
                                                    Visit
                                                </a> : <p className="text-gray-400">-</p>}
                                            </td>
                                            <td>
                                                {archive.photo_path ? <a className="text-blue-600" href={`https://ppdb.api.sman3palu.sch.id/${archive.photo_path?.replace('public', 'storage')}`} target="_blank">
                                                        Visit
                                                    </a> : <p className="text-gray-400">-</p>}
                                            </td>
                                            <td>
                                                {archive[resolveDoc(archive.type)] ? <a className="text-blue-600" href={`https://ppdb.api.sman3palu.sch.id/${archive[resolveDoc(archive.type)]?.replace('public', 'storage')}`} target="_blank">
                                                        Visit
                                                    </a> : <p className="text-gray-400">-</p>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}