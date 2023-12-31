/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { Email } from '@/utils/icons';
import { ApiClient } from '@/utils/http';
import { showToastAlert } from '@/utils/contant';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Loader from '@/components/__Shared/Loader';

const ConfirmEmailPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        dispatch(setPageTitle('Email Verification | Authentication'));
    }, []);
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const forgetMyPassword = async () => {
        setLoading(true);
        try {
            await new ApiClient().post('/auth/forgot-password', {
                email,
            });
            Swal.fire({
                icon: 'success',
                title: 'Forget password link sent to your email address!',
                padding: '2em',
                customClass: 'sweet-alerts',
                didClose: () => {
                    router.push('/auth/signin');
                },
            });
            setEmail('');
        } catch (error: any) {
            if (typeof error?.response?.data?.message === 'object') {
                showToastAlert(error?.response?.data?.message.join(' , '));
            } else {
                showToastAlert(error?.response?.data?.message);
            }
            showToastAlert(error?.response?.data?.message);
        }
        setLoading(false);
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
                    <div className="relative flex flex-col justify-center rounded-md bg-white/60 px-6 py-12 backdrop-blur-lg dark:bg-black/50 ">
                        <div className="mx-auto w-full max-w-[440px]">
                            {loading ? (
                                <Loader />
                            ) : (
                                <div className="mb-3">
                                    <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Forgot Password</h1>
                                    <p className="py-6 text-justify text-base font-bold leading-normal text-white-dark">
                                        Please enter your email address, and click forget password button. You will receive forget password link to your given email address
                                    </p>
                                    <div>
                                        <label htmlFor="Email">Email</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="Email"
                                                type="email"
                                                placeholder="Enter Email"
                                                className="form-input ps-10 placeholder:text-white-dark"
                                                name="email"
                                                value={email}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <Email />
                                            </span>
                                        </div>
                                    </div>
                                    <button type="submit" onClick={forgetMyPassword} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        Forget Password
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
ConfirmEmailPage.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default ConfirmEmailPage;
