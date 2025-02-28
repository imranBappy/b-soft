'use client';
import { useQuery, useMutation } from '@apollo/client';
import { ADDRESS_QUERY, ORDER_QUERY } from '@/graphql/product/queries';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ORDER_MUTATION, PAYMENT_MUTATION } from '@/graphql/product';
import { PAYMENT_STATUSES } from '@/constants';
import { Input, Loading } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { randomId } from '@/lib/utils';
import { Button } from '@/components/button';
import { useRouter } from 'next/navigation';
import { USER_REGISTER } from '@/graphql/accounts';
import { SwitchItem, TextareaField, TextField } from '@/components/input';
import { PAYMENT_METHODS_TYPE } from '@/constants/payment.constants';

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


const paymentFormSchema = z.object({
    order: z.string(),
    amount: z.number().min(10),
    trx_id: z.string().min(10),
    status: z.string().min(3),
    payment_method: z.string().min(3),
    remarks: z.string().optional(),

    // user info 
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().min(9).max(15).optional(),

    // address info
    city: z.string().optional(),
    area: z.string().optional(),
    street: z.string().optional(),
    house: z.string().optional(),
    address: z.string().optional(),
})


type paymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentProps {
    orderId: string | undefined;
}

const Payment = ({ orderId }: PaymentProps) => {
    const paymentForm = useForm<paymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            trx_id: `${randomId()}`,
            status: "COMPLETED",
            payment_method: "CASH",
            order: String(orderId)
        }
    })
    const router = useRouter()
    const { data, loading, error } = useQuery(ORDER_QUERY, {
        variables: { id: Number(orderId) },
        onCompleted: (res) => {
            paymentForm.setValue('order', res?.order?.id)
            paymentForm.setValue('amount', Number(res?.order?.totalPrice))
        }
    });
    const [updateStatus] = useMutation(ORDER_MUTATION, {
        refetchQueries: [{ query: ORDER_QUERY, variables: { id: orderId } }],
    });
    const [createPayment, { loading: paymentLoading }] = useMutation(PAYMENT_MUTATION)
    const [registerUser, { loading: registerUserLoading }] = useMutation(USER_REGISTER)
    const [createAddress, { loading: addressLoading }] = useMutation(ADDRES_MUTATION)


    const { data: address_data } = useQuery(ADDRESS_QUERY, {
        variables: {
            user: data?.order?.user?.id
        },
        onCompleted: (res) => {
            paymentForm.setValue("name", res?.address?.user?.name)
            paymentForm.setValue("email", res?.address?.user?.email)
            paymentForm.setValue("phone", res?.address?.user?.phone)
            paymentForm.setValue('city', res?.address?.city)
            paymentForm.setValue('area', res?.address?.area)
            paymentForm.setValue('street', res?.address?.street)
            paymentForm.setValue('house', res?.address?.house)
            paymentForm.setValue('address', res?.address?.address)
        },
        skip: !data?.order?.user?.id
    })


    const handlePayment = async (data: paymentFormValues) => {
        try {
            let userId = address_data?.address?.user?.id;
            const addressId = address_data?.address?.id
            if (!userId && data.name && data.email) {
                const user_res = await registerUser({
                    variables: {
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        password: `password_${data.trx_id}`,
                    },
                });
                userId = user_res?.data?.registerUser?.id;
            }
            await createPayment({
                variables: {
                    amount: parseFloat(`${data.amount}`).toFixed(2),
                    order: data.order,
                    paymentMethod: data.payment_method,
                    status: data.status,
                    trxId: data.trx_id,
                    remarks: data.remarks,
                }
            })
            await updateStatus({
                variables: {
                    id: orderId,
                    status: 'CONFIRMED',
                    paymentMethod: order?.paymentMethod,
                    items: order?.items?.edges?.map(({ node }: ProductNode) => node.id),
                    totalPrice: order?.totalPrice,
                    type: order?.type,
                    address: order?.address?.id,
                    user: userId,
                    outlet: order?.outlet?.id,
                },
            });

            if ((data.city || data.area || data.street || data.house || data.address) && userId) {
                await createAddress({
                    variables: {
                        id: addressId,
                        user: userId,
                        city: data.city,
                        area: data.area,
                        street: data.street,
                        house: data.house,
                        address: data.address
                    }
                })
            }

            toast({
                title: 'Payment',
                description: 'Payment successfully.',
            })
            router.push('/orders')
        } catch (error: unknown) {
            toast({
                title: 'Payment',
                description: (error as Error).message,
                variant: 'destructive',
            })
        }
    }

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    const order = data.order;
    return (
        <Form  {...paymentForm}>
            <form onSubmit={paymentForm.handleSubmit(handlePayment)} className="space-y-6 p-4">
                {/* Customer Information */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg tracking-tight">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">

                            <TextField
                                form={paymentForm}
                                name="name"
                                label="Name"
                                placeholder="Enter Name"
                                className="w-full h-11"
                                itemClassName='w-full'
                            />
                            <TextField
                                form={paymentForm}
                                name="email"
                                label="Email"
                                type='email'
                                placeholder="Enter Email"
                                className="w-full h-11"
                                itemClassName='w-full'
                            />
                            <TextField
                                form={paymentForm}
                                name="phone"
                                label="Phone"
                                placeholder="Enter phone"
                                className="w-full h-11"
                                itemClassName='w-full'
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Order Information */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg tracking-tight">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <TextField
                                    form={paymentForm}
                                    name="amount"
                                    label="Amount"
                                    type='number'
                                    placeholder="Enter amount"
                                    className="w-full h-11"
                                    itemClassName='w-full'
                                />
                            </div>
                            <div className="space-y-2">
                                <SwitchItem
                                    form={paymentForm}
                                    name="status"
                                    label="Status"
                                    options={PAYMENT_STATUSES.map((status) => ({ label: status, value: status }))}
                                    placeholder="Select Status"
                                />
                            </div>
                            <div className="space-y-2">
                                <SwitchItem
                                    form={paymentForm}
                                    name="payment_method"
                                    label="Payment Method"
                                    options={PAYMENT_METHODS_TYPE.map((item) => ({ label: item, value: item }))}
                                    placeholder="Select payment "
                                />
                            </div>
                            <div className="space-y-2">
                                <TextField
                                    form={paymentForm}
                                    name="remarks"
                                    label="Remark"
                                    placeholder="Remark"
                                    className="w-full h-11"
                                    itemClassName='w-full'
                                />
                            </div>
                        </div>
                        <Separator className="my-8" />
                        <div className="space-y-4">
                            <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Delivery Address</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">

                                <TextField
                                    form={paymentForm}
                                    name="city"
                                    label="City"
                                    placeholder="City"
                                    className="w-full h-11"
                                    itemClassName='w-full'
                                />
                                <TextField
                                    form={paymentForm}
                                    name="area"
                                    label="Area"
                                    placeholder="Area"
                                    className="w-full h-11"
                                    itemClassName='w-full'
                                />

                                <FormField
                                    control={paymentForm.control}
                                    name="street"
                                    render={({ field }) => (
                                        <FormItem  >
                                            <FormLabel>Street</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Street"
                                                    {...field}
                                                    className="pl-5 w-full h-11"
                                                    onChange={e => field.onChange(e.target.value)}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <TextField
                                    form={paymentForm}
                                    name="house"
                                    label="House"
                                    placeholder="House"
                                    className="w-full h-11"
                                    itemClassName='w-full'
                                />
                                <TextareaField
                                    form={paymentForm}
                                    name="address"
                                    label="Address"
                                    placeholder="Address"
                                    className="w-full h-11"
                                />


                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit" isLoading={paymentLoading || registerUserLoading || addressLoading} > Payment</Button>
            </form>
        </Form>
    );
};

export default Payment;