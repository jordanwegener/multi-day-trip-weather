import { useRef, useState } from "react";
import { Box, Card, Typography, Stack, Divider, IconButton, Tooltip } from "@mui/material";
import { useTempScaler } from "../hooks/useTempScaler";
import { Shower, TrendingUp, TrendingDown, ContentCopy, Image, Check } from "@mui/icons-material";
import { toPng } from "html-to-image";
import useStore from "../store";
import dayjs from "dayjs";

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

    const handleCopyImage = async () => {
        if (!cardRef.current) return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                backgroundColor: "transparent",
                style: {
                    borderRadius: "16px",
                    background: colorMode === "dark" 
                        ? "rgba(15, 23, 42, 0.95)" 
                        : "rgba(255, 255, 255, 0.95)",
                }
            });
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            
            setCopyStatus("image");
            setTimeout(() => setCopyStatus("none"), 2000);
        } catch (err) {
            console.error("Failed to copy image: ", err);
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
                    <Tooltip title={copyStatus === "image" ? "Copied!" : "Copy as Image"}>
                        <IconButton size="small" onClick={handleCopyImage} sx={{ color: "text.secondary", "&:hover": { color: "primary.main", background: "rgba(0,0,0,0.05)" } }}>
                            {copyStatus === "image" ? <Check fontSize="small" /> : <Image fontSize="small" />}
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
        </Card>
    );
};

export default TripSummary;
