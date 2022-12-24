import React from 'react';
import Box from '@mui/material/Box';
import { useStore } from '../store';

function DateSelect() {
    const store = useStore();
    
    return ( 
        <Box>
            <h4>What date will you be here?</h4>
            <input type="date" />
        </Box>
     );
}

export default DateSelect;