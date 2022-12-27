declare type Destination = {
    id: string;
    name: string;
    coords: {
        lat: number;
        lon: number;
    };
    fromDate: Date;
    toDate: Date;
};

declare type DestinationWithData = Destination & {
    forecasts: Array<(Forecast & { date: string }) | null>;
};

declare type Forecast = {
    tempMax: number;
    tempMin: number;
    weathercode: number;
};

declare type GeocodedPlace = {
    id: string;
    label: string;
    coordinates: { lat: number; lon: number };
};

declare type Weekly<T> = [T, T, T, T, T, T, T];

declare module "*.jpg";
