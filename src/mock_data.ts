const [d1, d2, d3, d4] = Array.from(new Array(4).keys()).map(
    (n) => new Date(Date.now() + 86.4e6 * n)
);

const mockData: Destination[] = [
    {
        id: "1",
        name: "Paris",
        coords: {
            lat: 48.856614,
            lon: 2.3522219,
        },
        fromDate: d1,
        toDate: d1,
    },
    {
        id: "2",
        name: "London",
        coords: {
            lat: 51.5073509,
            lon: -0.1277583,
        },
        fromDate: d2,
        toDate: d2,
    },
    {
        id: "3",
        name: "New York",
        coords: {
            lat: 40.7127753,
            lon: -74.0059728,
        },
        fromDate: d3,
        toDate: d3,
    },
    {
        id: "4",
        name: "Tokyo",
        coords: {
            lat: 35.6894875,
            lon: 139.6917064,
        },
        fromDate: d4,
        toDate: d4,
    },
];

export default mockData;
