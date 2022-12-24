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
        <Typography variant={'h6'}>Stop {destination.id}</Typography>
        <Typography variant={'h5'}>{destination.name}</Typography>
        <Typography>{destination.description}</Typography>
        <Typography>{destination.date.toLocaleDateString()}</Typography>
      </Box>
      <Typography variant={'h6'}>Weather</Typography>
      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
        <Box display={"flex"} marginRight={5} flexDirection={"column"}>
          <Typography>Weather: placeholder</Typography>
          <Typography>Temperature: placeholder</Typography>
          <Typography>Feels Like: placeholder</Typography>
        </Box>
        <Box marginBottom={6}>
          <Typography>Wind: placeholder</Typography>
          <Typography>Humidity: placeholder</Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default DestinationCard;
