import {
    AcUnit,
    Delete,
    QuestionMark,
    SevereCold,
    Shower,
    SoupKitchen,
    Thunderstorm,
    WbCloudy,
    WbSunny,
} from "@mui/icons-material";
import { Box, Card, IconButton, Typography } from "@mui/material";
import { useStore } from "../store";
import { useTempScaler } from "../hooks/useTempScaler";
import { LoadingSpinner } from "./LoadingSpinner";
import { TempChart } from "./TempChart";

function DestinationCard({
    destination,
}: {
    destination: DestinationWithData;
}) {
    const TempScaler = useTempScaler();
    const { removeDestination } = useStore();
    return (
        <Box
            sx={{
                width: "100%",
            }}
        >
            <Box
                borderBottom={"1px solid #EEE"}
                paddingTop={3}
                paddingBottom={3}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    height={40}
                    gap={2}
                    marginBottom={3}
                    width="96%"
                >
                    <Box display="flex" gap="2" alignItems="center">
                        <IconButton
                            onClick={() => removeDestination(destination)}
                            sx={{ color: "#000" }}
                        >
                            <Delete sx={{ height: "30px", width: "30px" }} />
                        </IconButton>
                        <Typography
                            variant={"h5"}
                            sx={{
                                textAlign: "left",
                                paddingLeft: "12px",
                                fontWeight: 600,
                            }}
                        >
                            {destination.name}
                        </Typography>
                    </Box>
                    {destination.forecasts?.length ? (
                        <TempChart
                            tempsMax={destination.forecasts
                                .filter((f) => f !== null)
                                .map((dest) => dest!.tempMax)}
                            tempsMin={destination.forecasts
                                .filter((f) => f !== null)
                                .map((dest) => dest!.tempMin)}
                            style={{ width: "49.6%" }}
                        />
                    ) : null}
                </Box>

                {destination.forecasts.filter((f) => f !== null).length > 0 ? (
                    <>
                        {destination.forecasts.map((forecast) => {
                            if (forecast === null) return null;
                            const { icon, label } = interpretWeathercode(
                                forecast?.weathercode
                            );
                            return (
                                <Box
                                    display={"grid"}
                                    flexDirection={"row"}
                                    justifyContent={"space-between"}
                                    alignItems="center"
                                    gridTemplateColumns={"repeat(4,1fr)"}
                                    paddingTop={2}
                                    paddingBottom={2}
                                    gap={2}
                                    boxSizing="border-box"
                                    width="96%"
                                >
                                    <Card
                                        elevation={0}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "flex-start",
                                            gap: 2,
                                            padding: 2,
                                            height: "80%",
                                        }}
                                    >
                                        <Typography variant="h5">
                                            {dayAt(
                                                new Date(forecast.date).getDay()
                                            )}
                                            {", "}
                                            {new Date(
                                                forecast.date
                                            ).toLocaleDateString("en-GB", {
                                                month: "short",
                                                day: "2-digit",
                                            })}
                                        </Typography>
                                    </Card>

                                    <Card
                                        elevation={3}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            padding: 2,
                                            height: "80%",
                                        }}
                                    >
                                        {icon}
                                        <Typography variant="h5">
                                            {label}
                                        </Typography>
                                    </Card>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            padding: 2,
                                            height: "80%",
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{ color: "#009" }}
                                        >
                                            <TempScaler>
                                                {forecast.tempMin}
                                            </TempScaler>
                                        </Typography>
                                        <Typography variant="h5">
                                            Low
                                        </Typography>
                                    </Card>
                                    <Card
                                        elevation={3}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            padding: 2,
                                            height: "80%",
                                        }}
                                    >
                                        <Typography
                                            variant="h4"
                                            sx={{ color: "#900" }}
                                        >
                                            <TempScaler>
                                                {forecast.tempMax}
                                            </TempScaler>
                                        </Typography>
                                        <Typography variant="h5">
                                            High
                                        </Typography>
                                    </Card>
                                </Box>
                            );
                        })}
                    </>
                ) : (
                    <Box
                        width="100%"
                        height="80px"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LoadingSpinner />
                    </Box>
                )}
            </Box>
            {/* <Typography variant={"h6"}>Weather</Typography>
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"center"}
            >
                <Box
                    display={"flex"}
                    marginRight={5}
                    flexDirection={"column"}
                ></Box>
                 <Box marginBottom={6}>
                    <Typography>Wind: placeholder</Typography>
                    <Typography>Humidity: placeholder</Typography>
                </Box> 
            </Box> */}
        </Box>
    );
}

export default DestinationCard;

const dayAt = (n: number) =>
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n];

const interpretWeathercode = (code: number | undefined) => {
    switch (code) {
        case 0:
            return {
                label: "Sunny",
                icon: <WbSunny style={{ height: "36px", width: "36px" }} />,
            };
        case 1:
            return {
                label: "Mostly clear",
                icon: <WbSunny style={{ height: "36px", width: "36px" }} />,
            };
        case 2:
            return {
                label: "Partly cloudy",
                icon: <WbCloudy style={{ height: "36px", width: "36px" }} />,
            };
        case 3:
            return {
                label: "Overcast",
                icon: <WbCloudy style={{ height: "36px", width: "36px" }} />,
            };
        case 45:
        case 48:
            return {
                label: "Fog",
                icon: <SoupKitchen style={{ height: "36px", width: "36px" }} />,
            };
        case 51:
            return {
                label: "Slight drizzle",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 53:
            return {
                label: "Moderate drizzle",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 55:
            return {
                label: "Heavy drizzle",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 61:
            return {
                label: "Slight rain",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 63:
            return {
                label: "Moderate rain",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 65:
            return {
                label: "Heavy rain",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 71:
            return {
                label: "Light snow",
                icon: <AcUnit style={{ height: "36px", width: "36px" }} />,
            };
        case 73:
            return {
                label: "Moderate snow",
                icon: <AcUnit style={{ height: "36px", width: "36px" }} />,
            };
        case 75:
            return {
                label: "Heavy snow",
                icon: <AcUnit style={{ height: "36px", width: "36px" }} />,
            };
        case 77:
            return {
                label: "Snow",
                icon: <AcUnit style={{ height: "36px", width: "36px" }} />,
            };
        case 80:
            return {
                label: "Slight showers",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 81:
            return {
                label: "Moderate showers",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 82:
            return {
                label: "Heavy showers",
                icon: <Shower style={{ height: "36px", width: "36px" }} />,
            };
        case 85:
            return {
                label: "Light snow showers",
                icon: <AcUnit style={{ height: "36px", width: "36px" }} />,
            };
        case 86:
            return {
                label: "Heavy snow showers",
                icon: <AcUnit style={{ height: "36px", width: "36px" }} />,
            };
        case 95:
            return {
                label: "Thunderstorm",
                icon: (
                    <Thunderstorm style={{ height: "36px", width: "36px" }} />
                ),
            };
        case 96:
        case 99:
            return {
                label: "Hailstorm",
                icon: <SevereCold style={{ height: "36px", width: "36px" }} />,
            };
        default:
            return {
                label: "Unknown",
                icon: (
                    <QuestionMark style={{ height: "36px", width: "36px" }} />
                ),
            };
    }
};
