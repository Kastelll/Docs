import {ChakraProvider} from '@chakra-ui/react'
import theme from "../utils/theme";
import NProgress from 'nprogress';
import {debounce} from 'lodash';
import RouterEvents from "../utils/router-events";
import {useEffect} from "react";
import '../styles/globals.css';
import Head from 'next/head';
import Script from "next/script";
import NavBar from "../components/navbar";

const start = debounce(NProgress.start, 100);
RouterEvents.on('routeChangeStart', start);
RouterEvents.on('routeChangeComplete', (url) => {
    start.cancel();
    NProgress.done();
});
RouterEvents.on('routeChangeError', () => {
    start.cancel();
    NProgress.done();
});

function MyApp({Component, pageProps}) {

    useEffect(() => {
        let activeRequests = 0;
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            if (activeRequests === 0) {
                start();
            }
            activeRequests++;
            try {
                return await originalFetch(...args);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                activeRequests -= 1;
                if (activeRequests === 0) {
                    start.cancel();
                    NProgress.done();
                }
            }
        };
    })

    return (
        <ChakraProvider theme={theme}>
            <Script async defer data-website-id="7d0c498a-4ebc-4b6c-a962-abe775538b48"
                    src="https://analytics.kastelapp.com/umami.js"></Script>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
            </Head>
            <NavBar/>
            <Component {...pageProps}/>
        </ChakraProvider>
    )
}

export default MyApp
