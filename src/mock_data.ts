import { Destination } from "./types";

const mockData: Destination[] = [
  {
    id: 1,
    name: "Paris",
    gpsCoords: {
      lat: 48.856614,
      lon: 2.3522219
    },
    description: ""
  },
  {
    id: 2,
    name: "London",
    gpsCoords: {
      lat: 51.5073509,
      lon: -0.1277583
    },
    description: ""
  },
  {
    id: 3,
    name: "New York",
    gpsCoords: {
      lat: 40.7127753,
      lon: -74.0059728
    },
    description: ""
  },
  {
    id: 4,
    name: "Tokyo",
    gpsCoords: {
      lat: 35.6894875,
      lon: 139.6917064
    },
    description: ""
  }
];

export default mockData;