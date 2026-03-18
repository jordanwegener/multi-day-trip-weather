import { Box, Button, IconButton, Typography } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useMemo } from "react";
import useStore from "../store";

import { TripPersistenceControls } from "./TripPersistenceControls";

export const Header = () => {
    const { tempScale, switchTempScale, colorMode, toggleColorMode } = useStore();
    const tagline = useMemo(generateTagline, []);
    return (
        <Box
            className="glass-panel"
            sx={{
                width: "100%",
                maxWidth: "100vw",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingRight: "10%",
                paddingLeft: "10%",
                boxSizing: "border-box",
                borderRadius: 0,
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <TripPersistenceControls />
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant={"h4"} className="text-gradient">TRIPCAST</Typography>
                <Typography variant={"h6"} color="text.secondary">
                    {tagline}
                </Typography>
            </Box>
            <Box display={"flex"} gap={2} alignItems={"center"}>
                <IconButton onClick={toggleColorMode} color="inherit" sx={{ border: "2px solid", borderColor: "divider" }}>
                    {colorMode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={switchTempScale}
                    sx={{ 
                        width: 220, 
                        fontSize: 22, 
                        gap: 1, 
                        borderWidth: 2,
                        "&:hover": { borderWidth: 2 }
                    }}
                >
                    Temp Scale:
                    <span style={{ fontWeight: 600 }}>°{tempScale}</span>
                </Button>
            </Box>
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
