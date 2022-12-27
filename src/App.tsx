import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./routes/Home";
import { createTheme, Theme, ThemeProvider } from "@mui/material";
import Background from "./assets/images/background.jpg";

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

const theme = createTheme({
    typography: {
        fontFamily: [
            "Open Sans",
            "-apple-system",
            "BlinkMacSystemFont",
            "sans-serif",
        ].join(","),
    },
    components: {
        MuiButton: {
            defaultProps: {
                size: "large",
            },
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url(${Background})`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    opacity: 0.5,
                    zIndex: -100,
                }}
            />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
