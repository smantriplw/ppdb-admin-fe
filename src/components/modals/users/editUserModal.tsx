import { BaseModal, useModalUtility } from '@/components/modals/modal'
import { useSessionStore } from '@/contexts/sessionContext';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { GoCheck } from 'react-icons/go';
import * as Yup from 'yup'

const editUserSchema = Yup.object({
    username: Yup.string().min(4).max(30).required(),
    password: Yup.string().min(8).max(30).optional(),
    status: Yup.number().min(1).max(2),
});

export const EditUserModal = (props: { user: any; closeModal?: () => void; }) => {
    const session = useSessionStore();

    const { closeModal } = useModalUtility({ modalId: 'edit_user_modal' }, () => {});
    return (
        <BaseModal closeModal={props.closeModal || closeModal} modalId='edit_user_modal' title={`Edit user ${props.user.email}`} description='Anda dapat mereset password user ini, mengatur ulang username, dan type nya'>
            <Formik
                validationSchema={editUserSchema}
                initialValues={props.user}
                onSubmit={(values, actions) => {
                    fetch(`/api/users/${props.user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session.token}`,
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(values),
                    }).finally(() => {
                        actions.setSubmitting(false);
                    }).then(res => res.json()).then(res => {
                        if (res.errors)
                            {
                                res.errors = Object.entries(res.errors).map((x: any) => ({ [x[0]]: x[1][0] })).reduce((a, b) => ({ ...a, ...b }))
                            
                                actions.setErrors(res.errors);
                                return;
                            }
                        
                        (props.closeModal || closeModal)();
                    });
                }}
            >
                {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                        <div className="form-control">
                                <label className="text-xl" htmlFor="username">Username</label>
                                <Field className="input input-bordered w-full max-w-xs" name="username" placeholder="John Doe" type="text" disabled={props.isSubmitting} />
                                <span className="text-red-500">
                                    <ErrorMessage name="username" />
                                </span>
                            </div>
                            <div className="form-control">
                                <label className="text-xl" htmlFor="email">Email</label>
                                <Field className="input input-bordered w-full max-w-xs" name="email" placeholder="johndoe@email.com" type="email" disabled />
                                <span className="text-red-500">
                                    <ErrorMessage name="email" />
                                </span>
                            </div>
                            <div className="form-control">
                                <label className="text-xl" htmlFor="password">Password</label>
                                <Field className="input input-bordered w-full max-w-xs" name="password" placeholder="ThisIsVeryStrongPassword" type="password" disabled={props.isSubmitting} />
                                <span className="text-red-500">
                                    <ErrorMessage name="password" />
                                </span>
                            </div>
                            <div className="form-control">
                                <label className="text-xl" htmlFor="status">Type</label>
                                <select name="status" className="select select-bordered w-full max-w-xs" defaultValue={props.values.status} disabled={props.isSubmitting}>
                                    <option value="1">Admin</option>
                                    <option value="2">Super Admin</option>
                                </select>
                                <span className="text-red-500">
                                    <ErrorMessage name="status" />
                                </span>
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={props.submitForm} className="btn" disabled={props.isSubmitting}>{props.isSubmitting ? <span className="loading loading-dots loading-sm"></span> : <><GoCheck /> Edit</>}</button>
                            </div>
                    </Form>
                )}
            </Formik>
        </BaseModal>
    )
}