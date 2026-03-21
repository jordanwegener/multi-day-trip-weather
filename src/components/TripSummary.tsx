import { useRef, useState } from "react";
import { Box, Card, Typography, Stack, Divider, IconButton, Tooltip } from "@mui/material";
import { useTempScaler } from "../hooks/useTempScaler";
import { TrendingUp, TrendingDown, ContentCopy, OpenInNew, Check, Umbrella } from "@mui/icons-material";
import { toPng } from "html-to-image";
import useStore from "../store";
import dayjs from "dayjs";
import { interpretWeathercode } from "../utils/weatherUtils";


interface TripSummaryProps {
    forecast: DestinationWithData[];
}

const PRECIPITATION_CODES = new Set([
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99
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
                    if (PRECIPITATION_CODES.has(f.weathercode)) {
                        acc.precipDates.add(f.date);
                    }
                }
            });
            return acc;
        },
        {
            highestHigh: -Infinity,
            lowestLow: Infinity,
            precipDates: new Set<string>(),
        }
    );

    const handleCopyText = async () => {
        const tripTitle = currentTripName ? `Trip: ${currentTripName}` : "Trip Summary";
        const destinationsText = forecast.map((d, i) => {
            const dates = `${dayjs(d.fromDate).format("MMM D")} - ${dayjs(d.toDate).format("MMM D")}`;
            const temps = d.forecasts[0] ? `High ${scaleTemp(d.forecasts[0].tempMax)} / Low ${scaleTemp(d.forecasts[0].tempMin)}` : "No weather data";
            return `[${i + 1}] ${d.name} (${dates})\n    ${temps}${d.notes ? `\n    Notes: ${d.notes}` : ""}`;
        }).join("\n---\n");

        const summaryText = `Summary:\n- Highest High: ${scaleTemp(stats.highestHigh)}\n- Lowest Low: ${scaleTemp(stats.lowestLow)}\n- Precipitation Days: ${stats.precipDates.size}\n- Generated via TripCast`;

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

        // Open the window immediately within the user-click event thread
        const newTab = window.open("", "_blank");
        if (!newTab) return;

        newTab.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>TripCast | Generating...</title>
                    <style>
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        .spinner {
                            width: 40px;
                            height: 40px;
                            border: 4px solid ${colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
                            border-top: 4px solid #6366f1;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 20px;
                        }
                    </style>
                </head>
                <body style="margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; background-color: ${colorMode === "dark" ? "#0f172a" : "#f1f5f9"}; font-family: sans-serif; color: ${colorMode === "dark" ? "#ffffff" : "#0f172a"}; text-align: center;">
                    <div id="loader">
                        <div class="spinner"></div>
                        <p id="status-msg" style="font-size: 1.1rem; font-weight: 500; margin-bottom: 0.5rem; opacity: 0.8;">Generating your summary image...</p>
                        <p style="font-size: 0.8rem; opacity: 0.5;">This will take just a moment</p>
                    </div>
                    <script>
                        const msg = document.getElementById('status-msg');
                        setTimeout(() => { if(msg) msg.innerText = 'Almost there, perfecting the layout...'; }, 3000);
                        setTimeout(() => { if(msg) msg.innerText = 'Still working, ensuring high quality...'; }, 6000);
                    </script>
                </body>
            </html>
        `);

        try {
            // Increase delay to ensure fonts are fully recognized in the render context
            await new Promise(r => setTimeout(r, 500));

            const dataUrl = await toPng(fullExportRef.current, {
                backgroundColor: colorMode === "dark" ? "#0f172a" : "#ffffff",
                quality: 1,
                pixelRatio: 2,
                cacheBust: true,
                style: {
                    margin: "0",
                    padding: "24px",
                    width: "800px",
                }
            });
            
            if (newTab) {
                const body = newTab.document.body;
                body.innerHTML = "";
                
                const container = newTab.document.createElement('div');
                container.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 40px; box-sizing: border-box;";
                
                const img = newTab.document.createElement('img');
                img.src = dataUrl;
                img.style.cssText = "max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 30px 60px rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.5s ease;";
                img.onload = () => { img.style.opacity = "1"; };
                
                const tip = newTab.document.createElement('p');
                tip.innerText = "Right click to save image";
                tip.style.cssText = "margin-top: 20px; font-size: 14px; opacity: 0.4;";

                container.appendChild(img);
                container.appendChild(tip);
                body.appendChild(container);
                newTab.document.title = `${currentTripName || "Trip Summary"} | TripCast`;
            }

            setCopyStatus("image");
            setTimeout(() => setCopyStatus("none"), 2000);
        } catch (err) {
            console.error("Image generation failed:", err);
            if (newTab) {
                newTab.document.body.innerHTML = `
                    <div style="text-align: center; padding: 40px; font-family: sans-serif;">
                        <h3 style="color: #ef4444;">Generation Failed</h3>
                        <p style="opacity: 0.7;">${err instanceof Error ? err.message : "The browser blocked image generation."}</p>
                        <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; border-radius: 8px; border: none; background: #6366f1; color: white; cursor: pointer;">Close Tab</button>
                    </div>
                `;
            }
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
                        <Umbrella sx={{ color: "#7dd3fc" }} />
                        <Typography variant="body2" color="text.secondary">Precipitation</Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#7dd3fc" }}>
                        {stats.precipDates.size}
                    </Typography>
                </Box>
            </Stack>

            {/* Hidden Export Layout - kept off-screen but active for rendering */}
            <Box style={{ position: 'fixed', left: '-10000px', top: '0', pointerEvents: 'none', zIndex: -9999 }}>
                <Box ref={fullExportRef} sx={{ 
                    width: "800px", 
                    bgcolor: colorMode === "dark" ? "#0f172a" : "#ffffff",
                    color: colorMode === "dark" ? "#f8fafc" : "#0f172a",
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    fontFamily: "Inter, sans-serif"
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
                                <Typography variant="caption" sx={{ opacity: 0.7 }}>Precipitation</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#7dd3fc" }}>{stats.precipDates.size}</Typography>
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
                                                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{d.name}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7, lineHeight: 1.2 }}>
                                                    {dayjs(d.fromDate).format("MMM D")} - {dayjs(d.toDate).format("MMM D")}
                                                </Typography>
                                            </Box>
                                            <Stack sx={{ textAlign: "right" }} spacing={0.2}>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: "#fca5a5", lineHeight: 1 }}>H: {scaleTemp(highest)}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: "#93c5fd", lineHeight: 1 }}>L: {scaleTemp(lowest)}</Typography>
                                            </Stack>
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
