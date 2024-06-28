import { useEffect } from "react";
import { useRouter } from "next/router";
import '../styles/globals.css';
import Head from 'next/head';


export default function App({ Component, pageProps }) {
    return <>
        <Head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <html lang="ja" />
        </Head>
        <Component {...pageProps} />
    </>;
}