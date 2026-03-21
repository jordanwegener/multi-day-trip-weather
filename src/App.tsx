import "./App.css";
import { useMemo, useEffect } from "react";
import useStore from "./store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/Home";
import { createTheme, ThemeProvider } from "@mui/material";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    // {
    //     path: "/trip/:tripId",
    //     element: <Trip />,
    // },
]);

function App() {
    const { colorMode } = useStore();

    useEffect(() => {
        const root = document.documentElement;
        // This is a crucial property for extensions like Night Eye/Dark Reader
        // to understand our site supports both modes and which one is active.
        root.style.colorScheme = colorMode;

        if (colorMode === "light") {
            root.style.setProperty("--primary", "#4338ca"); // Darker Indigo
            root.style.setProperty("--secondary", "#7e22ce"); // Darker Purple
            root.style.setProperty("--bg-dark", "#f1f5f9");
            root.style.setProperty("--glass-bg", "rgba(255, 255, 255, 0.85)");
            root.style.setProperty("--glass-border", "rgba(0, 0, 0, 0.1)");
            root.style.setProperty("--text-main", "#0f172a");
            root.style.setProperty("--text-muted", "#475569");
        } else {
            root.style.setProperty("--primary", "#818cf8"); // Lighter Indigo
            root.style.setProperty("--secondary", "#c084fc"); // Lighter Purple
            root.style.setProperty("--bg-dark", "#0f172a");
            root.style.setProperty("--glass-bg", "rgba(30, 41, 59, 0.7)");
            root.style.setProperty("--glass-border", "rgba(255, 255, 255, 0.1)");
            root.style.setProperty("--text-main", "#f8fafc");
            root.style.setProperty("--text-muted", "#94a3b8");
        }
    }, [colorMode]);

    // Update color mode if system preference changes and user hasn't set an override
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            const hasUserPreference = localStorage.getItem("tripcast_theme");
            if (!hasUserPreference) {
                // If the user hasn't explicitly set a theme, follow the system
                const { colorMode: currentMode, toggleColorMode } = useStore.getState();
                const newSystemMode = e.matches ? "dark" : "light";
                if (currentMode !== newSystemMode) {
                   // We don't use toggleColorMode here because it saves to localStorage
                   // We might want a 'setColorMode' action if we want to follow system exactly.
                   // For now, let's just use the store's set method directly or add an action.
                   useStore.setState({ colorMode: newSystemMode });
                }
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: colorMode,
            primary: {
                main: colorMode === "dark" ? "#818cf8" : "#4338ca",
            },
            secondary: {
                main: colorMode === "dark" ? "#c084fc" : "#7e22ce",
            },
            background: {
                default: colorMode === "dark" ? "#0f172a" : "#f1f5f9",
                paper: colorMode === "dark" ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
            },
            text: {
                primary: colorMode === "dark" ? "#f8fafc" : "#0f172a",
                secondary: colorMode === "dark" ? "#94a3b8" : "#475569",
            },
        },
        typography: {
            fontFamily: [
                "Inter",
                "-apple-system",
                "BlinkMacSystemFont",
                "sans-serif",
            ].join(","),
            h4: {
                fontFamily: "Outfit",
                fontWeight: 800,
            },
            h5: {
                fontFamily: "Outfit",
                fontWeight: 600,
            },
            h6: {
                fontFamily: "Outfit",
                fontWeight: 400,
            },
        },
        components: {
            MuiButton: {
                defaultProps: {
                    size: "large",
                },
                styleOverrides: {
                    root: {
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: "16px",
                        backgroundImage: "none",
                    },
                },
            },
        },
    }), [colorMode]);

    return (
        <ThemeProvider theme={theme}>
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    width: "100vw",
                    backgroundColor: theme.palette.background.default,
                    transition: "background-color 0.3s ease",
                    zIndex: -100,
                }}
            />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
