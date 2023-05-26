"use client";

// The app directory must include a root layout.
// The root layout must define <html>, and <body> tags since Next.js does not automatically create them
// The root layout replaces the pages/_app.tsx and pages/_document.tsx files.

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactQueryProvider } from "components/provider";
import theme from "styles/theme";
import axios from "axios";

import { Header } from "components/layout";
import "styles/globals.css";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <ReactQueryProvider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <body>
                        <Header />
                        {children}
                    </body>
                </ThemeProvider>
            </ReactQueryProvider>
        </html>
    );
}
