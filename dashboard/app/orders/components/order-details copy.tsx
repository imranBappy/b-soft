'use client';
import { useQuery, useMutation } from '@apollo/client';
import { ADDRESS_QUERY, ORDER_QUERY } from '@/graphql/product/queries';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from '@/components/ui/image';
import { ORDER_ITEM_TYPE, ORDER_MUTATION, PAYMENT_TYPE } from '@/graphql/product';
import { ORDER_STATUSES } from '@/constants/order.constants';
import { Loading } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { getStatusStyle, getThumblain } from '@/lib/utils';
import moment from 'moment';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import { ADDRESS_TYPE, USER_TYPE } from '@/graphql/accounts';
import { OUTLET_TYPE } from '@/graphql/outlet/types';



interface PROPS_TYPE {
    order: {
        id: string;
        user: USER_TYPE;
        paymentMethod: string;
        finalAmount: number;
        status: string;
        createdAt: string;
        orderItems: ORDER_ITEM_TYPE[];
        address: ADDRESS_TYPE;
        type: string;
        orderId: string
        outlet: OUTLET_TYPE
        items: {
            edges: ORDER_ITEM_NOTE_TYPE[]
        }
    }
}
type ORDER_ITEM_NOTE_TYPE = {
    node: ORDER_ITEM_TYPE
}

const Invoice = ({ order }: PROPS_TYPE) => {

    const generatePDF = () => {
        const content = document.getElementById("invoice-content");
        if (content) {
            html2canvas(content, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");
                // Adjust image size to fit A4 dimensions
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let position = 0;
                if (imgHeight > pageHeight) {
                    // If content overflows, add pages
                    while (position < imgHeight) {
                        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                        position += pageHeight;
                        if (position < imgHeight) pdf.addPage();
                    }
                } else {
                    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
                }
                const link = document.createElement("a");
                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = "invoice.pdf";
                link.click();
                URL.revokeObjectURL(url);
            });
        }
    };

    const handlePrint = () => {
        const content = document.getElementById("invoice-content");
        if (content) {
            html2canvas(content).then((canvas) => {
                const printWindow = window.open("", "", "width=800,height=600");
                printWindow?.document.write("<html><body><img src='" + canvas.toDataURL("image/png") + "'></body></html>");
                printWindow?.document.close();
                printWindow?.print();
            });
        }
    };

    return (
        <div className="p-8 ">
            <div
                id="invoice-content"
                className="max-w-3xl mx-auto   p-8 text-black"
            >
                {/* Header Section */}
                <div className="border-b pb-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold ">INVOICE</h1>
                            <p className="text-sm  ">Order ID: #{order.id}</p>
                            <p className="text-sm ">
                                Date: {new Date(order?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-lg font-semibold">{order?.outlet?.name}</h2>
                            <p className="text-sm">123 Business Street</p>
                            <p className="text-sm">{order?.outlet?.address}</p>
                            <p className="text-sm">Email: {order?.outlet?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">Customer Details:</h3>
                    <p className="text-sm">{order.user?.name || "Walk-in Customer"}</p>
                    <p className="text-sm">{order.user?.email || "No Email Address"}</p>
                </div>

                {/* Address Section */}
                {order.address && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold">Delivery Address:</h3>
                        <p className="text-sm">{order.address.street}</p>
                        <p className="text-sm">
                            {order.address.city}, {order.address.state}
                        </p>
                    </div>
                )}

                {/* Items Table */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Order Items:</h3>
                    <table className="w-full border-collapse border  text-sm">
                        <thead>
                            <tr className="bg-gray-200  text-left">
                                <th className="border  px-4 py-2">Product</th>
                                <th className="border  px-4 py-2">Quantity</th>
                                <th className="border  px-4 py-2">Price</th>
                                <th className="border  px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.edges.map(({ node }, index: number) => (
                                <tr
                                    key={node.id}
                                    className={index % 2 === 0 ? "bg-gray-100 " : ""}
                                >
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {node?.product?.name || 'Unknown'}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        {node?.quantity}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        ${node?.price}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                        ${node?.quantity * node?.price}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="text-right">
                    <p className="text-lg font-semibold">
                        Total Price: <span className="">${order.finalAmount}</span>
                    </p>
                </div>
            </div>

            {/* Download Button */}
            <div className="mt-8 text-center">
                <button
                    className="px-6 py-3 bg-blue-600  text-sm font-medium rounded-lg shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    onClick={generatePDF}
                >
                    Download Invoice
                </button>
                <button
                    className="ml-4 px-6 py-3 bg-blue-600  text-sm font-medium rounded-lg shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
                    onClick={handlePrint}
                >
                    Print Invoice
                </button>
            </div>
        </div>
    );
};
interface ProductNode {
    node: {
        id: string;
        product: {
            name: string;
            images: string;
            price: number;
        };
        quantity: number;
        price: number;
    };
}
const OrderDetails = ({ orderId }: { orderId: string }) => {
    const { data, loading, error } = useQuery(ORDER_QUERY, {
        variables: { id: Number(orderId) },
    });
    const { data: addressRes } = useQuery(ADDRESS_QUERY, {
        variables: { user: data?.order?.user?.id },
        skip: !data?.order?.user?.id,
    });


    const [updateStatus] = useMutation(ORDER_MUTATION, {
        refetchQueries: [{ query: ORDER_QUERY, variables: { id: orderId } }],
    });

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateStatus({
                variables: {
                    id: orderId,
                    status: newStatus,
                    paymentMethod: order?.paymentMethod,
                    // items: order?.items?.edges?.map(({ node }: ProductNode) => node.id),
                    finalAmount: order?.finalAmount,
                    amount: order?.finalAmount,
                    due: order?.due,
                    type: order?.type,
                    user: order?.user?.id,
                    outlet: order?.outlet?.id,
                },
            });
            toast({
                title: 'Order Status Updated',
                description: 'The order status has been updated successfully.',
            })
        } catch (error) {
            toast({
                title: 'Failed to update status',
                description: error instanceof Error ? error.message : 'An unknown error occurred',
                variant: 'destructive',
            })
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const order = data.order;
    // const address = addressRes?.address;
    const payments = order?.payments;


    return (
        <div className="space-y-6 p-4">
            {/* Customer Information */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={order?.user?.photo || ''} />
                            <AvatarFallback>{order?.user?.name[0] || 'w'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-medium tracking-tight">{order?.user?.name || 'Walk-in Customer'}</p>
                            <p className="text-sm text-muted-foreground">{order?.user?.email || 'No email address'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Information */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Order ID</p>
                            <p className="font-medium">#{order?.id}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                            <Select
                                defaultValue={order.status}
                                value={order.status}
                                onValueChange={handleStatusChange}
                                disabled={order.status === ORDER_STATUSES.COMPLETED}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem disabled value={ORDER_STATUSES.COMPLETED}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.COMPLETED)} border-0`}>
                                            {ORDER_STATUSES.COMPLETED}
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem disabled value={ORDER_STATUSES.DUE}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.DUE)} border-0`}>
                                            {ORDER_STATUSES.DUE}
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem value={ORDER_STATUSES.PENDING}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.PENDING)} border-0`}>
                                            {ORDER_STATUSES.PENDING}
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem value={ORDER_STATUSES.CANCELLED}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.CANCELLED)} border-0`}>
                                            {ORDER_STATUSES.CANCELLED}
                                        </Badge>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Type</p>
                            <p>{order?.type?.split("_").join(" ")}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Total Price</p>
                            <p className="font-medium">${order?.finalAmount}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Create At</p>
                            <p>{moment(order?.createAt).fromNow()}</p>
                        </div>
                    </div>
                    {
                        addressRes?.address && (<>
                            <Separator className="my-8" />
                            <div className="space-y-4">
                                <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Delivery Address</h3>
                                <div className="space-y-1">
                                    <p className="text-sm">{addressRes?.address?.street}</p>
                                    <p className="text-sm">{addressRes?.address?.city}, {addressRes?.address?.state} {addressRes?.address?.zipCode}</p>
                                </div>
                            </div>
                        </>)
                    }

                </CardContent>
            </Card>

            {/* Payment */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Payment</CardTitle>
                </CardHeader>

                {/* array of payment */}
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Amount</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Payment Method</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Remarks</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Status</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Transaction ID</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments?.edges?.map(({ node }: { node: PAYMENT_TYPE }) => (
                                <TableRow key={node.id}>
                                    <TableCell className="py-4">${node.amount}</TableCell>
                                    <TableCell className="py-4">{node.paymentMethod}</TableCell>
                                    <TableCell className="py-4">{node.remarks}</TableCell>
                                    <TableCell className="py-4">
                                        <Badge className={`${getStatusStyle(node.status)} border-0`}>
                                            {node.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">{node.trxId}</TableCell>
                                    <TableCell className="py-4">{moment(node.createdAt).fromNow()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>

            </Card>

            {/* Order Items */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Product</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Quantity</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Price</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.items?.edges?.map(({ node }: ProductNode) => (
                                <TableRow key={node.id}>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={getThumblain(node?.product?.images)}
                                                alt={node?.product?.name}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover"
                                            />
                                            <span className="font-medium">{node?.product?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">{node?.quantity}</TableCell>
                                    <TableCell className="py-4">${node?.price}</TableCell>
                                    <TableCell className="py-4 font-medium">${node?.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Invoice */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Invoice</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Invoice order={order} />
                </CardContent>
            </Card>

        </div>
    );
};

export default OrderDetails;