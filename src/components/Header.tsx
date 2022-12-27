import { Box, Button, Container, Typography } from "@mui/material";
import { useMemo } from "react";
import useStore from "../store";

export const Header = () => {
    const { tempScale, switchTempScale } = useStore();
    const tagline = useMemo(generateTagline, []);
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "100vw",
                backgroundColor: "#FFF",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingRight: "10%",
                paddingLeft: "10%",
                boxSizing: "border-box",
            }}
        >
            <div aria-hidden="true" style={{ width: "220px" }} />
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant={"h4"}>TRIPCAST</Typography>
                <Typography variant={"h6"} color="#777">
                    {tagline}
                </Typography>
            </Box>
            <Button
                variant="outlined"
                onClick={switchTempScale}
                sx={{ width: 220, fontSize: 22, gap: 1 }}
            >
                Temp Scale:
                <span style={{ fontWeight: 600 }}>°{tempScale}</span>
            </Button>
        </Box>
    );
};

function generateTagline() {
    const dice = Math.floor(Math.random() * 5);
    switch (dice) {
        case 0:
            return "the weather, wherever you're going";
        case 1:
            return "always take the weather with you";
        case 2:
            return "now with 100% more weather";
        case 3:
            return "weather, whether here or there";
        case 4:
            return "Sunny'); DROP TABLE users;--";
        default:
            return "the weather, wherever you're going";
    }
}
