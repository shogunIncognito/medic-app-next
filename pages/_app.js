import Dashboard from "../layout/Dashboard"
import Head from "next/head"
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Spinner from "../components/Spinner";

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const DOMLoaded = useState(false); // This is a hack to prevent the theme from flashing on page load. It's not a perfect solution, but it's better than nothing.
    const [loading, setLoading] = useState(false);

    const [mode, setMode] = useState('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const themeMode = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    useEffect(() => {
        DOMLoaded[1](true);
        const getTheme = localStorage.getItem('MUIThemeMode');
        if (getTheme) {
            setMode(getTheme);
        }

        router.events.on('routeChangeStart', () => setLoading(true));
        router.events.on('routeChangeComplete', () => setLoading(false));
        router.events.on('routeChangeError', () => setLoading(false));
    }, [])

    return (
        DOMLoaded[0] && (
            <>
                <Head>
                    <title>MedicApp</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />

                </Head>
                <ThemeProvider theme={themeMode}>
                    {
                        ['/login', '/_error'].includes(router.pathname)
                            ? <Component {...pageProps} />
                            :
                            <Dashboard changeTheme={colorMode} theme={themeMode}>
                                {loading ? <Spinner minHeight="80vh" /> : <Component {...pageProps} />}
                            </Dashboard>
                    }
                </ThemeProvider>
            </>
        )
    )
}