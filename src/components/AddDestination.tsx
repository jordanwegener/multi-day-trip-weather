import React from 'react';
import { useStore } from '../store';
import DateSelect from './DateSelect';


function AddDestination() {
    const store = useStore();

    return (
        <div className="add-destination">
            <h3>Add a destination</h3>
            <input type="text" placeholder="Enter a destination" />
            <DateSelect/>
            <button>Add</button>
        </div>
    );
}

export default AddDestination;