import { useState } from "react";
import { Box, Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, FormControl, InputLabel } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import useStore from "../store";

export const TripPersistenceControls = () => {
    const { trips, currentTripName, saveTrip, loadTrip, deleteTrip, startFresh, destinations } = useStore();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [tripToDelete, setTripToDelete] = useState("");
    const [newTripName, setNewTripName] = useState("");

    const tripNames = Object.keys(trips);

    const handleSave = () => {
        if (newTripName.trim()) {
            saveTrip(newTripName.trim());
            setOpenDialog(false);
            setNewTripName("");
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 220 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="trip-select-label" sx={{ color: "text.secondary" }}>Trip</InputLabel>
                <Select
                    labelId="trip-select-label"
                    value={currentTripName || ""}
                    label="Trip"
                    onChange={(e) => {
                        if (e.target.value) {
                            loadTrip(e.target.value);
                        }
                    }}
                    sx={{ color: "text.primary", '& .MuiOutlinedInput-notchedOutline': { borderColor: "text.secondary" } }}
                >
                    <MenuItem value="">
                        <em>Unsaved</em>
                    </MenuItem>
                    {tripNames.map((name) => (
                        <MenuItem key={name} value={name} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>{name}</span>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setTripToDelete(name);
                                    setOpenDeleteConfirm(true);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Tooltip title="Save Current Trip">
                <span>
                    <IconButton 
                        color="primary" 
                        onClick={() => {
                            setNewTripName(currentTripName || "");
                            setOpenDialog(true);
                        }}
                        disabled={destinations.length === 0}
                    >
                        <SaveIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title="Start Fresh">
                <IconButton color="secondary" onClick={startFresh}>
                    <AddIcon />
                </IconButton>
            </Tooltip>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Save Trip</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Trip Name"
                        fullWidth
                        variant="outlined"
                        value={newTripName}
                        onChange={(e) => setNewTripName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                <DialogTitle>Delete Trip?</DialogTitle>
                <DialogContent>
                    Are you sure you want to permanently delete "{tripToDelete}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirm(false)}>Cancel</Button>
                    <Button onClick={() => {
                        deleteTrip(tripToDelete);
                        setOpenDeleteConfirm(false);
                    }} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
