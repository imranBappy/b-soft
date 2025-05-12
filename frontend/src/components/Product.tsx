"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCheck, ShoppingCart, ShoppingBasket } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { PRODUCT_TYPE } from '@/graphql/product';
import Link from 'next/link';
import Image from './ui/image';
import { getThumblain, underscoreToSpace } from '@/lib/utils';

const Product = ({ data }: { data: PRODUCT_TYPE }) => {
    const { name, price, photo, tag } = data;
    return (
        <Card className=" h-fit basis-72 shadow-none hover:shadow dark:bg-gray-deep ">
            <CardHeader className="p-3 relative ">
                {tag && (
                    <div className=" absolute top-6 left-5 flex flex-col gap-2">
                        {/* <Badge className=" text-white justify-center items-center font-oswald">
                        -50%
                    </Badge> */}
                        <Badge className="bg-orange text-white justify-center items-center font-oswald">
                            {underscoreToSpace(tag)}
                        </Badge>
                        {/* <Badge className='bg-blue text-white justify-center items-center'>NEW</Badge> */}
                    </div>
                )}

                <Image
                    src={getThumblain(photo)}
                    alt={name}
                    width={500}
                    height={500}
                    className="rounded-md w-72"
                />
            </CardHeader>
            <CardContent className="px-4">
                <Link href={`/products/${data.id}`}>
                    <CardTitle className=" font-playfair font-semibold leading-5 line-clamp-2		">
                        {name}
                    </CardTitle>
                </Link>
                <p className=" mt-4 flex gap-2 items-center ">
                    <CheckCheck size={20} className="text-blue " />
                    <span className=" font-oswald">In stock</span>{' '}
                </p>
                <p className=" mt-2 flex gap-2 items-center font-playfair">
                    {/* <span className='  text-gray-400 line-through text-sm '>$100</span> */}
                    <span className="text-blue text-base">৳{price}</span>
                </p>
            </CardContent>

            <CardFooter className="px-3 pb-3">
                <Link
                    className="w-full  flex gap-[0.5px]"
                    href={`/products/${data.id}`}
                >
                    <Button
                        className=" font-playfair rounded-r-none  w-full"
                        variant={'secondary'}
                    >
                        {' '}
                        <ShoppingCart /> Add To Cart{' '}
                    </Button>
                    <Button className=" text-white bg-blue   rounded-l-none font-playfair w-full">
                        {' '}
                        <ShoppingBasket /> Buy Now
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default Product;