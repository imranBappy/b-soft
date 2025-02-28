import ItemDetails from '../../components/ItemDetails';


export default async function Page({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const orderId = (await params).orderId;
    return (
        <div>
            <ItemDetails orderId={orderId} />
        </div>
    );
}