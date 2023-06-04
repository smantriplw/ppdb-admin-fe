'use client';

import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr'
import Fuse from 'fuse.js'

export default function VerifikasiPage() {
    const session = useSessionStore();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedData, setSelectedData] = React.useState<any[]>([]);
    const { data, isLoading } = useSWR(session.token ? `/api/archives?perPage=10&page=${currentPage}` : null, url => fetcher(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
        },
    }).then(r => r.data), {
        onSuccess(data) {
            setSelectedData(data.archives);
        },
    });
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
    }, [data]);


    const cariForm = (query: string) => {
        if (!query.length) {
            setSelectedData(data?.archives || []);
            return;
        }
        const fuse = new Fuse(data?.archives || [], {
            keys: ['nisn', 'name', 'nik', 'birthday', 'school'],
        });

        const results = fuse.search(query);
        setSelectedData(results.map(x => x.item));
    }
    return (
        <div>
            <div className="lg:px-40">
                    {!isLoading && (
                        <div className="join join-vertical lg:join-horizontal">
                            <div>
                                <div>
                                    <input className="input join-item" placeholder="Cari NISN/Nama" onChange={(ev) => cariForm(ev.target.value)}/>
                                </div>
                            </div>
                            <div className="join-item">
                                <div className="join">
                                    <button className="join-item btn">«</button>
                                    <button className="join-item btn btn-neutral">{currentPage}</button>
                                    <button className="join-item btn">{data?.nextPage}</button>
                                    <button className="join-item btn btn-disabled">...</button>
                                    <button className="join-item btn">{data?.totalPage}</button>
                                    <button className="join-item btn">»</button>
                                </div>
                            </div>
                        </div>
                    )}
                <div className="overflow-x-auto">
                    {isLoading && <h1 className="text-2xl font-sans text-center">Loading <span className="loading loading-dots loading-lg"></span></h1>}
                    {!isLoading && data && (
                        <>
                            <table className="table">
                                {/* head */}
                                <thead>
                                <tr className="lg:text-lg">
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
                                    <th>KK/Sertifikat/SK Mutasi/KIP</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {selectedData.map((archive: any) => (
                                        <tr key={archive.id}>
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