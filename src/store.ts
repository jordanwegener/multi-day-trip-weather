import create from 'zustand'
import { Destination } from './types'

export type Store = {
    destinations: Destination[],
    setDestinations: (destinations: Destination[]) => void,
    addDestination: (destination: Destination) => void,
    removeDestination: (id: number) => void,
    clearDestinations: () => void,
}

const setDestinations = (destinations: Destination[]) => useStore.setState({ destinations })

const addDestination = (destination: Destination) => useStore.setState(state => ({ destinations: [...state.destinations, destination] }))

const removeDestination = (id: number) => useStore.setState(state => ({ destinations: state.destinations.filter(d => d.id !== id) }))

const clearDestinations = () => useStore.setState({ destinations: [] })

export const useStore = create(set => ({
    destinations: [],
    setDestinations: setDestinations,
    addDestination: addDestination,
    removeDestination: removeDestination,
    clearDestinations: clearDestinations,
}))

export default useStore
