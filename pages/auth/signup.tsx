/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useEffect, useState } from 'react';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useFormik } from 'formik';
import { signUpSchema } from '../../utils/schemas';
import { useRouter } from 'next/router';
import { showToastAlert } from '@/utils/contant';
import { ApiClient } from '@/utils/http';
import { Email, Lock, UserFilled } from '@/utils/icons';
import Loader from '@/components/__Shared/Loader';
import { ISignInResponse } from '@/utils/Types';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    checkCondition: '',
};

const SignUpPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Signup | Authentication'));
    });
    const [disableBtn, setDisableBtn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { values, handleChange, handleSubmit, errors, handleBlur } = useFormik({
        initialValues,
        validationSchema: signUpSchema,
        validateOnChange: true,
        onSubmit: async (value, action) => {
            setDisableBtn(true);
            setLoading(true);
            try {
                const createUserObj = {
                    firstName: value.firstName,
                    lastName: value.lastName,
                    email: value.email,
                    password: value.password,
                };
                const res: ISignInResponse = await new ApiClient().post('/auth/sign-up', createUserObj);
                console.log(res)
                localStorage.setItem('uid', res?.data?.id);
                action.resetForm();
                router.push('/auth/email-verification');
            } catch (error: any) {
                if (typeof error?.response?.data?.message === 'object') {
                    showToastAlert(error?.response?.data?.message.join(' , '));
                } else {
                    showToastAlert(error?.response?.data?.message);
                }
            }
            setDisableBtn(false);
            setLoading(false);
        },
    });

    const showAlert = async () => {
        if (errors.firstName) {
            showToastAlert(errors.firstName);
        } else if (errors.lastName) {
            showToastAlert(errors.lastName);
        } else if (errors.email) {
            showToastAlert(errors.email);
        } else if (errors.password) {
            showToastAlert(errors.password);
        } else if (errors.confirmPassword) {
            showToastAlert(errors.confirmPassword);
        }
    };
    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-6 backdrop-blur-lg dark:bg-black/50">
                            <div className="mx-auto w-full max-w-[70%]">
                                <div className="mb-3">
                                    <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Sign Up</h1>
                                    <p className="text-base font-bold leading-normal text-white-dark">Enter your email and password to register</p>
                                </div>
                                <form className="space-y-5 dark:text-white" onSubmit={handleSubmit}>
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <div className="flex-1">
                                            <label htmlFor="firstName">First Name</label>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="firstName"
                                                    type="text"
                                                    placeholder="Enter First Name"
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="firstName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.firstName}
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <UserFilled />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="Name">Last Name</label>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="Name"
                                                    type="text"
                                                    placeholder="Enter Last Name"
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="lastName"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.lastName}
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <UserFilled />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="Email">Email</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Email"
                                                type="email"
                                                placeholder="Enter Email"
                                                className="form-input ps-10 placeholder:text-white-dark"
                                                name="email"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.email}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <Email />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <div className="flex-1">
                                            <label htmlFor="Password">Password</label>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="Password"
                                                    type="password"
                                                    placeholder=" Password"
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.password}
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <Lock />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label htmlFor="confirm-password">Confirm Password</label>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="confirm-password"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    className="form-input ps-10 placeholder:text-white-dark"
                                                    name="confirmPassword"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.confirmPassword}
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                    <Lock />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex cursor-pointer items-center">
                                            <input type="checkbox" className="form-checkbox bg-white dark:bg-black" onChange={handleChange} value={values.checkCondition} name="checkCondition" />
                                            <span className="text-white-dark">I agree to the terms and conditions.</span>
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                                        disabled={
                                            values.checkCondition && values.firstName && values.lastName && values.email && values.password && values.confirmPassword && !disableBtn ? false : true
                                        }
                                        onClick={() => errors && showAlert()}
                                    >
                                        Sign Up
                                    </button>
                                </form>
                                <div className="mb-3"></div>
                                <div className="text-center dark:text-white">
                                    Already have an account ?&nbsp;
                                    <Link href="/auth/signin" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                        SIGN IN
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
SignUpPage.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default SignUpPage;
