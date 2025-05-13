"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Button from "@/components/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CREDENTIAL_TYPE, CREDENTIALS_QUERY, PRODUCT_MUTATION, PRODUCT_QUERY, PRODUCTS_QUERY } from "@/graphql/product"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import uploadImageToS3, { deleteImageFromS3, uploadImagesToS3 } from "@/lib/s3"
import { useState } from "react"
import Loading from "@/components/ui/loading"
import { FileInput } from "@/components/ui/file-input"

import { renamedFile, jsonToImages, randomId } from "@/lib/utils"
import { TextField } from "@/components/input"
import { useRouter } from "next/navigation"
import { TAGS_CHOOSE } from "@/constants/product.constants"
import Editor from "@/components/Editor"
import ProductImages from "@/app/product/components/forms/product-images"

const productFormSchema = z.object({
    cookies: z.string(),
    expireDate: z.date(),
    accessLimit: z.number(),
    note: z.string().optional(),

})

type ProductFormValues = z.infer<typeof productFormSchema>

export interface IMAGE_TYPE {
    id?: string;
    file: File;
    url: string;
}
export function AccessWithExtension({ id }: { id?: string }) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {}
    })
    const [createProduct, { loading: create_loading }] = useMutation(PRODUCT_MUTATION, {
        refetchQueries: [{
            query: PRODUCTS_QUERY,
            variables: {
                offset: 0,
                first: 10,
                search: "",
                category: null,
                tag: "",
                price: 0,
                priceLte: null,
                orderBy: ""
            }
        }]
    })

    const { data: credentials_res, loading: credentials_loading } = useQuery(CREDENTIALS_QUERY, {
        variables: {
            first: 30,
            offset: 0
        }
    })


    const categories: OPTION_TYPE[] = credentials_res?.credentials.edges.map((edge: { node: CREDENTIAL_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))

    async function onSubmit(data: ProductFormValues) {
        try {
            await createProduct({
                variables: {
                    ...data,
                    id: id || undefined
                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({

            })
            if (id) router.push('/product')
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }


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
                                    options={categories}
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