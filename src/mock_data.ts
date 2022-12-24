import { Destination } from "./types";

const d1 = new Date();
const d2 = new Date(d1.getTime() + 86400000);
const d3 = new Date(d2.getTime() + 86400000);
const d4 = new Date(d3.getTime() + 86400000);

const mockData: Destination[] = [
  {
    id: 1,
    name: "Paris",
    gpsCoords: {
      lat: 48.856614,
      lon: 2.3522219
    },
    description: "",
    date: d1,
  },
  {
    id: 2,
    name: "London",
    gpsCoords: {
      lat: 51.5073509,
      lon: -0.1277583
    },
    description: "",
    date: d2,
  },
  {
    id: 3,
    name: "New York",
    gpsCoords: {
      lat: 40.7127753,
      lon: -74.0059728
    },
    description: "",
    date: d3,
  },
  {
    id: 4,
    name: "Tokyo",
    gpsCoords: {
      lat: 35.6894875,
      lon: 139.6917064
    },
    description: "",
    date: d4,
  }
];

export default mockData;