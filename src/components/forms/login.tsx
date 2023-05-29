import React from 'react'
import { Righteous } from 'next/font/google'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import Cookies from 'js-cookie'
import { FormField } from './field';
import { useRouter } from 'next/navigation'

type DataProps = {
    isError: boolean;
    message?: string;
}

const loginValidation = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(4),
});

const righteous = Righteous({
    weight: '400',
    subsets: ['latin'],
});
export const LoginForm = () => {
    const [data, setData] = React.useState<DataProps>({
        isError: false,
    });
    const router = useRouter();
    const savedToken = Cookies.get('ppdb_admin');

    React.useEffect(() => {
        if (savedToken) {
            router.push('/me');
        }
    }, [savedToken, router]);

    return (
        <div>
            <h1 className={`text-center text-2xl font-sans font-semibold uppercase ${righteous.className}`}>
                ppdb login
            </h1>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                onSubmit={(values, actions) => {
                    actions.setSubmitting(true);

                    fetch('https://ppdb.api.sman3palu.sch.id/api/auth/login', {
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                    }).then(r => r.json()).then(res => {
                        if (res.errors || res.error) {
                            setData({
                              isError: true,
                              message: res.error || res.message,
                            });
                            actions.setSubmitting(false);
                          } else {
                            if (!res?.data) {
                              setData({
                                isError: true,
                                message: 'Login failed, try again',
                              });
                              actions.setSubmitting(false);
                              return;
                            }

                            Cookies.set('ppdb_admin', res.data.token);
                            router.push('/me');
                        }
                    }).catch(e => {
                        actions.setSubmitting(false);
                        setData({
                            isError: true,
                            message: e.message,
                        });
                    });
                }}
                validationSchema={loginValidation}
            >
                {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                        <FormField label='' labelKey='Email'>
                            <Field onChange={props.handleChange} type='email' disabled={props.isSubmitting} className="input input-bordered w-full md:w-max max-w-xs" name="email" />
                        </FormField>
                        {props.errors.email && props.touched.email ? (
                            <p className="text-red-500">{props.errors.email}</p>
                        ) : null}
                        <FormField label='' labelKey='Password'>
                            <Field onChange={props.handleChange} type='password' disabled={props.isSubmitting} className="input input-bordered w-full md:w-max max-w-xs" name="password" />
                        </FormField>
                        {props.errors.password && props.touched.password ? (
                            <p className="text-red-500">{props.errors.password}</p>
                        ) : null}
                        {data.message ? (
                            <div className="text-center mt-2">
                                <div className={`alert alert-${data.isError ? 'error' : 'success'} shadow-lg`}>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>{data.isError ? 'Error' : 'Sukses'}! {data.message}</span>
                                </div>
                                </div>
                            </div>
                        ) : null}
                        <div className="text-center">
                            <div className="text-center">
                                <button disabled={props.isSubmitting} className={`btn border-none mt-2 bg-[#1b30a5]${props.isSubmitting ? ' loading' : ''}`}>login</button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}