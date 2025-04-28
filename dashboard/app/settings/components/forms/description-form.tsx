"use client"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES_QUERY, PRODUCT_DESCRIPTION_MUTATION, } from "@/graphql/product"
import {
    Form,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
} from "@/components/ui"
import { TextField } from "@/components/input/text-field"
import { TextareaField } from "@/components/input/textarea-field"
import Button from "@/components/button"
import Editor from "@/components/Editor"
import { useSearchParams } from 'next/navigation'

const productFormSchema = z.object({
    label: z.string().min(2, "Label must be at least 2 characters"),
    tag: z.string().min(2, "Tag must be at least 2 characters"),
    description: z.string()
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function DescriptionForm({ id }: { id?: string }) {
    const searchParams = useSearchParams()
    const productId = searchParams.get('productId')
    const { toast } = useToast()
    const [createProductDescription, { loading: create_loading }] = useMutation(PRODUCT_DESCRIPTION_MUTATION, {
        refetchQueries: [{
            query: CATEGORIES_QUERY, variables: {
                offset: 0,
                first: 10,
                search: ""
            }
        }],
        awaitRefetchQueries: true
    })
    const router = useRouter()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),

    })





    async function onSubmit(data: ProductFormValues) {
        try {
            if (!productId) {
                toast({ variant: "destructive", description: "you can't add the description " })
                return
            }
            await createProductDescription({
                variables: {
                    ...data,
                    product: productId,
                    id: id || undefined,
                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({
                description: "",
                label: "",
                tag: "",
            })

            router.push(`/product/description/`)

        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }







    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {
                                id ? "Update " : "Create "
                            }
                        </CardTitle>
                        <CardDescription>
                            {
                                id ? "Update" : "Add a new category to your inventory"
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">

                            <TextField form={form} name="label" label="Label" placeholder="Enter label" />
                            <TextareaField form={form} name="tag" label="Tag" placeholder="Enter tag" />
                        </div>
                        <div className="space-y-4">
                            <Separator />
                            <Editor
                                onChange={(value) => { form.setValue('description', value) }}
                                value={form.watch("description") ?? ""} />
                        </div>

                        <Button type="submit" isLoading={create_loading} >
                            {
                                id ? "Update " : "Create "
                            }
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
export default DescriptionForm