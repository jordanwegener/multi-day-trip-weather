import create from "zustand";
import { v4 as uuid } from "uuid";

export const useStore = create<State & Actions>((set) => ({
    destinations: [],
    tempScale: "C",
    forecasts: new Map<string, { [date: string]: Forecast }>(),
    addForecast: (
        coords: { lat: number; lon: number },
        forecast: { [date: string]: Forecast }
    ) =>
        set(({ forecasts }) => ({
            forecasts: new Map(forecasts).set(
                `${coords.lat.toFixed(2)},${coords.lon.toFixed(2)}`,
                forecast
            ),
        })),
    switchTempScale: () =>
        set(({ tempScale }) => ({
            tempScale: tempScale === "C" ? "F" : tempScale === "F" ? "K" : "C",
        })),
    setDestinations: (destinations: Destination[]) =>
        set(() => ({ destinations })),
    addDestination: (destination: Destination) =>
        set(({ destinations }) => ({
            destinations: [...destinations, { ...destination, id: uuid() }],
        })),
    removeDestination: (destination: Destination | string) =>
        set(({ destinations }) => ({
            destinations: destinations.filter(
                (d) =>
                    d.id !==
                    (typeof destination === "string"
                        ? destination
                        : destination.id)
            ),
        })),
    clearDestinations: () => ({ destinations: [] }),
}));

export default useStore;

type State = {
    destinations: Destination[];
    tempScale: "C" | "F" | "K";
    forecasts: Map<string, { [date: string]: Forecast }>;
};

type Actions = {
    switchTempScale: () => void;
    addDestination: (destination: Destination) => void;
    addForecast: (
        coords: { lat: number; lon: number },
        forecast: { [date: string]: Forecast }
    ) => void;
    removeDestination: (destination: Destination) => void;
    clearDestinations: () => void;
};
