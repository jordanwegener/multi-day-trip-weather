import axios from "axios";
import { useEffect, useMemo } from "react";
import useStore from "../store";

export const useForecast = (trip: Destination[]) => {
    const { forecasts, addForecast } = useStore();
    const createCoordString = ({ lat, lon }: { lat: number; lon: number }) =>
        `${lat.toFixed(2)},${lon.toFixed(2)}`;

    useEffect(() => {
        const getResults = (coords: { lat: number; lon: number }) => {
            const queryString =
                "https://api.open-meteo.com/v1/forecast?latitude=" +
                coords.lat.toFixed(2) +
                "&longitude=" +
                coords.lon.toFixed(2) +
                "&daily=temperature_2m_max,temperature_2m_min,weathercode" +
                "&timezone=auto&past_days=14&forecast_days=16";

            axios.get(queryString).then((res) => {
                if (!res.data?.daily?.time?.length) {
                    console.error("Failed to fetch OpenMeteo data.");
                    return;
                }
                const data = res.data.daily;
                const formattedData: { [date: string]: any } = {};

                for (let i = 0; i < data.time.length; i++) {
                    formattedData[data.time[i]] = {
                        weathercode: data.weathercode[i],
                        tempMin: data.temperature_2m_min[i],
                        tempMax: data.temperature_2m_max[i],
                    };
                }

                addForecast(coords, formattedData);
            }).catch(e => console.error("Error fetching forecast:", e));
        };

        for (const destination of trip) {
            const { coords } = destination;
            const coordString = createCoordString(coords);
            if (forecasts.has(coordString)) {
                continue;
            }
            getResults(coords);
        }
    }, [trip, forecasts, addForecast]);

    const tripWithForecasts = useMemo(() => {
        const destinationsWithData: DestinationWithData[] = [];
        for (const destination of trip) {
            const { fromDate, toDate } = destination;
            const dateArray: string[] = [];
            const numDays =
                Math.round((toDate.getTime() - fromDate.getTime()) / 86.4e6) +
                1;
            for (let i = 0; i < numDays; i++) {
                const tempDate = new Date(fromDate);
                tempDate.setDate(tempDate.getDate() + i);
                
                const yyyy = tempDate.getFullYear();
                const mm = String(tempDate.getMonth() + 1).padStart(2, '0');
                const dd = String(tempDate.getDate()).padStart(2, '0');
                
                dateArray.push(`${yyyy}-${mm}-${dd}`);
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
