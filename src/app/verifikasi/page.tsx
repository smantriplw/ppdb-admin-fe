'use client';

import React from 'react'
import { useSessionStore } from '@/contexts/sessionContext';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr'
import Fuse from 'fuse.js'
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import { FormField } from '@/components/forms/field';

const verifySchema = Yup.object({
    isSafe: Yup.boolean().required(),
    message: Yup.string().optional(),
});

export default function VerifikasiPage() {
    const session = useSessionStore();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [query, setQuery] = React.useState<string>();
    const [selectedData, setSelectedData] = React.useState<any[]>([]);
    const [sortBy, setSortBy] = React.useState<string>('verificator_id:== \'null\'');
    const [current, setCurrent] = React.useState<string>();
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

    const sendVerifyNode = (id: string, isSafe: boolean, message?: string, cb?: () => void): void => {
        const user = data?.archives.find((x: any) => x.id === id);
        if (!user) return;

        fetch(`/api/archives/${id}/verify`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
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
                                                <button disabled={Boolean(archive.verificator_id)} className="btn btn-secondary text-sm" onClick={(ev) => handleVerify(ev, archive.id)}>
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

            <dialog id="verify_modal" className="modal">
                <form method="dialog" className="modal-box">
                    {/* <button htmlFor="verify_modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> */}
                    <h3 className="font-bold text-lg">
                        Apakah Anda yakin bahwa <span className="font-semibold">&apos;{selectedData.find((x: any) => x.id === current)?.name || current}&apos;</span> telah terverifikasi dengan benar?
                    </h3>
                    <button onClick={() => document.getElementById('verify_modal')?.removeAttribute('open')} type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    <div className="py-4">
                        <p>
                            Sebelum Anda memverifikasi peserta, pastikan Anda telah melihat dengan seksama dokumen yang telah tersedia tentang peserta didik ini. Seperti dokumen SKHU, Foto Pas, dan KK/Sertifikat/SK Mutasi/KIP.
                        </p>
                    </div>

                    <Formik
                        validationSchema={verifySchema}
                        onSubmit={(values, actions) => {
                            const message = values.isSafe ? undefined : values.message;

                            sendVerifyNode(current!, values.isSafe, message, () => {
                                actions.setSubmitting(false);
                                document.getElementById('verify_modal')?.removeAttribute('open');
                            });
                        }}
                        initialValues={{
                            isSafe: false,
                            message: '',
                        }}
                    >
                        {(props => (
                            <Form onSubmit={props.handleSubmit}>
                                <div className="form-control">
                                    <label htmlFor="isSafe">Apakah aman?</label>
                                    <Field disabled={props.isSubmitting} as="input" type="checkbox" className="checkbox" name="isSafe" />
                                </div>

                                <div className={`form-control mt-2${props.values.isSafe ? ' hidden': ''}`}>
                                    <label htmlFor="message">Pesan verifikator</label>
                                    <Field disabled={props.isSubmitting} as="textarea" name="message" className="textarea textarea-bordered" placeholder="Pesan untuk berkas ini. Contoh: KK tidak masuk zona" />
                                </div>

                                <div className="modal-action">
                                    <button type="button" onClick={props.submitForm} className="btn btn-primary" disabled={props.isSubmitting}>{props.isSubmitting ? <span className="loading loading-dots loading-sm"></span> : 'verify'}</button>
                                </div>
                            </Form>
                        ))}
                    </Formik>
                </form>
            </dialog>
        </div>
    )
}