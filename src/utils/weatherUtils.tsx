import {
    AcUnit,
    QuestionMark,
    SevereCold,
    Shower,
    SoupKitchen,
    Thunderstorm,
    WbCloudy,
    WbSunny,
} from "@mui/icons-material";
import React from "react";

export const dayAt = (n: number) =>
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][n];

export const interpretWeathercode = (code: number | undefined) => {
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
