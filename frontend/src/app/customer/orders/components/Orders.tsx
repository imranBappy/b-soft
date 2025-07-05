'use client';
import { useState } from 'react';
import OrderProduct from './OrderProduct';
import { useQuery } from '@apollo/client';
import { ORDER_TYPE, ORDERS_QUERY } from '@/graphql/product';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Loading from '@/components/ui/loading';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
// components/NotFound.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Youtube } from 'lucide-react'
import DownloadExtension from '@/components/DownloadExtension';
import moment from 'moment';

interface NotFoundProps {
    message?: string;
    actionText?: string;
    onActionClick?: () => void;
}

function NotFound({
    message = 'No orders found yet.',
    actionText = 'Start Shopping',
    onActionClick,
}: NotFoundProps) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        Nothing Here Yet
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">{message}</p>
                    {actionText && onActionClick && (
                        <Button onClick={onActionClick}>{actionText}</Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

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
    const [page, setPage] = useState(1);
    const limit = 6;
    const { data, loading } = useQuery(ORDERS_QUERY, {
        variables: {
            first: limit,
            offset: (page - 1) * limit,
        },
        nextFetchPolicy: 'no-cache',
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
    });
    const orders = data?.orders?.edges;

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const totalCount = data?.orders?.totalCount;
    const totalPages = Math.ceil(totalCount / limit);

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
                <div className="flex items-center flex-wrap justify-between">
                    <div className='flex gap-5 items-center mt-2 flex-wrap '>
                        <Badge
                            className={`${getStatusStyle(
                                node.status.trim().toUpperCase()
                            )}
                                border-none w-[90px]  flex justify-center items-center`}
                        >
                            {node.status}
                        </Badge>
                        <p
                            className=' text-nowrap'
                        >Order Date: {
                                moment(node.createdAt).format('D/M/Y')
                            }</p>
                        <p className=' text-nowrap'>
                            Total: {node.totalPrice}
                        </p>

                    </div>

                </div>
            </div>
            <div className="flex  gap-10   flex-wrap">
                {node?.items?.edges?.map(({ node: node2 }) => (
                    <OrderProduct item={node2} key={node2.id} orderId={node.id} />
                ))}
            </div>
        </div>
    ));
    if (loading) return <div className='flex justify-center items-center h-[50vh]'  >
        <Loading />
    </div>;

    if (!content?.length) {
        return <NotFound />;
    }


    return (
        <div className="w-full flex  gap-5 flex-col ">
            <div className='mt-10 md:!-mb-14 flex gap-5 md:justify-end items-center flex-wrap'>
                <Button variant={'outline'}>
                    <Youtube />
                    Watch Video
                </Button>
                <DownloadExtension />
            </div>
            <div className="flex   flex-col gap-10 ">{content}</div>
            <div
                className=" flex justify-center w-full mt-5"
                style={{ marginBottom: '100px' }}
            >
                {totalPages > 1 ? (
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() =>
                                        page > 1 && handlePageChange(page - 1)
                                    }
                                />
                            </PaginationItem>

                            {new Array(totalPages).fill(1).map((_, i) => {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            onClick={() =>
                                                handlePageChange(i + 1)
                                            }
                                            isActive={page === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() =>
                                        page < totalPages &&
                                        handlePageChange(page + 1)
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>
        </div>
    );
};

export default Orders;
