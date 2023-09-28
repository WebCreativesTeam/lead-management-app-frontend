import type { AppProps } from 'next/app';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Head from 'next/head';

import { appWithI18Next } from 'ni18n';
import { ni18nConfig } from 'ni18n.config.ts';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

import '../styles/tailwind.css';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import FullScreenLoader from '@/components/__Shared/FullScreenLoader';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
    const [loader, setLoader] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const uid: string | null = localStorage?.getItem('uid');
        if (uid === null) {
            const x = await router.push('/auth/signin');
            setLoader(false);
            return;
        } else {
            setLoader(false);
        }
    };

    return loader ? (
        <FullScreenLoader />
    ) : (
        <Provider store={store}>
            <Head>
                <title>VRISTO - Multipurpose Tailwind Dashboard Template</title>
                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            {getLayout(<Component {...pageProps} />)}
        </Provider>
    );
};
export default appWithI18Next(App, ni18nConfig);
