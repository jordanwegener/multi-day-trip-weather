import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from "@mui/material";
import {
    AddLocationAlt as AddIcon,
    CloudQueue as WeatherIcon,
    Timeline as ChartIcon,
    InfoOutlined as InfoIcon,
} from "@mui/icons-material";

interface HelpModalProps {
    open: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "glass-panel",
                sx: {
                    borderRadius: "24px",
                    padding: "16px",
                },
            }}
        >
            <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
                <Typography variant="h4" className="text-gradient" sx={{ fontWeight: 800 }}>
                    Welcome to Tripcast
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ textAlign: "center", mb: 4 }}>
                    Plan your perfect road trip with real-time weather forecasts for every stop along your journey.
                </Typography>

                <List sx={{ px: 2 }}>
                    <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
                        <ListItemIcon sx={{ mt: 1 }}>
                            <AddIcon color="primary" fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Add Your Destinations
                                </Typography>
                            }
                            secondary="Search for any city or landmark. Select your arrival date to get accurate forecasts for when you'll actually be there."
                        />
                    </ListItem>

                    <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
                        <ListItemIcon sx={{ mt: 1 }}>
                            <WeatherIcon color="secondary" fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Check the Weather
                                </Typography>
                            }
                            secondary="See temperature highs and lows, precipitation chances, and weather conditions for each leg of your trip."
                        />
                    </ListItem>

                    <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
                        <ListItemIcon sx={{ mt: 1 }}>
                            <ChartIcon sx={{ color: "#f59e0b" }} fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Visualize Temperatures
                                </Typography>
                            }
                            secondary="Our dynamic chart shows the temperature trends across your entire route, helping you pack the right gear."
                        />
                    </ListItem>

                    <ListItem alignItems="flex-start" sx={{ mb: 2 }}>
                        <ListItemIcon sx={{ mt: 1 }}>
                            <InfoIcon sx={{ color: "#10b981" }} fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Save & Stay Updated
                                </Typography>
                            }
                            secondary="Save your trip and check back later. We'll automatically update your itinerary with the latest forecasts so you're always prepared."
                        />
                    </ListItem>
                </List>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, color: "text.muted" }}>
                    <InfoIcon fontSize="small" />
                    <Typography variant="body2">
                        You can recall this guide anytime by clicking the info icon in the header.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                    sx={{
                        maxWidth: "200px",
                        py: 1.5,
                        borderRadius: "12px",
                        fontSize: "1.1rem",
                        boxShadow: "0 4px 14px 0 rgba(0,0,0,0.2)",
                    }}
                >
                    Get Started
                </Button>
            </DialogActions>
        </Dialog>
    );
};
