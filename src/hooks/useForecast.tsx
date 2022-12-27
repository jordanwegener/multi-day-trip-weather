import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import useStore from "../store";

export const useForecast = (trip: Destination[]) => {
    const { forecasts, addForecast } = useStore();
    const createCoordString = ({ lat, lon }: { lat: number; lon: number }) =>
        `${lat.toFixed(2)},${lon.toFixed(2)}`;

    const getResults = (coords: { lat: number; lon: number }) => {
        const queryString =
            "https://api.open-meteo.com/v1/forecast?latitude=" +
            coords.lat.toFixed(2) +
            "&longitude=" +
            coords.lon.toFixed(2) +
            "&daily=temperature_2m_max,temperature_2m_min,weathercode" +
            "&timezone=Europe%2FLondon";

        axios.get(queryString).then((res) => {
            if (!res.data?.daily?.time?.length) {
                console.error("Failed to fetch OpenMeteo data.");
                return;
            }
            const data = res.data as {
                daily: {
                    time: Weekly<string>;
                    temperature_2m_max: Weekly<number>;
                    temperature_2m_min: Weekly<number>;
                    weathercode: Weekly<number>;
                };
            };

            const formattedData: { [date: string]: Forecast } = {};

            for (let i = 0; i < 7; i++) {
                formattedData[data.daily.time[i]] = {
                    weathercode: data.daily.weathercode[i],
                    tempMin: data.daily.temperature_2m_min[i],
                    tempMax: data.daily.temperature_2m_max[i],
                };
            }

            addForecast(coords, formattedData);
        });
    };

    useEffect(() => {
        for (const destination of trip) {
            const { coords } = destination;
            const coordString = createCoordString(coords);
            if (forecasts.has(coordString)) {
                continue;
            }
            getResults(coords);
        }
    }, [trip, forecasts]);

    const tripWithForecasts = useMemo(() => {
        const destinationsWithData: DestinationWithData[] = [];
        for (const destination of trip) {
            const { fromDate, toDate } = destination;
            const dateArray: string[] = [];
            const numDays =
                Math.round((toDate.getTime() - fromDate.getTime()) / 86.4e6) +
                1;
            for (let i = 0; i < numDays; i++) {
                const [date] = new Date(fromDate.getTime() + 86.4e6 * (i + 1))
                    .toISOString()
                    .split("T");
                dateArray.push(date);
            }
            destinationsWithData.push({
                ...destination,
                forecasts: dateArray.map((date) => {
                    const locationForecast = forecasts.get(
                        createCoordString(destination.coords)
                    );
                    if (
                        !locationForecast ||
                        !locationForecast.hasOwnProperty(date)
                    ) {
                        return null;
                    }
                    return { date, ...locationForecast[date] };
                }),
            });
        }
        return destinationsWithData;
    }, [trip, forecasts]);

    return tripWithForecasts;
};
