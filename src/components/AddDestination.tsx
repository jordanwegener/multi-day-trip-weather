import React from 'react';
import { useStore } from '../store';
import DateSelect from './DateSelect';
import { Box, Typography } from '@mui/material';


function AddDestination() {
    const store = useStore();

    return (
        <Box bgcolor={'lightgrey'} paddingY={3}>
            <Typography variant={'h5'}>Add a destination</Typography>
            <input type="text" placeholder="Enter a destination" />
            <DateSelect/>
            <button>Add</button>
        </Box>
    );
}

export default AddDestination;