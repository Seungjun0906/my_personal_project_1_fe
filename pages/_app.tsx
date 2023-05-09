import { Header } from "components/layout";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import theme from "styles/theme";
import "styles/globals.css";

/* eslint-disable react/jsx-props-no-spreading */

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
                <Component {...pageProps} />
            </ThemeProvider>
        </>
    );
}
