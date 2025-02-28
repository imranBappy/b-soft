import Modal from '@/components/modal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { calculateDiscount, CARD_TYPE } from '.';
import { useEffect, useState } from 'react';
interface DiscountModelProps {
    cart: CARD_TYPE[];
    setCart: (cart: CARD_TYPE[]) => void;
}



const DiscountModel = ({ cart, setCart }: DiscountModelProps) => {
    const [discountCart, setDiscountCart] = useState<CARD_TYPE[]>(cart);

    const handleDiscount = (id: string, discount: number) => {
        //  negative discount can't be allowed
        if (discount < 0) return;

        // discount can't be greater than price
        const item: (CARD_TYPE | undefined) = discountCart.find((item: CARD_TYPE) => item.id === id);
        if (!item) return;
        if (discount > item.price) return;

        setDiscountCart(prev => prev.map(item => item.id === id ? {
            ...item,
            totalDiscount: discount,
            discount: item.price - calculateDiscount(item.price, item.vat, discount)
        } : item));
    }

    const handleConfirm = () => {
        setCart(discountCart);
    }

    useEffect(() => {
        setDiscountCart(cart);
    }, [cart]);

    return (
        <div className=' flex flex-col items-end'>
            <Modal
                onClose={handleConfirm}
                openBtnClassName='w-[155px]'
                openBtnName='Discount'
                title='Modal'
                className='max-w-2xl'
                disabled={!cart.length}
                isCloseBtn={true}
                closeBtnName='Continue'
            >

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Quantity</TableHead>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Price</TableHead>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Discount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discountCart?.map((node) => (
                            <TableRow key={node.id}>
                                <TableCell className="py-4">{node?.name}</TableCell>
                                <TableCell className="py-4">{node?.quantity}</TableCell>
                                <TableCell className="py-4">${node?.price.toFixed(2)}</TableCell>
                                <TableCell className="py-4 font-medium">
                                    <Input
                                        onChange={(e) => handleDiscount(node.id, parseFloat(e.target.value) || 0)}
                                        value={node.totalDiscount || ""}
                                        placeholder='Discount amount'
                                        step={0.01}
                                        min={0.00}
                                        type='number'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Modal>
        </div>
    );
};

export default DiscountModel;