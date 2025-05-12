import { StateCreator, } from "zustand";


export interface SearchState {
    query: string,
    addSearchQuery: (query: string) => void;
    clearSearchQuery: () => void;
}

export const createSearchSlice: StateCreator<SearchState, [], [], SearchState> = (set) => ({
    query: "",
    addSearchQuery: (item) => set(() => ({
        query: item
    })),
    clearSearchQuery: () => set({ query: '' })
})



export default createSearchSlice;