'use client';
import Payment from '../../components/order-payment/Payment';
import { useParams } from 'next/navigation';

const OrderDetails = () => {
    const { id } = useParams() as { id: string };

    return <Payment orderId={id} />;
};

export default OrderDetails;