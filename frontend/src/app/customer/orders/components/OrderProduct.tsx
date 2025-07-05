import { Button } from "@/components/ui/button";

import prdImg from '@/assets/no-image.jpg'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TimerReset } from "lucide-react";
import { ORDER_ITEM_TYPE } from "@/graphql/product";
import Image from "@/components/ui/image";
import { getThumblain } from "@/lib/utils";
import Link from "next/link";

const OrderProduct = ({ item, orderId }: { item: ORDER_ITEM_TYPE, orderId: string }) => {
    return (
        <Card className=" basis-60 shadow-none hover:shadow dark:bg-gray-deep ">
            <CardHeader className="p-3 relative ">
                <Image
                    src={getThumblain(item.product?.photo) || prdImg}
                    className="rounded-md w-full"
                    alt="Product Image"
                    width={200}
                    height={200}
                />
            </CardHeader>
            <CardContent className="px-4 pb-2">
                <CardTitle className=" font-playfair font-semibold leading-5 line-clamp-2		">
                    <Link
                        href={`/products/${item?.product?.slug || "#"} `}
                        className="hover:underline"
                    >
                        {item?.product?.name || ""}
                    </Link>
                </CardTitle>
                <p className=" mt-2 flex gap-2 items-center font-playfair">
                    <span className="text-blue text-base">
                        ৳{item.price} X {item.quantity}
                    </span>
                </p>
            </CardContent>
            <CardFooter className="px-3 pb-3">
                {
                    item?.access?.isExpired ? <Link
                        href={`/products/${item?.product?.id || "#"}`} className="w-full">
                        <Button disabled={item?.access?.isExpired} className="text-[#333333] font-playfair w-full">
                            <TimerReset /> Renew Product{' '}
                        </Button>
                    </Link> : <Link href={`/customer/orders/${orderId}`} className="w-full">
                        <Button disabled={item?.access?.isExpired} className="text-[#000] font-playfair w-full">
                            {
                                item?.access ? "Access" : "View"
                            }
                        </Button>
                    </Link>
                }
            </CardFooter>
        </Card>
    );
};

export default OrderProduct;