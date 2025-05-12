import Image from 'next/image';
import React from 'react';
import NoImage from '@/assets/no-image.jpg'
import { CART_TYPE } from '@/stores/slices';
import { X } from 'lucide-react';
import useStore from '@/stores';

const CartItem = ({ cart }: { cart: CART_TYPE }) => {
    const removeItem = useStore((store) => store.removeCart)
    return (
        <div className='flex gap-3 items-center  '>
            <Image
                src={cart.productImg || NoImage}
                width={50}
                height={50}
                alt='Image'
                className='rounded'
            />
            <div className=' flex flex-col gap-1 justify-between ' >
                <h4 className=' font-lato  text-sm line-clamp-1 '> {cart.productName} </h4>
                <div className='flex justify-between items-center'>
                    <p className='flex gap-2 items-center'>{cart.productPrice}৳ <X size={18} />{cart.quantity} = {cart.productPrice * cart.quantity}</p> <button onClick={() => removeItem(cart.productId)}><X size={20} color='red' /></button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;