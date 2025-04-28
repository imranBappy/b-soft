"use client"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES_QUERY, DESCRIPTION_QUERY, PRODUCT_DESCRIPTION_MUTATION, } from "@/graphql/product"
import {
    Form,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
    Loading,
} from "@/components/ui"
import { TextField } from "@/components/input/text-field"
import Button from "@/components/button"
import Editor from "@/components/Editor"
import { useSearchParams } from 'next/navigation'

const productFormSchema = z.object({
    label: z.string().min(2, "Label must be at least 2 characters"),
    tag: z.string().min(2, "Tag must be at least 2 characters"),
    description: z.string()
})

type ProductFormValues = z.infer<typeof productFormSchema>

export function DescriptionForm() {
    const searchParams = useSearchParams()
    const productId = searchParams.get('productId')
    const id = searchParams.get('descriptionId');
    const { toast } = useToast()
    const router = useRouter();
    
    const [createProductDescription, { loading: create_loading }] = useMutation(PRODUCT_DESCRIPTION_MUTATION, {
        refetchQueries: [{
            query: CATEGORIES_QUERY, variables: {
                offset: 0,
                first: 10,
                search: ""
            }
        }],
        awaitRefetchQueries: true,
        onCompleted(){
            router.push(
                `/product/descriptions?productId=${productId}`
            );
            if (id) {
                toast({
                    title: 'Success',
                    description: 'Product updated successfully',
                });
            }else{
                toast({
                    title: 'Success',
                    description: 'Product created successfully',
                });
            }
             
             form.reset({
                 description: '',
                 label: '',
                 tag: '',
             });

        }
    })


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
    })

    const {loading:descriptionLoading} = useQuery(DESCRIPTION_QUERY,{
        variables:{
            id:id
        },
        skip:!id,
        onCompleted(res){
            const description = res?.productDescription;
            if (description?.label) {
                form.setValue('label', description?.label);
            }
            if (description?.tag) {
                form.setValue('tag', description?.tag);
            }
            if (description?.description) {
                form.setValue('description', description?.description);
            }
        }
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
                    id:  id || undefined,
                },
            })
           


        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }





    if (descriptionLoading) return <Loading />;


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-4xl mx-auto"
            >
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {id ? 'Update Description ' : 'Create Description '}
                        </CardTitle>
                        <CardDescription>
                            {id
                                ? 'Update description'
                                : 'Add a new description to your product'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <TextField
                                form={form}
                                name="label"
                                label="Label"
                                placeholder="Enter label"
                            />
                            <TextField
                                form={form}
                                name="tag"
                                label="Tag"
                                placeholder="Enter tag ( description )"
                            />
                        </div>
                        <div className="space-y-4">
                            <Separator />
                            <Editor
                                onChange={(value) => {
                                    form.setValue('description', value);
                                }}
                                value={form.watch('description') ?? ''}
                            />
                        </div>

                        <Button type="submit" isLoading={create_loading}>
                            {id ? 'Update Description' : 'Create Description'}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
export default DescriptionForm