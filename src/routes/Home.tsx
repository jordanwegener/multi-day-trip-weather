import { Box } from "@mui/material";
import AddDestination from "../components/NewDestination";
import DisplayDestinations from "../components/DisplayDestinations";
import { Header } from "../components/Header";

export function Home() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                minHeight: "100vh",
                paddingBottom: "50px",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: { xs: 4, md: 6 },
                boxSizing: "border-box",
            }}
        >
            <Header />
            <AddDestination />
            <DisplayDestinations />
        </Box>
    );
}
