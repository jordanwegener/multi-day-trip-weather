import React from "react";
import { Destination } from "../types";
import { Box, Typography } from "@mui/material";
import DestinationCard from "./DestinationCard";

function DisplayDestinations({
  destinations
}: {
  destinations: Destination[];
}) {
  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignContent={'center'} maxWidth={'2500px'} margin={"0 auto"}>
      <Typography variant={'h2'}>Your Trip</Typography>
      <Box display={"flex"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={'center'} alignItems={'center'}>
        {destinations.map((destination) => (
          <DestinationCard destination={destination} />
        ))}
      </Box>
    </Box>
  );
}

export default DisplayDestinations;
