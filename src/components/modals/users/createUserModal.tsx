import { BaseModal, useModalUtility } from '@/components/modals/modal'
import { useSessionStore } from '@/contexts/sessionContext';
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { GoCheck } from 'react-icons/go'

const createUserSchema = Yup.object({
    email: Yup.string().email().required(),
    username: Yup.string().min(4).required().max(30),
    password: Yup.string().min(8).required().max(30),
    status: Yup.number().min(0).max(2).required(),
});

export const CreateUserModal = () => {
    const session = useSessionStore();
    const { closeModal } = useModalUtility({ modalId: 'create_user_modal' });

    return <BaseModal modalId='create_user_modal' title='Buat user baru' description='Silahkan input data user baru berupa username, password, email, dan type nya'>
                <Formik
                    validationSchema={createUserSchema}
                    initialValues={{
                        email: '',
                        username: '',
                        password: '',
                        status: 1,
                    }}
                    onSubmit={(values, actions) => {
                        fetch('/api/users', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.token}`,
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify(values),
                        }).then(res => res.json()).then(res => {
                            if (res.errors)
                            {
                                res.errors = Object.entries(res.errors).map((x: any) => ({ [x[0]]: x[1][0] })).reduce((a, b) => ({ ...a, ...b }))
                            
                                actions.setErrors(res.errors);
                                return;
                            }

                            closeModal();
                        }).finally(() => {
                            actions.setSubmitting(false);
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
                                <Field className="input input-bordered w-full max-w-xs" name="email" placeholder="johndoe@email.com" type="email" disabled={props.isSubmitting} />
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
                                <select name="status" className="select select-bordered w-full max-w-xs" defaultValue={1} disabled={props.isSubmitting}>
                                    <option value="1">Admin</option>
                                    <option value="2">Super Admin</option>
                                </select>
                                <span className="text-red-500">
                                    <ErrorMessage name="status" />
                                </span>
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={props.submitForm} className="btn" disabled={props.isSubmitting}>{props.isSubmitting ? <span className="loading loading-dots loading-sm"></span> : <><GoCheck /> Buat</>}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </BaseModal>
}