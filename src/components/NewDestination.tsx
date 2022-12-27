import React, { useMemo, useState } from "react";
import { useStore } from "../store";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useGeocoder } from "../hooks/useGeocoder";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AddCircle } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { Dayjs } from "dayjs";

function NewDestination() {
    const { query, setQuery, results } = useGeocoder();
    const [selectedPlace, setSelectedPlace] = useState<GeocodedPlace | null>(
        null
    );
    const { addDestination } = useStore();
    const [destination, setDestination] = useState<CreateDestination>({
        name: "",
        coords: { lat: -1000, lon: -1000 },
        fromDate: null,
        toDate: null,
    });
    console.log(destination);

    const destinationIsValid = useMemo(
        () =>
            destination.name.length > 0 &&
            destination.coords.lat > -200 &&
            destination.coords.lon > -100 &&
            destination.fromDate !== null &&
            destination.toDate !== null,
        [destination]
    );

    return (
        <Card
            elevation={5}
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
                width: "80%",
                height: 150,
                borderRadius: 3,
                backgroundColor: "white",
            }}
        >
            <Typography variant={"h5"}>I'll be in</Typography>
            <Autocomplete
                sx={{ width: "20%" }}
                options={results || []}
                onInputChange={(_, value) => setQuery(value)}
                placeholder="Search for destination..."
                inputValue={query}
                value={selectedPlace}
                onChange={(_, value) => {
                    if (!value) {
                        return;
                    }
                    setSelectedPlace(value);
                    setDestination((prev) => ({
                        ...prev,
                        coords: value.coordinates,
                        name: value.label,
                    }));
                }}
                renderInput={(params) => <TextField {...params} />}
            />
            <Typography variant={"h5"}>from</Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    label="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    value={destination.fromDate}
                    onChange={(val) =>
                        setDestination((prev) => ({ ...prev, fromDate: val }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <Typography variant={"h5"}>until</Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                    label="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    value={destination.toDate}
                    onChange={(val) =>
                        setDestination((prev) => ({ ...prev, toDate: val }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <Button
                endIcon={<AddCircle />}
                color="primary"
                disabled={!destinationIsValid}
                onClick={() => {
                    if (destinationIsValid) {
                        addDestination({
                            id: uuid(),
                            name: destination.name,
                            coords: destination.coords,
                            fromDate: (destination.fromDate as Dayjs).toDate(),
                            toDate: (destination.toDate as Dayjs).toDate(),
                        });
                    }
                }}
                variant="contained"
                sx={{ fontSize: 22 }}
            >
                Add
            </Button>
        </Card>
    );
}

export default NewDestination;

type CreateDestination = {
    name: string;
    coords: { lat: number; lon: number };
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
};
