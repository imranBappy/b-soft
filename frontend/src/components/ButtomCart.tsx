"use client"
import { ShoppingBasket } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useState } from 'react';

import Link from 'next/link';
import useStore from '@/stores';
import CartItem from './CartItem';
const ButtomCart = () => {
    const [openSheet, setOpenSheet] = useState(false)
    const carts = useStore((store) => store.cart)
    const totalPrice = carts.reduce((total, item) => total + (item.productPrice * item.quantity), 0)

    const handleOpenChange = (value: boolean) => {
        setOpenSheet(value)
    }
    return (
        <>
            <Sheet open={openSheet} onOpenChange={handleOpenChange}>
                <SheetContent className="p-0 flex flex-col justify-between">
                    <SheetHeader className=" bg-blue border-b px-4 py-3">
                        <SheetTitle className=" uppercase text-base font-playfair font-normal">
                            Your Cart
                        </SheetTitle>
                    </SheetHeader>

                    <div className="px-4 h-full flex flex-col gap-4">
                        {carts?.map((cart) => (
                            <CartItem cart={cart} key={cart.productId} />
                        ))}
                    </div>
                    <SheetFooter>
                        <div className="w-full flex flex-col  ">
                            <div className=" py-3 flex flex-col">
                                {/* <div className=' gap-2 border-t py-2 px-4 font-lato text-base flex justify-between'>
                                    <Input
                                        placeholder='Promo Code'
                                    />
                                    <Button variant={'secondary'}>Apply</Button>
                                </div> */}
                                {/* <div className=' border-y py-2 px-4 font-lato text-base flex justify-between'>
                                    <p>Sub Total </p> <p>$100</p>
                                </div> */}
                                <div className="px-4 pb-2 pt-2 font-lato text-lg flex justify-between">
                                    <p>Total Price : </p> <p>৳{totalPrice}</p>
                                </div>
                            </div>
                            <SheetClose asChild>
                                <Link href={`/checkout`}>
                                    <Button
                                        className=" rounded-none w-full  h-12 font-playfair text-base !py-5 "
                                        type="submit"
                                    >
                                        Checkout
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <div
                onClick={() => handleOpenChange(!openSheet)}
                className="w-16 h-16 fixed  dark:bg-black  bg-white  border rounded-sm cursor-pointer shadow-md md:right-[50px]  right-[10px] bottom-[50px]   "
            >
                <div className=" p-4  relative flex items-center justify-center ">
                    <ShoppingBasket />
                    <div
                        style={{
                            width: '20px',
                            height: '20px',
                            position: 'absolute',
                            top: '-9px',
                            right: '-9px',
                        }}
                        className=" absolute  bg-primary shadow-sm text-sm   font-playfair text-gray   rounded-full flex items-center justify-center"
                    >
                        {carts.length}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ButtomCart;