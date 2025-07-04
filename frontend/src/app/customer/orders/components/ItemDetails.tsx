'use client';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Copy, Download, Eye, EyeOff
    // TimerReset
} from 'lucide-react';
import { useQuery } from '@apollo/client';
import {
    ORDER_ITEM_TYPE,
    ORDER_QUERY,
    ORDER_TYPE,
    ORDER_PRODUCT_ATTRIBUTE_TYPE,
} from '@/graphql/product';
import { getThumblain, toFixed } from '@/lib/utils';
import Loading from '@/components/ui/loading';
import Image from '@/components/ui/image';
import { getStatusStyle } from './Orders';
import Link from 'next/link';
import moment from 'moment';

export default function OrderDetails({ orderId }: { orderId: string }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const { data, loading } = useQuery(ORDER_QUERY, {
        variables: {
            id: orderId,
        },
    });
    const myOrder: ORDER_TYPE = data?.order || {};
    const items = myOrder.items?.edges || [];

    const [showPasswords, setShowPasswords] = useState<{
        [key: string]: boolean;
    }>({});

    const togglePasswordVisibility = (itemId: string) => {
        setShowPasswords((prev) => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAccessToken(token);
        }
    }
        , []);




    if (loading) return <Loading />;

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-3xl font-bold">
                        Order #{myOrder.orderId}
                    </h1>
                    <Badge
                        className={`${getStatusStyle(
                            myOrder.status
                        )} border-none w-[90px]  flex justify-center items-center`}
                    >
                        {myOrder.status}
                    </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                    Placed on {new Date(myOrder.createdAt).toLocaleDateString()}
                </p>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Order Items */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
                    <div className="space-y-6">
                        {items.map(({ node }: { node: ORDER_ITEM_TYPE }) => {
                            const itemExtraPrice =
                                node?.orderProductAttribute?.edges.reduce(
                                    (total, curr) =>
                                        total +
                                        Number(toFixed(curr.node.extraPrice)),
                                    0
                                );

                            return (
                                <div
                                    key={node.id}
                                    className="border rounded-lg p-4 space-y-4"
                                >
                                    <div className="flex gap-4 flex-col md:flex-row">
                                        <div className="flex flex-row justify-between  items-center md:items-start">
                                            <div className="relative h-24 w-24 flex-shrink-0">
                                                <Image
                                                    src={getThumblain(
                                                        node.product.photo
                                                    )}
                                                    alt={node.product.name}
                                                    className="max-h-24 object-contain rounded-md"
                                                />
                                            </div>
                                            <div className="  md:hidden   text-right">
                                                <p className="text-lg font-semibold">
                                                    ৳{toFixed(node.price)}
                                                </p>
                                                <p className="text-sm text-muted-foreground w-fit">
                                                    (Base: ৳{' '}
                                                    {toFixed(node.price)} +
                                                    Variant: ৳ {itemExtraPrice}{' '}
                                                    ) * {node.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {/* Item Details */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-medium">
                                                        <Link
                                                            href={`/products/${node.product.id}`}
                                                            className="hover:underline"
                                                        >
                                                            {node.product.name}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-muted-foreground">
                                                        Quantity:{' '}
                                                        {node.quantity}
                                                    </p>
                                                </div>
                                                <div className="  hidden md:block text-right">
                                                    <p className="text-lg font-semibold">
                                                        ৳{toFixed(node.price)}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground w-80">
                                                        (Base: ৳{' '}
                                                        {toFixed(node.price)} +
                                                        Variant: ৳{' '}
                                                        {itemExtraPrice} ) *{' '}
                                                        {node.quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Variant Details */}
                                            {node?.orderProductAttribute?.edges
                                                ?.length ? (
                                                <div className="bg-muted p-3 rounded-md">
                                                    <h4 className="font-semibold mb-2">
                                                        Variant Details
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        {node?.orderProductAttribute?.edges?.map(
                                                            (variant: {
                                                                node: ORDER_PRODUCT_ATTRIBUTE_TYPE;
                                                            }) => (
                                                                <div
                                                                    key={
                                                                        variant
                                                                            .node
                                                                            .id
                                                                    }
                                                                >
                                                                    <p>
                                                                        {
                                                                            variant
                                                                                .node
                                                                                .attribute
                                                                                .name
                                                                        }
                                                                        :{' '}
                                                                        {
                                                                            variant
                                                                                .node
                                                                                .option
                                                                                .option
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        Extra
                                                                        Price:
                                                                        {toFixed(
                                                                            variant
                                                                                .node
                                                                                .extraPrice
                                                                        )}
                                                                    </p>
                                                                    <Separator />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Product Access */}
                                            {node.access ? (
                                                node?.access?.credential?.cookies ? (
                                                    <div>
                                                        {/* Expire expire date, active date and isExpire status */}
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Product
                                                                    Access
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Expire Date:{' '}
                                                                    {node?.access?.expiredDate
                                                                        ? moment(
                                                                            node?.access
                                                                                ?.expiredDate
                                                                        ).format(
                                                                            'DD MMM YYYY'
                                                                        )
                                                                        : 'N/A'}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    node?.access
                                                                        ?.isExpired
                                                                        ? 'destructive'
                                                                        : 'default'
                                                                }
                                                            >
                                                                {
                                                                    node?.access
                                                                        ?.isExpired
                                                                        ? 'Expired'
                                                                        : 'Active'
                                                                }
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm text-muted-foreground">
                                                            Activation Date:{' '}
                                                            {moment(
                                                                node?.access
                                                                    ?.createdAt
                                                            ).format(
                                                                'DD MMM YYYY'
                                                            )}
                                                        </p>
                                                        {
                                                            node?.access
                                                                ?.note && (<p className="text-sm text-muted-foreground">
                                                                    Note:{' '}
                                                                    {
                                                                        node?.access
                                                                            ?.note
                                                                    }
                                                                </p>
                                                            )
                                                        }


                                                    </div>

                                                ) : (
                                                    <div>
                                                        <h4 className="font-semibold mb-2">
                                                            Product Access
                                                        </h4>
                                                        <div className="space-y-3 text-sm">
                                                            {node.access
                                                                .note && (
                                                                    <div>
                                                                        <p className="text-muted-foreground">
                                                                            {
                                                                                node
                                                                                    .access
                                                                                    .note
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            {node.access?.credential?.email && (
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            Email
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                node
                                                                                    .access
                                                                                    .credential?.email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            copyToClipboard(
                                                                                node
                                                                                    .access
                                                                                    .credential?.email || ""
                                                                            )
                                                                        }
                                                                    >
                                                                        <Copy className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            {node.access?.credential?.username && (
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            Username
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                node.access?.credential?.username
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            copyToClipboard(
                                                                                node.access?.credential?.username || ""
                                                                            )
                                                                        }
                                                                    >
                                                                        <Copy className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                            {node.access?.credential?.password && (
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium">
                                                                            Password
                                                                        </p>
                                                                        <p>
                                                                            {showPasswords[
                                                                                node
                                                                                    .id
                                                                            ]
                                                                                ? node.access?.credential?.password
                                                                                : '••••••••'}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                togglePasswordVisibility(
                                                                                    node.id
                                                                                )
                                                                            }
                                                                        >
                                                                            {showPasswords[
                                                                                node
                                                                                    .id
                                                                            ] ? (
                                                                                <EyeOff className="h-4 w-4" />
                                                                            ) : (
                                                                                <Eye className="h-4 w-4" />
                                                                            )}
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                copyToClipboard(
                                                                                    node.access?.credential?.password || ""
                                                                                )
                                                                            }
                                                                        >
                                                                            <Copy className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            ) : null}

                                            {/* Download Button */}
                                            <div className="flex items-center gap-5">
                                                {node?.access?.credential?.cookies ? (
                                                    <Button
                                                        className="font-oswal font-semibold"
                                                        disabled={
                                                            node?.access
                                                                .isExpired
                                                        }
                                                    >
                                                        <a
                                                            href={
                                                                node?.access
                                                                    ?.credential?.download
                                                                    ? `${node?.access?.credential?.download}?access=${accessToken}&itemId=${node?.id}`
                                                                    : '#'
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className='w-full'
                                                        >
                                                            {/* <SquareAsterisk className="mr-2 h-4 w-4" /> */}
                                                            Access
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    node?.access?.credential?.download && (
                                                        <Button
                                                            asChild
                                                            className="font-oswal"
                                                            variant={
                                                                'secondary'
                                                            }
                                                        >
                                                            <a
                                                                href={
                                                                    node?.access?.credential?.download ||
                                                                    '#'
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    )
                                                )}

                                                {/* <Button className=" text-[#333333] font-playfair ">
                                                    <TimerReset /> Renew Product
                                                </Button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <Separator />

                {/* Total */}
                <section>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Total</h2>
                        <p className="text-2xl font-semibold">
                            ৳{toFixed(myOrder.totalPrice)}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
