import { DESCRIPTION_TYPE } from "@/graphql/product";
import { StateCreator, } from "zustand";
export interface ItemState {
    descriptions: DESCRIPTION_TYPE[];
    addDescription: (des:DESCRIPTION_TYPE) => void;
    remoteDescription: (id: string) => void;
    clearDescription: () => void;
}

export const itemSlice: StateCreator<ItemState, [], [], ItemState> = (set) => ({
    descriptions:[],
    addDescription: (des) => set((state) => ({
        descriptions: [...state.descriptions, des]
    })),
    remoteDescription: (id) => set((state) => ({
        descriptions: state.descriptions.filter((item) => item.id !== id)
    })),
    clearDescription: () => set({ descriptions: [] }),
})



export default itemSlice;