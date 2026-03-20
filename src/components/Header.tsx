import { Box, Button, IconButton, Typography, Tooltip } from "@mui/material";
import { LightMode, DarkMode, InfoOutlined as InfoIcon } from "@mui/icons-material";
import { useMemo, useState, useEffect } from "react";
import useStore from "../store";

import { TripPersistenceControls } from "./TripPersistenceControls";
import { HelpModal } from "./HelpModal";

export const Header = () => {
    const { tempScale, switchTempScale, colorMode, toggleColorMode } = useStore();
    const tagline = useMemo(generateTagline, []);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    useEffect(() => {
        const hasSeenHelp = localStorage.getItem("tripcast_help_seen");
        if (!hasSeenHelp) {
            setIsHelpOpen(true);
            localStorage.setItem("tripcast_help_seen", "true");
        }
    }, []);
    return (
        <Box
            className="glass-panel"
            sx={{
                width: "100%",
                maxWidth: "100vw",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "20px",
                paddingBottom: "20px",
                paddingRight: { xs: "5%", md: "10%" },
                paddingLeft: { xs: "5%", md: "10%" },
                gap: { xs: 2, md: 0 },
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
                <Tooltip title="How to use Tripcast">
                    <IconButton onClick={() => setIsHelpOpen(true)} color="primary" sx={{ border: "2px solid", borderColor: "divider" }}>
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
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
            <HelpModal open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </Box>
    );
};

const TAGLINES = [
    "the weather, wherever you're going",
    "always take the weather with you",
    "now with 100% more weather",
    "weather, whether here or there",
    "Sunny'); DROP TABLE users;--",
    "because packing for three climates is hard enough",
    "your road trip's third wheel",
    "for when your itinerary has commitment issues",
    "predicting rain from point A to point Z",
    "four cities, three climates, one suitcase",
    "every stop on your map, weather included",
    "we can't fix the traffic, but we can warn you about the hail",
    "the only thing changing faster than the scenery is the forecast",
    "helping you realize you packed the wrong jacket for stop 3",
    "your multi-city tour guide to meteorological disappointment",
    "from departure to destination, with all the clouds in between",
    "because mother nature doesn't care about your travel plans",
    "a forecast for every pit stop, detour, and turn around",
    "letting you know exactly when the road trip turns into a boat trip",
    "tracking the sun (or lack thereof) across your entire route",
    "so you know which layover requires an umbrella",
    "we check the weather so you can just drive",
    "whether you're flying, driving, or just clicking around the map",
    "seven stops, zero surprises... well, weather-wise at least",
    "the ultimate spoiler alert for your entire vacation",
    "we predict you'll still pack too many socks",
    "we also don't know what 'partly sunny' actually means",
];

function generateTagline() {
    return TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
}
