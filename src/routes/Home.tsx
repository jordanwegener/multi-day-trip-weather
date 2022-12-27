import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import AddDestination from "../components/NewDestination";
import DisplayDestinations from "../components/DisplayDestinations";
import { Header } from "../components/Header";
import { useStore } from "../store";

export function Home() {
    const { destinations } = useStore();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 50,
            }}
        >
            <Header />
            <DisplayDestinations />
            <AddDestination />
        </div>
    );
}
