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
    const timeoutRef = useRef<NodeJS.Timer | null>(null);

    useEffect(() => {
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
            });
        }, 1000);
    }, [query]);

    return { query, setQuery, results: geocodeResults.get(query) };
};

const fetchPlaceList: (query: string) => Promise<GeocodedPlace[]> = (
    query: string
) => {
    return new Promise<GeocodedPlace[]>(async (resolve, reject) => {
        const endpointUri =
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            query +
            ".json?proximity=ip&types=place&access_token=" +
            process.env.REACT_APP_MAPBOX_API_KEY;
        const result = await axios.get<{ features: ApiPlace[] }>(endpointUri);
        if (result.data.features) {
            const data = result.data.features.map(
                ({
                    place_name,
                    geometry: {
                        coordinates: [lon, lat],
                    },
                }) => ({
                    id: uuid(),
                    label: place_name,
                    coordinates: { lat, lon },
                })
            );
            resolve(data);
        }
        reject("Dun goof'd");
    });
};

type ApiPlace = {
    place_name: string;
    geometry: {
        coordinates: [number, number];
    };
};
