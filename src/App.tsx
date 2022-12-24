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
      <Typography variant={'h4'}>The weather, wherever you're going</Typography>
      <AddDestination/>

      <DisplayDestinations destinations={destinations} />
    </Box>
  );
}

export default App;
