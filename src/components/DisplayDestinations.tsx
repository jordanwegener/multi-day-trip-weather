import { Box, Card, Typography } from "@mui/material";
import DestinationCard from "./DestinationCard";
import { useForecast } from "../hooks/useForecast";
import useStore from "../store";
import TripSummary from "./TripSummary";

function DisplayDestinations() {
    const { destinations, colorMode } = useStore();
    const forecast = useForecast(destinations);
    console.log(forecast);
    return (
        <Card
            elevation={colorMode === "dark" ? 0 : 4}
            className={colorMode === "dark" ? "glass-panel" : ""}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "2500px",
                width: { xs: "95%", sm: "90%", md: "80%" },
                margin: "0 auto",
                gap: { xs: 5, md: 10 },
                minHeight: "150px",
                bgcolor: "background.paper",
            }}
        >
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width="100%"
                gap={3}
                padding={5}
                boxSizing="border-box"
            >
                <Typography
                    variant="h4"
                    className="text-gradient"
                    sx={{
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    My Trip
                </Typography>

                {forecast.length > 0 && <TripSummary forecast={forecast} />}

                <Box
                    sx={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        width: "100%",
                        maxHeight: "60vh",
                    }}
                >
                    {forecast.length ? (
                        forecast.map((destination) => (
                            <DestinationCard
                                key={destination.id}
                                destination={destination}
                            />
                        ))
                    ) : (
                        <Typography variant="h5" color="text.secondary" fontWeight="300">
                            Add a destination to get started
                        </Typography>
                    )}
                </Box>
            </Box>
        </Card>
    );
}

export default DisplayDestinations;
