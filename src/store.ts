import create from "zustand";
import { v4 as uuid } from "uuid";

const loadTrips = (): Record<string, Destination[]> => {
    try {
        const stored = localStorage.getItem("weather_trips");
        if (!stored) return {};
        const parsed = JSON.parse(stored);
        for (const trip of Object.values(parsed) as Destination[][]) {
            for (const dest of trip) {
                dest.fromDate = new Date(dest.fromDate);
                dest.toDate = new Date(dest.toDate);
            }
        }
        return parsed;
    } catch (e) {
        console.error("Failed to load trips", e);
        return {};
    }
};


const saveToLocalStorage = (
    trips: Record<string, Destination[]>,
    currentTripName: string | null
) => {
    try {
        localStorage.setItem("weather_trips", JSON.stringify(trips));
        if (currentTripName) {
            localStorage.setItem("weather_current_trip", currentTripName);
        } else {
            localStorage.removeItem("weather_current_trip");
        }
    } catch (e) {
        console.error("Failed to save to local storage", e);
    }
};

const initialTrips = loadTrips();

export const useStore = create<State & Actions>((set) => ({
    destinations: [],
    trips: initialTrips,
    currentTripName: null,
    tempScale: "C",
    colorMode: "dark",
    toggleColorMode: () => set((state) => ({ colorMode: state.colorMode === "light" ? "dark" : "light" })),
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
        set((state) => {
            const newState = { destinations };
            if (state.currentTripName) {
                const updatedTrips = { ...state.trips, [state.currentTripName]: destinations };
                saveToLocalStorage(updatedTrips, state.currentTripName);
                return { ...newState, trips: updatedTrips };
            }
            return newState;
        }),
    addDestination: (destination: Destination) =>
        set((state) => {
            const newDestinations = [...state.destinations, { ...destination, id: uuid() }];
            if (state.currentTripName) {
                const updatedTrips = { ...state.trips, [state.currentTripName]: newDestinations };
                saveToLocalStorage(updatedTrips, state.currentTripName);
                return { destinations: newDestinations, trips: updatedTrips };
            }
            return { destinations: newDestinations };
        }),
    removeDestination: (destination: Destination | string) =>
        set((state) => {
            const newDestinations = state.destinations.filter(
                (d) =>
                    d.id !==
                    (typeof destination === "string"
                        ? destination
                        : destination.id)
            );
            if (state.currentTripName) {
                const updatedTrips = { ...state.trips, [state.currentTripName]: newDestinations };
                saveToLocalStorage(updatedTrips, state.currentTripName);
                return { destinations: newDestinations, trips: updatedTrips };
            }
            return { destinations: newDestinations };
        }),
    clearDestinations: () =>
        set((state) => {
            if (state.currentTripName) {
                 const updatedTrips = { ...state.trips, [state.currentTripName]: [] };
                 saveToLocalStorage(updatedTrips, state.currentTripName);
                 return { destinations: [], trips: updatedTrips };
            }
            return { destinations: [] };
        }),
    saveTrip: (name: string) =>
        set((state) => {
            const updatedTrips = { ...state.trips, [name]: state.destinations };
            saveToLocalStorage(updatedTrips, name);
            return { trips: updatedTrips, currentTripName: name };
        }),
    loadTrip: (name: string) =>
        set((state) => {
            if (state.trips[name]) {
                saveToLocalStorage(state.trips, name);
                return { destinations: state.trips[name], currentTripName: name };
            }
            return state;
        }),
    deleteTrip: (name: string) =>
        set((state) => {
            const updatedTrips = { ...state.trips };
            delete updatedTrips[name];
            const isCurrent = state.currentTripName === name;
            saveToLocalStorage(updatedTrips, isCurrent ? null : state.currentTripName);
            return {
                trips: updatedTrips,
                ...(isCurrent && { currentTripName: null })
            };
        }),
    startFresh: () =>
        set((state) => {
            saveToLocalStorage(state.trips, null);
            return { destinations: [], currentTripName: null };
        }),
}));

export default useStore;

type State = {
    destinations: Destination[];
    trips: Record<string, Destination[]>;
    currentTripName: string | null;
    tempScale: "C" | "F" | "K";
    colorMode: "light" | "dark";
    forecasts: Map<string, { [date: string]: Forecast }>;
};

type Actions = {
    switchTempScale: () => void;
    toggleColorMode: () => void;
    addDestination: (destination: Destination) => void;
    addForecast: (
        coords: { lat: number; lon: number },
        forecast: { [date: string]: Forecast }
    ) => void;
    removeDestination: (destination: Destination) => void;
    clearDestinations: () => void;
    setDestinations: (destinations: Destination[]) => void;
    saveTrip: (name: string) => void;
    loadTrip: (name: string) => void;
    deleteTrip: (name: string) => void;
    startFresh: () => void;
};
