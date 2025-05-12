import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthState, createAuthSlice, ProductOptionState, productOptionSlice, createSearchSlice, SearchState, CartState, createCartSlice } from "@/stores/slices";

type AppState = CartState & AuthState & SearchState & ProductOptionState;
const useStore = create<AppState>()(
    devtools(
        persist(
            (...args) => ({
                ...createCartSlice(...args),
                ...createAuthSlice(...args),
                ...createSearchSlice(...args),
                ...productOptionSlice(...args)
            }),
            {
                name: "bound-store", // Name of the localStorage key
                partialize: (state) => ({
                    // Store only what's necessary
                    cart: state.cart,

                }),
            }

        ))
)
export default useStore