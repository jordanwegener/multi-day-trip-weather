import React from "react";
import { Destination } from "../types";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

type DisplayDestinationsProps = {
  destinations: Destination[];
};

function DisplayDestinations({ destinations }: DisplayDestinationsProps) {
  return (
    <Grid textAlign={'center'}>
      <h3>Your Trip</h3>
      {destinations.map((destination) => (
        <Box
          key={destination.id}
          border={"1px solid black"}
          borderRadius={5}
          margin={'10px auto'}
          padding={3}
          width={"400px"}
          alignSelf={'center'}
        >
          <h4>Stop {destination.id}</h4>
          <h4>{destination.name}</h4>
          <p>{destination.description}</p>
          <p>latitude: {destination.gpsCoords.lat}</p>
            <p>longitude: {destination.gpsCoords.lon}</p>
        </Box>
      ))}
    </Grid>
  );
}

export default DisplayDestinations;
