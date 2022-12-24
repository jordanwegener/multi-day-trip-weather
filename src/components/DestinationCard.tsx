import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { Destination } from "../types";

function DestinationCard({ destination }: { destination: Destination }) {
  console.log(destination);
  return (
    <Card
      key={destination.id}
      raised
      sx={{
        width: 500,
        margin: '20px 20px'
      }}
    >
      <Box borderBottom={"1px solid lightgrey"} margin={4}>
        <Typography>Stop {destination.id}</Typography>
        <Typography>{destination.name}</Typography>
        <Typography>{destination.description}</Typography>
        <Typography>{destination.date.toLocaleDateString()}</Typography>
      </Box>
      <h4>Weather</h4>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <Box display={"flex"} marginRight={5} flexDirection={"column"}>
          <p>Weather: placeholder</p>
          <p>Temperature: placeholder</p>
          <p>Feels Like: placeholder</p>
        </Box>
        <Box>
          <p>Wind: placeholder</p>
          <p>Humidity: placeholder</p>
        </Box>
      </Box>
    </Card>
  );
}

export default DestinationCard;
