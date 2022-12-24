// set up a store using zustand
import create from 'zustand'

const useStore = create(set => ({
    destinations: [],
    setDestinations: (destinations) => set({ destinations }),
}))

export default useStore
