import { Righteous } from 'next/font/google'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FormField } from './field';

const loginValidation = Yup.object().shape({
    email: Yup.string().required().email(),
    password: Yup.string().required().min(4),
});

const righteous = Righteous({
    weight: '400',
    subsets: ['latin'],
});
export const LoginForm = () => {
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