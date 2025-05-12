"use client"
import { ShoppingCart } from 'lucide-react';

const CartButton = ({ count = 0 }) => {
    return (
        <div className='relative cursor-pointer ' >
            <ShoppingCart size={25} />
            {
                count ? <div className=' absolute -top-[7px] -right-[10px] bg-primary shadow-sm   font-playfair text-gray w-[20px] h-[20px]  rounded-full flex items-center justify-center'>{count}</div> : ""
            }
        </div>
    );
};

export default CartButton;