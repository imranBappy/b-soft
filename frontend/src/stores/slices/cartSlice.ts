import { StateCreator, } from "zustand";

export interface ATTRIBUTE_TYPE {
    attribute: string
    option: string
}

export interface CART_TYPE {
    quantity: number,
    productPrice: number,
    productName: string,
    productImg?: string,
    productId: string,
    attributes?: ATTRIBUTE_TYPE[]
}
export interface CartState {
    cart: CART_TYPE[],
    addCart: (item: CART_TYPE) => void;
    addCarts: (items: CART_TYPE[]) => void;
    removeCart: (id: string) => void;
    clearCart: () => void;
    incrementItemQuantity: (id: string) => void;
    decrementItemQuantity: (id: string) => void;
}

export const createCartSlice: StateCreator<CartState, [], [], CartState> = (set) => ({
    cart: [],
    addCart: (item) => set((state) => ({
        cart: [...state.cart, item]
    })),
    incrementItemQuantity: (id: string) => set((state) => ({
        cart: state.cart.map((item) => item.productId === id ? { ...item, quantity: item.quantity + 1 } : item)
    })),
    decrementItemQuantity: (id: string) => set((state) => {
        const newCart: CART_TYPE[] = [];
        for (let i = 0; i < state.cart.length; i++) {
            const element: CART_TYPE = state.cart[i];
            if (id === element.productId && element.quantity < 2) {
                continue;
            } else if (id === element.productId && element.quantity > 1) {
                newCart.push({
                    ...element,
                    quantity: element.quantity - 1
                })
            } else {
                newCart.push(element)
            }
        }
        return { cart: newCart }
    }),
    addCarts: (items: CART_TYPE[]) => set({ cart: [...items] }),
    removeCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.productId !== id)
    })),
    clearCart: () => set({ cart: [] })
})



export default createCartSlice;