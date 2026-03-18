import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

/**
 * Timeout hook to avoid hitting the rate limit on my Mapbox account lol
 * - Fires search results only after the user stops typing
 * @returns `query` - the current user query
 * @returns `setQuery` - setState method to store the user query
 * @returns `results` - array of results for the current query
 */
export const useGeocoder = () => {
    const [query, setQuery] = useState("");
    const [geocodeResults, setGeocodeResults] = useState<
        Map<string, GeocodedPlace[]>
    >(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const timeoutRef = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
        if (query.length && !geocodeResults.has(query)) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            if (!query.length) {
                return;
            }
            if (geocodeResults.has(query)) {
                return;
            }
            fetchPlaceList(query).then((places) => {
                console.log(places);
                setGeocodeResults((prev) => new Map(prev).set(query, places));
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        }, 1000);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [query, geocodeResults]);

    return { query, setQuery, results: geocodeResults.get(query), isLoading };
};

const fetchPlaceList: (query: string) => Promise<GeocodedPlace[]> = async (
    query: string
) => {
    try {
        const endpointUri = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`;
        const result = await axios.get<{ results?: ApiPlace[] }>(endpointUri);
        
        if (result.data.results) {
            const data = result.data.results.map((place) => {
                const parts = [place.name, place.admin1, place.country].filter(Boolean);
                return {
                    id: uuid(),
                    label: parts.join(", "),
                    coordinates: { lat: place.latitude, lon: place.longitude },
                };
            });
            return data;
        }
        return [];
    } catch (e) {
        console.error("Geocoding failed", e);
        return [];
    }
};

type ApiPlace = {
    name: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    country?: string;
};
