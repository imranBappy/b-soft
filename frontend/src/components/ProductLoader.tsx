"use client"
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { ShoppingCart, ShoppingBasket } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const ProductLoader = () => {
    return (
        <Card className=" basis-64 shadow-none hover:shadow dark:bg-gray-deep ">
            <CardHeader className="p-3 relative ">
                <Skeleton className=" rounded-md w-64 h-64" />
            </CardHeader>
            <CardContent className="px-4">
                <div>
                    <Skeleton className="h-5 w-[150px] rounded-sm" />
                </div>
                <p className=" mt-4 flex gap-2 items-center ">
                    <Skeleton className="h-4 w-[100px] rounded-sm" />
                </p>
                <p className=" mt-2 flex gap-2 items-center font-playfair">
                    {/* <span className='  text-gray-400 line-through text-sm '>$100</span> */}
                    <Skeleton className="h-4 w-[80px] rounded-sm" />
                </p>
            </CardContent>

            <CardFooter className="px-3 pb-3 flex gap-[0.5px]">
                <Button
                    disabled
                    className=" font-playfair rounded-r-none  w-full"
                    variant={'secondary'}
                >
                    {' '}
                    <ShoppingCart /> Add To Cart{' '}
                </Button>

                <Button
                    disabled
                    className=" text-white bg-blue   rounded-l-none font-playfair w-full"
                >
                    {' '}
                    <ShoppingBasket /> Buy Now
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductLoader;