import React from 'react'
import { CgClose } from 'react-icons/cg'

export type ModalProps = {
    title: string;
    modalId?: string;
    description?: React.ReactNode;

    closeModal?: () => void;
}

export const useModalUtility = (props: Omit<ModalProps, 'title' | 'description'>, closeCb?: () => void) => {
    const closeModal = () => {
        document.getElementById(props.modalId!)?.removeAttribute('open');
        if (closeCb)
            closeCb();
    }
    const openModal = () => document.getElementById(props.modalId!)?.setAttribute('open', '');

    return {
        closeModal,
        openModal,
    }
}

export const BaseModal = (props: React.PropsWithChildren<ModalProps>) => {
    props.modalId ??= 'create_user_modal';

    const { closeModal } = useModalUtility({ modalId: props.modalId });

    return (
        <dialog id={props.modalId} className="modal">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">
                    {props.title}
                </h3>
                <button onClick={props.closeModal || closeModal} type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    <CgClose />
                </button>

                <div className="py-4">
                    {props.description}
                </div>

                {props.children}
            </form>
        </dialog>
    );
}