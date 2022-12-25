import React from 'react';
import './App.css';
import AddDestination from './components/AddDestination';
import DisplayDestinations from './components/DisplayDestinations';
import {Box, Typography} from '@mui/material';
import { Destination } from './types';

import mockData from './mock_data';

function App() {
  const destinations: Destination[] = mockData;
  
  return (
    <Box width={"100%"} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
      <Typography variant={'h1'}>TripCast</Typography>
      <Typography variant={'h4'}>{tagline()}</Typography>
      <AddDestination/>

      <DisplayDestinations destinations={destinations} />
    </Box>
  );
}

function tagline() {
  const dice = Math.floor(Math.random() * 100);
  switch (dice) {
    case 0:
      return "the weather, wherever you're going";
    case 1:
      return "always take the weather with you";
    case 2:
      return "now with 100% more weather";
    case 3:
      return "weather, whether here or there";
    case 4:
      return "Sunny'); DROP TABLE users;--";
    default:
      return "the weather, wherever you're going";
  }
}

export default App;
