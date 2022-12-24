import React from 'react';
import './App.css';
import AddDestination from './components/AddDestination';
import DisplayDestinations from './components/DisplayDestinations';
import Box from '@mui/material/Box';

import mockData from './mock_data';

const destinations = mockData;

function App() {
  return (
    <Box width={"100%"} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
      <h1>TripCast</h1>
      <h2>Plan your next trip</h2>
      <AddDestination/>

      <DisplayDestinations destinations={destinations} />
    </Box>
  );
}

export default App;
