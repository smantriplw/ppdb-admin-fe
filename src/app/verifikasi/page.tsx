'use client';

import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr'
import Fuse from 'fuse.js'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup'

const verifySchema = Yup.object({
    isSafe: Yup.boolean().required(),
    message: Yup.string().min(30).max(1000).optional(),
});

export default function VerifikasiPage() {
    const session = useSessionStore();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [query, setQuery] = React.useState<string>();
    const [selectedData, setSelectedData] = React.useState<any[]>([]);
    const [ket, setKet] = React.useState<{
        message: string;
        created_at: string;
        isSafe: boolean;
    }>();
    const [sortBy, setSortBy] = React.useState<string>('verificator_id:== \'null\'');
    const [current, setCurrent] = React.useState<string>();
    const [userstate, setUserState] = React.useState<any>();

    const { data, isLoading, mutate } = useSWR(session.token ? `/api/archives?offset=200&page=${currentPage}&all=true` : null, url => fetcher(url, {
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
    // const isModalOpen = React.useCallback(() => document.getElementById('verify_modal')?.hasAttribute('open') || false, []);

    const sendVerifyNode = (id: string, isSafe: boolean, message?: string, cb?: () => void) => {
        const user = data?.archives.find((x: any) => x.id === id);
        if (!user) return;

        return fetch(`/api/archives/${id}/verify`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
                'Accept': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                isSafe,
                message,
            }),
        }).finally(() => {
            mutate();
            setSelectedData(selectedData.filter(x => x.id !== id));
            if (cb)
                cb();
        });
    }

    const handleVerify = (ev: React.MouseEvent<HTMLButtonElement>, id: string) => {
        // ev.currentTarget.setAttribute('disabled', 'true');
        const modalDom = document.getElementById('verify_modal');

        if (modalDom) {
            modalDom.setAttribute('open', '');
            setCurrent(id);

            if (ket && !selectedData.find((x: any) => x.id === current)?.verificator)
                setKet(undefined);

            if (ev.currentTarget.innerText.trim().replace(/\s+/g, '').toLowerCase() === 'ket')
            {
                const verifyData = data?.archives.find((x: any) => x.id === id)?.verify_data;

                if (verifyData) {
                    setKet(verifyData);
                }
            }
        }
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
        const values = sortBy.split(':');
        if (!query.length) {
            setSelectedData(data?.archives.filter((x: any) => eval(`'${x[values![0]]}'${values![1]}`)) || []);
            return;
        }

        const fuse = new Fuse(data?.archives || [], {
            keys: ['nisn', 'name', 'nik'],
        });
        const results = fuse.search(query);
        setSelectedData(results.map(x => x.item).filter((x: any) => eval(`'${x[values![0]]}'${values![1]}`)).sort());
    }, [data?.archives, sortBy]);

    React.useEffect(() => {
        cariForm(query || '');
    }, [query, cariForm]);

    React.useEffect(() => {
        setUserState(data?.archives.find((x: any) => x.id === current));
    }, [current, data?.archives]);

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
                                            <option disabled>Sort by:</option>
                                            <option value="type:== 'zonasi'">Zonasi</option>
                                            <option value="type:== 'prestasi'">Prestasi</option>
                                            <option value="type:== 'afirmasi'">Afirmasi</option>
                                            <option value="type:== 'mutasi'">Mutasi</option>
                                            <option value="verificator_id:!== 'null'">Terverifikasi</option>
                                            <option value="verificator_id:== 'null'">Tidak terverifikasi</option>
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
                                    <th>NO</th>
                                    <th>Actions</th>
                                    <th>Berkas/Kelamin</th>
                                    <th>Nama</th>
                                    <th>NISN</th>
                                    <th>NIK</th>
                                    <th>Telp</th>
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
                                    {selectedData.map((archive: any, index) => (
                                        <tr key={archive.id}>
                                            <th>
                                                {archive.index ?? index+1}
                                            </th>
                                            <th>
                                                <button disabled={sortBy !== 'verificator_id:!== \'null\'' && Boolean(archive.verificator_id)} className={`btn btn-${archive.verificator_id ? 'accent' : 'secondary'} text-sm`} onClick={(ev) => handleVerify(ev, archive.id)}>
                                                    {Boolean(archive.verificator_id) ? 'ket' : 'verify'}
                                                </button>
                                            </th>
                                            <td>{archive.id.split('-')[0]}/{archive.gender}</td>
                                            <td>{archive.name}</td>
                                            <td>{archive.nisn}</td>
                                            <td>{archive.nik}</td>
                                            <td>0{archive.phone}</td>
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

            <dialog id="verify_modal" className="modal">
                <form method="dialog" className="modal-box">
                    {/* <button htmlFor="verify_modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
                    <h3 className="font-bold text-lg">
                        {!ket || !selectedData.find((x: any) => x.id === current)?.verificator ? (
                            <>
                                Apakah Anda yakin bahwa <span className="font-semibold">&apos;{selectedData.find((x: any) => x.id === current)?.name || current}&apos;</span> telah terverifikasi dengan benar?
                            </>) : (
                                <span>
                                    Peserta: {selectedData.find((x: any) => x.id === current)?.name || current}
                                </span>
                            )}
                    </h3>
                    <button onClick={() => document.getElementById('verify_modal')?.removeAttribute('open')} type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <div className="py-4">
                        <p>
                            {!ket || !selectedData.find((x: any) => x.id === current)?.verificator ? <span>Sebelum Anda memverifikasi peserta, pastikan Anda telah melihat dengan seksama dokumen yang telah tersedia tentang peserta didik ini. Seperti dokumen SKHU, Foto Pas, dan KK/Sertifikat/SK Mutasi/KIP.</span> : (
                                <span>
                                    Diverifikasi oleh <span className="uppercase font-semibold">{selectedData.find((x: any) => x.id === current)?.verificator?.username || '-'}</span>, pada <span className="font-semibold">{new Date(ket.created_at).toLocaleTimeString('id-ID', {
                                        day: '2-digit',
                                        month: 'long',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    }).replace(/\./g, ':')}</span>
                                </span>
                            )}
                        </p>
                    </div>

                    <Formik
                        validationSchema={verifySchema}
                        onSubmit={(values, actions) => {
                            if (!userstate) return;

                            actions.setErrors({});
                            const message = values.isSafe ? undefined : values.message;

                            sendVerifyNode(current!, values.isSafe, message, () => {
                                actions.setSubmitting(false);
                            })?.then(res => res.json()).then(r => {
                                if (r.errors) {
                                    delete r['errors'];
                                    actions.setErrors(r);
                                    return;
                                } else {
                                    document.getElementById('verify_modal')?.removeAttribute('open');
                                }
                            });
                        }}
                        initialValues={{
                            isSafe: false,
                            message: undefined,
                        }}
                    >
                        {(props => (
                            <Form onSubmit={props.handleSubmit}>
                                <div className="form-control">
                                    <label htmlFor="isSafe">Apakah aman?</label>
                                    <Field checked={ket?.isSafe} disabled={props.isSubmitting || Boolean(ket)} as="input" type="checkbox" className="checkbox" name="isSafe" />
                                </div>

                                <div className={`form-control mt-2${ket?.isSafe ? ' hidden': ''}`}>
                                    <label htmlFor="message">Keterangan</label>
                                    <Field value={ket?.message} disabled={props.isSubmitting || Boolean(ket)} as="textarea" name="message" className="textarea textarea-bordered" placeholder="Pesan untuk berkas ini. Contoh: KK tidak masuk zona" />
                                    <ErrorMessage name="message" className="text-red-500" />
                                </div>

                                {!Boolean(ket) && <div className="modal-action">
                                    <button type="button" onClick={props.submitForm} className="btn btn-primary" disabled={props.isSubmitting}>{props.isSubmitting ? <span className="loading loading-dots loading-sm"></span> : 'verify'}</button>
                                </div>}
                            </Form>
                        ))}
                    </Formik>
                </form>
            </dialog>
        </div>
    )
}