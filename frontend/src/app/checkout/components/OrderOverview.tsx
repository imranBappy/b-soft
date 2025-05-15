"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useStore from '@/stores';
import { Button } from "@/components/ui/button";


const OrderOverview = () => {
    const carts = useStore((store) => store.cart)
    const incrementItemQuantity = useStore((store) => store.incrementItemQuantity)
    const decrementItemQuantity = useStore(
        (store) => store.decrementItemQuantity
    );

    const totalPrice = carts.reduce((total, item) => total + (item.productPrice * item.quantity), 0)
    return (
        <Card className="w-full rounded">
            <CardHeader>
                <CardTitle>Order Item</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your order items.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="md:w-[100px]  w-11 "></TableHead>
                            <TableHead className="max-w-[300px]">
                                Name
                            </TableHead>
                            <TableHead className="text-right md:w-[200px] w-11">
                                Quantity
                            </TableHead>
                            <TableHead className="text-right md:w-[200px] w-11">
                                Price
                            </TableHead>
                            <TableHead className="text-right md:w-[200px] w-11">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {carts.map((item, i) => (
                            <TableRow key={item.productId}>
                                <TableCell className="font-medium  ">
                                    {i + 1}
                                </TableCell>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell className="text-right">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.productPrice}
                                </TableCell>
                                <TableCell className="text-right flex justify-end items-center gap-2">
                                    <Button
                                        variant={'destructive'}
                                        onClick={() =>
                                            decrementItemQuantity(
                                                item.productId
                                            )
                                        }
                                    >
                                        -
                                    </Button>
                                    <Button variant={'ghost'}>
                                        {item.quantity}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            incrementItemQuantity(
                                                item.productId
                                            )
                                        }
                                    >
                                        +
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                                ৳{totalPrice}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
};

export default OrderOverview;