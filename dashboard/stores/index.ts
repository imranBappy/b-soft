import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
    AuthState,
    createAuthSlice,
    itemSlice,
    ItemState,
    CartState,
    createCartSlice,
} from "@/stores/slices";

type AppState = CartState & AuthState & ItemState;

const useStore = create<AppState>()(
    devtools(
        persist(
            (...a) => ({
                ...createCartSlice(...a),
                ...createAuthSlice(...a),
                ...itemSlice(...a),
            }),
            {
                name: "bound-store", // Name of the localStorage key
                partialize: (state) => ({
                    // Store only what's necessary
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                    role: state.role,
                }),
            }
        )
    )
);

export default useStore;
