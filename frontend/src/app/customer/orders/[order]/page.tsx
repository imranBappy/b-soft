import OrderDetails from '../components/ItemDetails';

export default async function Page({
    params,
}: {
    params: Promise<{ order: string }>;
}) {
    const order = (await params).order;
    return <OrderDetails orderId={order} />;
}