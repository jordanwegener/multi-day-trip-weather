// Description: Types for the application

export interface Destination {
    id: number;
    name: string;
    gpsCoords: {
        lat: number;
        lon: number;
    };
    description: string;
}