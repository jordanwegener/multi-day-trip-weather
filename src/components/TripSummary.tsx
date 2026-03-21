import { useRef, useState } from "react";
import { Box, Card, Typography, Stack, Divider, IconButton, Tooltip } from "@mui/material";
import { useTempScaler } from "../hooks/useTempScaler";
import { Shower, TrendingUp, TrendingDown, ContentCopy, OpenInNew, Check } from "@mui/icons-material";
import { toPng } from "html-to-image";
import useStore from "../store";
import dayjs from "dayjs";
import { interpretWeathercode } from "../utils/weatherUtils";


interface TripSummaryProps {
    forecast: DestinationWithData[];
}

const RAIN_CODES = new Set([
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99
]);

const TripSummary = ({ forecast }: TripSummaryProps) => {
    const { currentTripName, colorMode } = useStore();
    const scaleTemp = useTempScaler();
    const [copyStatus, setCopyStatus] = useState<"none" | "text" | "image">("none");
    const cardRef = useRef<HTMLDivElement>(null);
    const fullExportRef = useRef<HTMLDivElement>(null);

    const stats = forecast.reduce(
        (acc, dest) => {
            dest.forecasts.forEach((f) => {
                if (f) {
                    acc.highestHigh = Math.max(acc.highestHigh, f.tempMax);
                    acc.lowestLow = Math.min(acc.lowestLow, f.tempMin);
                    if (RAIN_CODES.has(f.weathercode)) {
                        acc.rainyDates.add(f.date);
                    }
                }
            });
            return acc;
        },
        {
            highestHigh: -Infinity,
            lowestLow: Infinity,
            rainyDates: new Set<string>(),
        }
    );

    const handleCopyText = async () => {
        const tripTitle = currentTripName ? `Trip: ${currentTripName}` : "Trip Summary";
        const destinationsText = forecast.map((d, i) => {
            const dates = `${dayjs(d.fromDate).format("MMM D")} - ${dayjs(d.toDate).format("MMM D")}`;
            const temps = d.forecasts[0] ? `High ${scaleTemp(d.forecasts[0].tempMax)} / Low ${scaleTemp(d.forecasts[0].tempMin)}` : "No weather data";
            return `[${i + 1}] ${d.name} (${dates})\n    ${temps}${d.notes ? `\n    Notes: ${d.notes}` : ""}`;
        }).join("\n---\n");

        const summaryText = `Summary:\n- Highest High: ${scaleTemp(stats.highestHigh)}\n- Lowest Low: ${scaleTemp(stats.lowestLow)}\n- Rainy Days: ${stats.rainyDates.size}\n- Generated via TripCast`;

        const fullText = `${tripTitle}\n\n${destinationsText}\n\n${summaryText}`;

        try {
            await navigator.clipboard.writeText(fullText);
            setCopyStatus("text");
            setTimeout(() => setCopyStatus("none"), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleOpenImage = async () => {
        if (!fullExportRef.current) return;

        try {
            const dataUrl = await toPng(fullExportRef.current, {
                backgroundColor: "transparent",
                style: {
                    borderRadius: "16px",
                    background: colorMode === "dark" 
                        ? "#0f172a" 
                        : "#ffffff",
                    padding: "24px",
                    width: "800px", // Fixed width for better export consistency
                }
            });
            
            const newTab = window.open();
            if (newTab) {
                newTab.document.write(`
                    <html>
                        <head>
                            <title>${currentTripName || "Trip Summary"}</title>
                            <style>
                                body { 
                                    margin: 0; 
                                    display: flex; 
                                    justify-content: center; 
                                    align-items: center; 
                                    min-height: 100vh; 
                                    padding: 20px;
                                    background-color: ${colorMode === "dark" ? "#0f172a" : "#f1f5f9"}; 
                                    font-family: sans-serif;
                                }
                                img { 
                                    max-width: 100%; 
                                    height: auto; 
                                    border-radius: 12px; 
                                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                                }
                                .controls {
                                    position: fixed;
                                    top: 10px;
                                    right: 10px;
                                    color: ${colorMode === "dark" ? "#ffffff" : "#000000"};
                                    background: rgba(128,128,128,0.2);
                                    padding: 5px 10px;
                                    border-radius: 5px;
                                    font-size: 12px;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="controls">Generated Image - Right click to save</div>
                            <img src="${dataUrl}" alt="Trip Summary" />
                        </body>
                    </html>
                `);
                newTab.document.close();
            }

            setCopyStatus("image");
            setTimeout(() => setCopyStatus("none"), 2000);
        } catch (err) {
            console.error("Failed to open image: ", err);
        }
    };

    const hasData = stats.highestHigh !== -Infinity;

    if (!hasData) return null;

    return (
        <Card
            ref={cardRef}
            className="sub-glass"
            sx={{
                width: "100%",
                padding: { xs: 2, md: 3 },
                marginBottom: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                position: "relative",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 0.5 }}>
                    Trip Highlights
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" sx={{ opacity: 0.6, fontStyle: "italic", display: { xs: "none", sm: "block" } }}>
                        want to send this to someone?
                    </Typography>
                    <Tooltip title={copyStatus === "text" ? "Copied!" : "Copy as Text"}>
                        <IconButton size="small" onClick={handleCopyText} sx={{ color: "text.secondary", "&:hover": { color: "primary.main", background: "rgba(0,0,0,0.05)" } }}>
                            {copyStatus === "text" ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={copyStatus === "image" ? "Opened!" : "Open as Image"}>
                        <IconButton size="small" onClick={handleOpenImage} sx={{ color: "text.secondary", "&:hover": { color: "primary.main", background: "rgba(0,0,0,0.05)" } }}>
                            {copyStatus === "image" ? <Check fontSize="small" /> : <OpenInNew fontSize="small" />}
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 4 }}
                divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" }, borderColor: "rgba(255, 255, 255, 0.1)" }} />}
                justifyContent="space-around"
                alignItems="center"
            >
                <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <TrendingUp sx={{ color: "#fca5a5" }} />
                        <Typography variant="body2" color="text.secondary">Highest High</Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#fca5a5" }}>
                        {scaleTemp(stats.highestHigh)}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <TrendingDown sx={{ color: "#93c5fd" }} />
                        <Typography variant="body2" color="text.secondary">Lowest Low</Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#93c5fd" }}>
                        {scaleTemp(stats.lowestLow)}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "center", flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <Shower sx={{ color: "#7dd3fc" }} />
                        <Typography variant="body2" color="text.secondary">Rainy Days</Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#7dd3fc" }}>
                        {stats.rainyDates.size}
                    </Typography>
                </Box>
            </Stack>

            {/* Hidden Export Layout */}
            <Box style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                <Box ref={fullExportRef} sx={{ 
                    width: "800px", 
                    bgcolor: colorMode === "dark" ? "#0f172a" : "#ffffff",
                    color: colorMode === "dark" ? "#f8fafc" : "#0f172a",
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                            {currentTripName || "Trip Summary"}
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.7 }}>
                            Multi-day weather forecast summary
                        </Typography>
                    </Box>

                    <Divider sx={{ opacity: 0.2 }} />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Trip Highlights</Typography>
                        <Stack direction="row" spacing={4} justifyContent="space-around">
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Max High</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#fca5a5" }}>{scaleTemp(stats.highestHigh)}</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Min Low</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#93c5fd" }}>{scaleTemp(stats.lowestLow)}</Typography>
                            </Box>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Rainy Days</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#7dd3fc" }}>{stats.rainyDates.size}</Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider sx={{ opacity: 0.2 }} />

                    <Box>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Destinations</Typography>
                        <Stack spacing={3}>
                            {forecast.map((d) => {
                                const validForecasts = d.forecasts.filter((f): f is Forecast & { date: string } => f !== null);
                                const highest = Math.max(...validForecasts.map(f => f.tempMax));
                                const lowest = Math.min(...validForecasts.map(f => f.tempMin));
                                const weatherCodes = Array.from(new Set(validForecasts.map(f => f.weathercode)));
                                
                                return (
                                    <Box key={d.id} sx={{ 
                                        padding: 2, 
                                        borderRadius: 2, 
                                        bgcolor: colorMode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                                        border: "1px solid rgba(255,255,255,0.1)"
                                    }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{d.name}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                                    {dayjs(d.fromDate).format("MMM D")} - {dayjs(d.toDate).format("MMM D")}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: "right" }}>
                                                <Typography sx={{ fontWeight: 700, color: "#fca5a5" }}>H: {scaleTemp(highest)}</Typography>
                                                <Typography sx={{ fontWeight: 700, color: "#93c5fd" }}>L: {scaleTemp(lowest)}</Typography>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, display: "block", opacity: 0.8 }}>
                                                Weather Summary
                                            </Typography>
                                            <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                                {weatherCodes.map(code => {
                                                    const { icon, label } = interpretWeathercode(code);
                                                    return (
                                                        <Stack key={code} direction="column" alignItems="center" spacing={0.2} sx={{ minWidth: 45 }}>
                                                            <Box sx={{ transform: "scale(0.65)", height: 24, width: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                {icon}
                                                            </Box>
                                                            <Typography variant="caption" sx={{ fontSize: "0.6rem", textAlign: "center", opacity: 0.8, lineHeight: 1 }}>
                                                                {label}
                                                            </Typography>
                                                        </Stack>
                                                    );
                                                })}
                                            </Stack>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </Box>

                    <Typography variant="caption" sx={{ mt: 2, opacity: 0.5, textAlign: "center" }}>
                        Generated by TripCast - tracking the sun (or lack thereof) across your entire route
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default TripSummary;
