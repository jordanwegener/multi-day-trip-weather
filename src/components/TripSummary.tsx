import { Box, Card, Typography, Stack, Divider } from "@mui/material";
import { useTempScaler } from "../hooks/useTempScaler";
import { Shower, TrendingUp, TrendingDown } from "@mui/icons-material";

interface TripSummaryProps {
    forecast: DestinationWithData[];
}

const RAIN_CODES = new Set([
    51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99
]);

const TripSummary = ({ forecast }: TripSummaryProps) => {
    const scaleTemp = useTempScaler();

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

    const hasData = stats.highestHigh !== -Infinity;

    if (!hasData) return null;

    return (
        <Card
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
            }}
        >
            <Typography variant="h6" sx={{ opacity: 0.8, fontWeight: 700, letterSpacing: 0.5 }}>
                Trip Highlights
            </Typography>
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
