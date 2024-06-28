import { useEffect } from "react";
import { useRouter } from "next/router";
import '../styles/globals.css';


export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;

}