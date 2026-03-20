import React, { useMemo, useState } from "react";
import { useStore } from "../store";
import {
    Autocomplete,
    Card,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useGeocoder } from "../hooks/useGeocoder";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AddCircle, Edit, Cancel } from "@mui/icons-material";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

function NewDestination() {
    const { query, setQuery, results } = useGeocoder();
    const [selectedPlace, setSelectedPlace] = useState<GeocodedPlace | null>(
        null
    );
    const { addDestination, updateDestination, editingDestinationId, setEditingDestinationId, destinations, colorMode } = useStore();
    const newDestination = () => ({
        name: "",
        coords: { lat: -1000, lon: -1000 },
        fromDate: null,
        toDate: null,
    });
    const [destination, setDestination] =
        useState<CreateDestination>(newDestination);

    useEffect(() => {
        if (editingDestinationId) {
            const toEdit = destinations.find(d => d.id === editingDestinationId);
            if (toEdit) {
                setDestination({
                    name: toEdit.name,
                    coords: toEdit.coords,
                    fromDate: dayjs(toEdit.fromDate),
                    toDate: dayjs(toEdit.toDate)
                });
                setQuery(toEdit.name);
                setSelectedPlace({
                    id: toEdit.id,
                    label: toEdit.name,
                    coordinates: toEdit.coords
                });
            }
        }
    }, [editingDestinationId, destinations, setQuery]);

    const handleCancelEdit = () => {
        setEditingDestinationId(null);
        setDestination(newDestination());
        setQuery("");
        setSelectedPlace(null);
    };

    const destinationIsValid = useMemo(() => {
        if (!destination.name.length) return false;
        if (destination.coords.lat < -90) return false;
        if (destination.coords.lat > 90) return false;
        if (destination.coords.lon < -180) return false;
        if (destination.coords.lon > 180) return false;
        if (destination.fromDate === null) return false;
        if (destination.toDate === null) return false;
        return true;
    }, [destination]);

    return (
        <Card
            elevation={colorMode === "dark" ? 0 : 4}
            className={colorMode === "dark" ? "glass-panel" : ""}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 2, md: 5 },
                padding: { xs: 3, md: 0 },
                width: { xs: "95%", sm: "90%", md: "80%" },
                minHeight: 150,
                borderRadius: 3,
                boxSizing: "border-box",
                bgcolor: "background.paper",
                backdropFilter: colorMode === "dark" ? "blur(12px)" : "none",
            }}
        >
            <Typography variant={"h5"}>I'll be in</Typography>
            <Autocomplete
                sx={{ width: { xs: "100%", md: "20%" } }}
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
                <DatePicker
                    label="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    disablePast
                    value={destination.fromDate}
                    onChange={(val) =>
                        setDestination((prev) => ({ 
                            ...prev, 
                            fromDate: val,
                            toDate: prev.toDate === null || prev.toDate.isBefore(val) ? val : prev.toDate 
                        }))
                    }
                    renderInput={(params) => <TextField {...params} sx={{ width: { xs: "100%", md: "auto" } }} />}
                />
            </LocalizationProvider>

            <Typography variant={"h5"}>until</Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="DD/MM/YYYY"
                    inputFormat="DD/MM/YYYY"
                    disablePast
                    minDate={destination.fromDate || undefined}
                    value={destination.toDate}
                    onChange={(val) =>
                        setDestination((prev) => ({ ...prev, toDate: val }))
                    }
                    renderInput={(params) => <TextField {...params} sx={{ width: { xs: "100%", md: "auto" } }} />}
                />
            </LocalizationProvider>

            <IconButton
                disabled={!destinationIsValid}
                onClick={() => {
                    if (destinationIsValid) {
                        const fromDate = (destination.fromDate as Dayjs).toDate();
                        const toDate = (destination.toDate as Dayjs).toDate();
                        const destinationData = {
                            name: destination.name,
                            coords: destination.coords,
                            fromDate,
                            toDate,
                        };
                        
                        if (editingDestinationId) {
                            updateDestination(editingDestinationId, destinationData);
                            setEditingDestinationId(null);
                        } else {
                            addDestination({
                                id: uuid(),
                                ...destinationData
                            });
                        }
                        
                        // Set next destination's fromDate to the day after the current toDate
                        const nextDay = dayjs(toDate).add(1, "day");
                        setDestination({
                            ...newDestination(),
                            fromDate: nextDay,
                            toDate: nextDay
                        });
                        setQuery("");
                        setSelectedPlace(null);
                    }
                }}
                sx={{ 
                    flexShrink: 0,
                    color: (theme) => theme.palette.mode === 'dark' ? 'text.primary' : 'primary.main'
                }}
            >
                {editingDestinationId ? <Edit sx={{ fontSize: 60 }} /> : <AddCircle sx={{ fontSize: 60 }} />}
            </IconButton>
            
            {editingDestinationId && (
                <IconButton 
                    onClick={handleCancelEdit}
                    sx={{ color: "error.main", flexShrink: 0 }}
                >
                    <Cancel sx={{ fontSize: 60 }} />
                </IconButton>
            )}
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
