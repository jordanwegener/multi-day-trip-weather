import create from 'zustand'
import { Destination } from './types'

export type Store = {
    destinations: Destination[],
    setDestinations: (destinations: Destination[]) => void,
    addDestination: (destination: Destination) => void,
    removeDestination: (id: number) => void,
    clearDestinations: () => void,
    dates: {
        startDate: Date,
        endDate: Date,
    },
    setDates: (dates: { startDate: Date, endDate: Date }) => void
}

const setDestinations = (destinations: Destination[]) => useStore.setState({ destinations })

const addDestination = (destination: Destination) => useStore.setState(state => ({ destinations: [...state.destinations, destination] }))

const removeDestination = (id: number) => useStore.setState(state => ({ destinations: state.destinations.filter(d => d.id !== id) }))

const clearDestinations = () => useStore.setState({ destinations: [] })

const setDates = (dates: { startDate: Date, endDate: Date }) => useStore.setState({ dates })

export const useStore = create(set => ({
    destinations: [],
    setDestinations: setDestinations,
    addDestination: addDestination,
    removeDestination: removeDestination,
    clearDestinations: clearDestinations,
    dates: {
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 86400000)
    },
    setDates: setDates
}))

export default useStore
