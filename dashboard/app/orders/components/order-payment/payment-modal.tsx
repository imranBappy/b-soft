'use client';
import { useQuery, useMutation } from '@apollo/client';
import {
    ORDER_QUERY,
    // ORDERS_QUERY,
    PAYMENT_QUERY
} from '@/graphql/product/queries';
import {
    Form,
} from "@/components/ui/form"
import {
    // ORDER_ITEM_TYPE, ORDER_MUTATION,
    PAYMENT_MUTATION
} from '@/graphql/product';
import { PAYMENT_STATUSES, PAYMENT_STATUSES_LIST } from '@/constants/payment.constants';
// import { ORDER_STATUSES } from '@/constants/order.constants';

import { toast } from '@/hooks/use-toast';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { randomId } from '@/lib/utils';
import { Button } from '@/components/button';
import { SwitchItem, TextField } from '@/components/input';
import { PAYMENT_METHODS_TYPE } from '@/constants/payment.constants';
import Modal, { BUTTON_VARIANT_TYPE } from '@/components/modal';
import { useEffect, useState } from 'react';
// import { PAYMENTS_QUERY } from '@/graphql/product/queries';


// interface ProductNode {
//     node: ORDER_ITEM_TYPE;
// }


const paymentFormSchema = z.object({
    order: z.string(),
    amount: z.string(),
    trx_id: z.string().min(10),
    status: z.string().min(3),
    payment_method: z.string().min(3),
    remarks: z.string().optional(),
})


type paymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentProps {
    orderId?: string | undefined;
    disabled?: boolean,
    onPaymentRequest?: () => void;
    openBtnName: string
    variant?: BUTTON_VARIANT_TYPE,
    id?: string
    openBtnClassName?: string
}

const PaymentModal = ({ openBtnClassName = 'w-full', id, variant = 'default', orderId, disabled = false, onPaymentRequest, openBtnName }: PaymentProps) => {
    const [isModelOpen, setIsModalOpen] = useState(false)
    const [_orderId, setOrderId] = useState<string | undefined>(undefined)
    useEffect(() => {
        setOrderId(orderId)
        return () => {
            setOrderId(undefined)
        }
    }, [orderId])

    const paymentForm = useForm<paymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            trx_id: `${randomId()}`,
            status: PAYMENT_STATUSES.COMPLETED,
            payment_method: "CASH",
            order: String(_orderId)
        }
    })
    const { data, loading } = useQuery(ORDER_QUERY, {
        variables: { id: Number(_orderId) },
        onCompleted: (res) => {
            
            paymentForm.setValue('order', res?.order?.id)
            paymentForm.setValue('amount', `${parseInt(res?.order?.due) ? res?.order?.due : parseFloat(res?.order?.finalAmount)}`)
            paymentForm.setValue('trx_id', `${randomId()}`)
        },
        skip: !_orderId
    });

    const [createPayment, { loading: paymentLoading }] = useMutation(PAYMENT_MUTATION, {
        onCompleted: () => {
            setIsModalOpen(false)
            setOrderId(undefined)
        }
    })
    // const [updateStatus, { loading: orderLoading }] = useMutation(ORDER_MUTATION, {
    //     refetchQueries:
    //         [
    //             { query: ORDER_QUERY, variables: { id: _orderId } },
    //             { query: ORDERS_QUERY },
    //             {
    //                 query: PAYMENTS_QUERY, variables: {
    //                     first: 10,
    //                     offset: 0,
    //                     search: ""
    //                 }
    //             }
    //         ],

    // });

    useQuery(PAYMENT_QUERY, {
        variables: {
            id: id
        },
        onCompleted: ({ payment }) => {
            paymentForm.setValue('order', payment?.order.id)
            paymentForm.setValue('amount', payment?.amount)
            paymentForm.setValue('trx_id', payment?.trxId)
            paymentForm.setValue('status', payment?.status)
            paymentForm.setValue('remarks', payment?.remarks)
            paymentForm.setValue('payment_method', payment?.payment_method)
        },
        skip: !id
    })
    const order = data?.order;

    const handlePayment = async (data: paymentFormValues) => {
        try {
            if (!_orderId && !id) {
                toast({
                    title: 'Order Id or Payment id not found!',
                    variant: 'destructive'
                })
                return;
            }
            if (Number(parseFloat(`${data.amount}`).toFixed(2)) < 1) {
                toast({
                    title: 'Amount Error',
                    description: 'Minmum amount 1',
                    variant: 'destructive'
                })
                return;
            }

            if (parseFloat(parseFloat(`${data.amount}`).toFixed(2)) > parseFloat(order.finalAmount)) {
                toast({
                    title: 'Amount Error',
                    description: 'Amount can not be greater than order amount',
                    variant: 'destructive'
                })
                return;
            }

            await createPayment({
                variables: {
                    id: id,
                    amount: parseFloat(`${data.amount}`).toFixed(2),
                    order: data.order,
                    paymentMethod: data.payment_method,
                    status: data.status,
                    trxId: data.trx_id,
                    remarks: data.remarks,
                    isCart: false
                }
            })
            // if (!id) {
            //     await updateStatus({
            //         variables: {
            //             id: _orderId,
            //             status: ORDER_STATUSES.COMPLETED,
            //             paymentMethod: order?.paymentMethod,
            //             items: order?.items?.edges?.map(({ node }: ProductNode) => node.id),
            //             finalAmount: order?.finalAmount,
            //             amount: order?.amount,
            //             type: order?.type,
            //             address: order?.address?.id,
            //             user: order?.user?.id,
            //             outlet: order?.outlet?.id,
            //             isCart: false
            //         },
            //     });
            // }

            setOrderId(undefined)
            paymentForm.reset()
            // toast({
            //     title: 'Payment',
            //     description: 'Payment successfully.',
            // })
        } catch (error: unknown) {
            toast({
                title: 'Payment',
                description: (error as Error).message,
                variant: 'destructive',
            })
        }
    }
    // if (loading) return <Loading />;

    return (
        <Modal
            openBtnClassName={openBtnClassName}
            openBtnName={openBtnName}
            title='Payment'
            className='max-w-2xl'
            disabled={paymentLoading || disabled || loading}
            variant={variant}
            isCloseBtn={false}
            open={(isModelOpen && !disabled)}
            onOpenChange={setIsModalOpen}
            onOpen={onPaymentRequest}
        >
            <Form  {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePayment)} className="space-y-6 p-4">
                    {/* Order Information */}
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
                                options={PAYMENT_STATUSES_LIST.map((status) => ({ label: status, value: status }))}
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
                    <Button disabled={paymentLoading || loading}>
                        {
                            id ? "Payment Update" : "Payment"
                        }
                    </Button>
                </form>
            </Form>
        </Modal>
    );
};

export default PaymentModal;