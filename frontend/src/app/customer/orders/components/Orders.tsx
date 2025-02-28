"use client"
import OrderProduct from './OrderProduct';
import { useQuery } from '@apollo/client';
import { ORDER_TYPE, ORDERS_QUERY } from '@/graphql/product';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/ui/loading';
export const getStatusStyle = (status: string) => {
    const statuses = {
        COMPLETED:
            'bg-green-500/20 text-green-500 dark:bg-green-500/30 dark:text-green-400',
        CONFIRMED:
            'bg-green-500/20 text-green-500 dark:bg-green-500/30 dark:text-green-400',
        PENDING:
            'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-500/30 dark:text-yellow-400',
        PREPARING:
            'bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400',
        READY: 'bg-purple-500/20 text-purple-600 dark:bg-purple-500/30 dark:text-purple-400',
        DELIVERED:
            'bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-400',
        CANCELLED:
            'bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400',
    };
    return (
        statuses[status as keyof typeof statuses] ||
        'bg-gray-500/20 text-gray-600 dark:bg-gray-500/30 dark:text-gray-400'
    );
};
const Orders = () => {
    const { data, loading } = useQuery(ORDERS_QUERY)
    const orders = data?.orders?.edges
   
    const content = orders?.map(({ node }: { node: ORDER_TYPE }) => (
        <div key={node.id} className="w-full">
            <div className="mb-5">
                <h6 className=" font-lato text-lg mt-0">
                    Your Order ID:{' '}
                    <span className=" text-blue ">
                        <Link href={`/customer/orders/${node.id}`}>
                            {node.orderId}
                        </Link>
                    </span>{' '}
                    ({node?.items?.edges?.length} items)
                </h6>
                <div className="flex gap-5 items-center mt-2">
                    <Badge
                        className={`${
                            getStatusStyle(
                            node.status.trim().toUpperCase() )
                    }
                        
                        border-none w-[90px]  flex justify-center items-center`}
                    >
                        {node.status}
                    </Badge>

                    <p className=" font-lato text-lg">
                        Total: {node.totalPrice}
                    </p>
                </div>
            </div>
            <div className="flex  gap-10   flex-wrap">
                {node?.items?.edges?.map(({ node }) => (
                    <OrderProduct item={node} key={node.id} />
                ))}
            </div>
        </div>
    ));

    if (loading) return <Loading />;


    return <div className='flex   flex-col gap-10 my-10'>
        {content}
    </div>;

};

export default Orders;