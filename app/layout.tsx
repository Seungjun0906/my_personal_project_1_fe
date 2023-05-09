"use client";

// The app directory must include a root layout.
// The root layout must define <html>, and <body> tags since Next.js does not automatically create them
// The root layout replaces the pages/_app.tsx and pages/_document.tsx files.

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "styles/theme";
import ReactQueryProvider from "app/ReactQueryProvider";
import { Header } from "components/layout";
import "styles/globals.css";

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <body>
                    <Header />
                    <ReactQueryProvider>{children}</ReactQueryProvider>
                </body>
            </ThemeProvider>
        </html>
    );
}
