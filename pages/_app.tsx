import "../styles/globals.css";
import type { AppProps } from "next/app";

/* eslint-disable react/jsx-props-no-spreading */

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
