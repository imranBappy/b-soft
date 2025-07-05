"use client"

import OrderOverview from './OrderOverview';
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SwitchItem, TextField } from '@/components/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import useStore from '@/stores';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_ORDER_MUTATION } from '@/graphql/product';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ME_QUERY } from '@/graphql/accounts/queries';
import Loading from '@/components/ui/loading';
import { useRouter } from 'next/navigation';


const orderForm = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    email: z.string().email().toLowerCase().min(5, {
        message: "Email must be valid",
    }),
    phone: z.string().min(11, {
        message: "WhatsApp number must be at least 11 digit.",
    }).optional(),

    // paymentInfo
    accountNumber: z.string().min(11, {
        message: "acccount number must be at least 11 digit.",
    }),
    trxId: z.string().optional(),
    paymentMethod: z.string()
})
const Checkout = () => {
    const form = useForm<z.infer<typeof orderForm>>({
        resolver: zodResolver(orderForm),
    })
    const carts = useStore((store) => store.cart)
    const clearCart = useStore((store) => store.clearCart);
    const router = useRouter()

    const { toast } = useToast()

    const { loading: meLoading, data: meDate } = useQuery(ME_QUERY, {
        onCompleted: (data) => {
            const { name, email, phone } = data?.me;
            form.setValue('name', name || '');
            form.setValue('email', email || '');
            if (phone) form.setValue('phone', phone || '');
        },
        fetchPolicy: 'network-only'
    });

    const [createOrder, { loading }] = useMutation(CREATE_ORDER_MUTATION, {
        onCompleted: () => {
            toast({ description: "Order successfully  created!" })
            form.reset();
            clearCart();
            router.push('/customer/orders')
        },
        onError: (e) => {
            toast({ variant: "destructive", description: e.message })
        }
    })

    const handleOrder = async (data: z.infer<typeof orderForm>) => {
        const userInfo = {
            userName: data.name,
            userEmail: data.email,
            phone: data.phone
        }
        const paymentInfo = {
            accountNumber: data.accountNumber,
            trxId: data.trxId,
            paymentMethod: data.paymentMethod,
        };
        const products = carts.map((cart) => ({
            productId: cart.productId,
            quantity: cart.quantity,
            attributes: cart?.attributes?.length ? cart?.attributes?.map((op) => ({ attributeId: op.attribute, optionId: op.option })) : undefined
        }))

        await createOrder({
            variables: {
                input: {
                    ...userInfo,
                    payment: paymentInfo,
                    products
                }
            }
        })
    }

    if (meLoading) return <div className="  md:h-[600px] h-[300px]  flex items-center justify-center">
        <Loading />
    </div>
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOrder)} className='w-full container flex flex-col gap-5' >
                <div className="w-full mt-5  flex gap-5 flex-wrap md:flex-nowrap ">
                    <Card className={meDate?.me?.id ? `hidden` : `w-full rounded`}>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                            <CardDescription>Enter you information bellow.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">

                                        <TextField
                                            form={form}
                                            name="name"
                                            label="Name"
                                            placeholder="Name"
                                        />

                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <TextField
                                            form={form}
                                            name="email"
                                            label="Email"
                                            placeholder="Email"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <TextField
                                            form={form}
                                            name="phone"
                                            label="WhatsApp Number"
                                            placeholder="WhatsApp Number"
                                        />
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="w-full rounded">
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                            <CardDescription>Enter you payment information bellow.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <SwitchItem
                                            form={form}
                                            name="paymentMethod"
                                            label="Paymet Method"
                                            placeholder="Paymet Method"
                                            options={[
                                                {
                                                    label: "Bkash",
                                                    value: "BKASH",
                                                },
                                                {
                                                    label: "Nagad",
                                                    value: "NAGAD",
                                                },
                                                {
                                                    label: "Rocket",
                                                    value: "ROCKET",
                                                }
                                            ]}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <TextField
                                            form={form}
                                            name="accountNumber"
                                            label="Account Number"
                                            placeholder="Account Number"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <TextField
                                            form={form}
                                            name="trxId"
                                            label="Transaction ID"
                                            placeholder="Transaction ID"
                                        />
                                    </div>

                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                <OrderOverview />
                <div className='flex flex-col items-end'>
                    <Button disabled={loading} type='submit'>Confirm Order</Button>
                </div>
            </form>

        </Form>

    );
};

export default Checkout;