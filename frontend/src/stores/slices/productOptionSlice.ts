import { ATTRIBUTE_OPTION_TYPE } from "@/graphql/product";
import { StateCreator, } from "zustand";

export interface PRODUCT_ATTRIBUTE_TYPE {
    id: string,
    option: ATTRIBUTE_OPTION_TYPE
    productId: string;
}


type Options = PRODUCT_ATTRIBUTE_TYPE[]

export interface ProductOptionState {
    options: Options,
    addProductOption: (item: PRODUCT_ATTRIBUTE_TYPE) => void;
    remoteProductOption: (id: string) => void;
}

export const productOptionSlice: StateCreator<ProductOptionState, [], [], ProductOptionState> = (set) => ({
    options: [],
    addProductOption: (attribute) => set((state) => ({ options: [...state.options.filter((op => op.id !== attribute.id)), attribute] })),
    remoteProductOption: (id: string) => set((state) => ({ options: state.options.filter((op => op.id !== id)) })),
})



export default productOptionSlice;