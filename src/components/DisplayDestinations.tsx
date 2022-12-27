import { Box, Card, Typography } from "@mui/material";
import DestinationCard from "./DestinationCard";
import { useForecast } from "../hooks/useForecast";
import useStore from "../store";

function DisplayDestinations() {
    const { destinations } = useStore();
    const forecast = useForecast(destinations);
    console.log(forecast);
    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "2500px",
                width: "80%",
                margin: "0 auto",
                gap: 10,
                borderRadius: 3,
                minHeight: "150px",
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
                    sx={{
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    My Trip
                </Typography>
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
                        <Typography variant="h5" color="#888" fontWeight="300">
                            Add a destination to get started
                        </Typography>
                    )}
                </Box>
            </Box>
        </Card>
    );
}

export default DisplayDestinations;
