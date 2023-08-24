import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { IRootState } from '@/store';
import { useRouter } from 'next/router';

const ErrorPage = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    const router = useRouter();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
            <section className="bg-transparent dark:bg-gray-900 ">
                <div className="container mx-auto flex min-h-screen items-center px-6 py-12">
                    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
                        <p className="rounded-full bg-blue-50 p-3 text-sm font-medium text-blue-500 dark:bg-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </p>
                        <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Page not found</h1>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">The page you are looking for does not exist. Here are some helpful links:</p>

                        <div className="mt-6 flex w-full shrink-0 items-center gap-x-3 sm:w-auto">
                            <button
                                className="flex w-1/2 items-center justify-center gap-x-2 rounded-lg border bg-white px-5 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
                                onClick={() => router.back()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                </svg>

                                <span>Go back</span>
                            </button>
                            <Link href="/">
                                <button className="w-1/2 shrink-0 rounded-lg bg-blue-500 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 sm:w-auto">
                                    Go To HomePage
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
ErrorPage.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default ErrorPage;
