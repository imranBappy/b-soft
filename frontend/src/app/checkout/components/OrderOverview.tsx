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


const OrderOverview = () => {
    const carts = useStore((store) => store.cart)
    const totalPrice = carts.reduce((total, item) => total + (item.productPrice * item.quantity), 0)
    return (
        <Card className='w-full rounded'>
            <CardHeader>
                <CardTitle>Order Item</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your order items.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]"></TableHead>

                            <TableHead className="max-w-[300px]">Name</TableHead>
                            <TableHead className="text-right w-[200px]">Quantity</TableHead>
                            <TableHead className="text-right w-[200px]">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {carts.map((item, i) => (
                            <TableRow key={item.productId}>
                                <TableCell className="font-medium  ">{i + 1}</TableCell>
                                <TableCell >{item.productName}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">{item.productPrice}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">৳{totalPrice}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
};

export default OrderOverview;