"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Button from "@/components/button"
import {
    Form,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CREDENTIAL_TYPE, CREDENTIALS_QUERY, ORDERS_QUERY, PRODUCT_ACCESS_MUTATION } from "@/graphql/product"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import { useEffect } from "react"
import Loading from "@/components/ui/loading"
import { TextField } from "@/components/input"
import { useRouter, useSearchParams } from "next/navigation"

const productFormSchema = z.object({
    cookies: z.string(),
    expireDate: z.string(),
    accessLimit: z.number(),
    note: z.string().optional(),
    download: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>


export function AccessWithExtension({ id }: { id?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const params = useSearchParams()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {}
    })
    const selectedCookie = form.watch("cookies")
    const [productAccess, { loading: create_loading }] = useMutation(PRODUCT_ACCESS_MUTATION, {
        refetchQueries: [{
            query: ORDERS_QUERY,
            variables: {
                offset: 0,
                first: 10,
                search: '',
                status: undefined,
                type: undefined,
                orderBy: undefined,
            }
        }]
    })

    const { data: credentials_res, loading: credentials_loading } = useQuery(CREDENTIALS_QUERY, {
        variables: {
            first: 30,
            offset: 0
        }
    })


    const credentials: OPTION_TYPE[] = credentials_res?.credentials.edges.map((edge: { node: CREDENTIAL_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))

    async function onSubmit(data: ProductFormValues) {
        try {
            const selectedItemCookie = credentials_res?.credentials?.edges?.find((edge: { node: CREDENTIAL_TYPE }) => String(edge?.node?.id) === selectedCookie)
            const itemId = params.get('itemId')
            await productAccess({
                variables: {
                    ...data,
                    cookies: selectedItemCookie?.node?.cookies,
                    item: itemId,
                },
            })
            toast({
                title: "Success",
                description: "Product access created successfully",
            })
           router.push('/orders')
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        const selectedItemCookie = credentials_res?.credentials?.edges?.find((edge: { node: CREDENTIAL_TYPE }) => `${edge?.node?.id}` === selectedCookie)
        if (selectedItemCookie?.node) {
            form.setValue('download', selectedItemCookie?.node?.download)
            form.setValue('accessLimit', selectedItemCookie?.node?.accessLimit)
            form.setValue('note', selectedItemCookie?.node?.note)
        }
    }, [selectedCookie, credentials_res, form])


    if (credentials_loading) return <Loading />


    return (
        <Form {...form}>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full  mx-auto"
            >
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {id ? 'Update Access' : 'Create Access'}
                        </CardTitle>
                        <CardDescription>
                            {id
                                ? 'Update access details'
                                : 'Add a new access to your datebase'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">

                            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                                <SwitchItem
                                    disabled={credentials_loading}
                                    form={form}
                                    name="cookies"
                                    label="Access"
                                    options={credentials}
                                    placeholder="Select access"
                                />

                                <TextField
                                    form={form}
                                    name="accessLimit"
                                    label="Access Limit"
                                    placeholder="Enter limit"
                                    type="number"
                                />
                                <TextField
                                    form={form}
                                    name="expireDate"
                                    label="Expire Date"
                                    placeholder="Enter date"
                                    type="date"
                                />
                                <TextField
                                    form={form}
                                    name="note"
                                    label="Note"
                                    placeholder="Enter product name"
                                />
                            </div>
                        </div>

                        <Button type="submit" isLoading={create_loading}>
                            {id ? 'Update Access' : 'Create Access'}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}