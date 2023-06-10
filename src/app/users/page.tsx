'use client';
import { useSessionStore } from '@/contexts/sessionContext';
import { fetcher } from '@/lib/fetcher';
import useSWR from 'swr'
import { AiOutlinePlus, AiFillEdit } from 'react-icons/ai'
import { CgTrash } from 'react-icons/cg'
import { useModalUtility } from '@/components/modals/modal'
import { CreateUserModal } from '@/components/modals/users/createUserModal';
import { EditUserModal } from '@/components/modals/users/editUserModal';
import React from 'react';

const UserStatus: Record<number, string> = {
    0: 'Non Active',
    1: 'Admin',
    2: 'Super Admin'
}

export default function UsersPage() {
    const session = useSessionStore();
    const [user, setUser] = React.useState();
    const { data, isLoading } = useSWR(session.token && session.status === 2 ? '/api/users' : null, url => fetcher(url, {
        headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json',
        }
    }), {
        refreshInterval: 3000,
    });

    const { openModal: openModalUser } = useModalUtility({ modalId: 'create_user_modal' });
    const { openModal: openModalEditUser, closeModal: closeModalEdit } = useModalUtility({ modalId: 'edit_user_modal' }, () => {
        setUser(undefined);
    });

    const deleteUser = (ev: HTMLButtonElement, id: number) => {
        ev.setAttribute('disabled', 'true');
        fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            }
        });
    }

    React.useEffect(() => {
        if (user)
            openModalEditUser();
    }, [openModalEditUser, user]);

    return (
        <main>
            {isLoading || !data ? (
                <h1 className="font-semibold text-2xl text-center">
                    {session.status !== 2 ? 'You aren\'t allowed to view this page' : 'Loading...'}
                </h1>
            ) : (
                <div className="lg:px-40">
                    <div className="flex flex-row">
                        <div>
                            <button className="btn btn-neutral" onClick={openModalUser}>
                                <AiOutlinePlus /> Create
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                                {(data?.data || []).map((user: any, index: number) => (
                                    <tr className={(index+1) % 2 ? '' : 'hover'} key={user.id}>
                                        <td>{index+1}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{UserStatus[user.status]}</td>
                                        <td className="join join-vertical lg:join-horizontal">
                                            {user.id !== session.id ? (
                                                <>
                                                    <button className="btn btn-info join-item" onClick={() => {
                                                        setUser(user);
                                                    }}>
                                                        <AiFillEdit />
                                                    </button>
                                                    <button className="btn btn-error join-item" onClick={(ev) => deleteUser(ev.currentTarget, user.id)}>
                                                        <CgTrash />
                                                    </button>
                                                </>
                                            ) : <p className="text-gray-500">DISABLED</p>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <CreateUserModal />
                    {user && <EditUserModal user={user} closeModal={closeModalEdit} />}
                </div>
            )}
        </main>
    )
}