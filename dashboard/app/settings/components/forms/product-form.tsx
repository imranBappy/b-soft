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
import { CATEGORIES_QUERY, CATEGORY_TYPE, PRODUCT_MUTATION, PRODUCT_QUERY, PRODUCTS_QUERY } from "@/graphql/product"
import { OPTION_TYPE, SwitchItem } from "@/components/input/switch-item"
import uploadImageToS3, { deleteImageFromS3, uploadImagesToS3 } from "@/lib/s3"
import { useState } from "react"
import Loading from "@/components/ui/loading"
import { FileInput } from "@/components/ui/file-input"
import ProductImages from "./product-images"
import { renamedFile, jsonToImages, randomId } from "@/lib/utils"
import { TextField } from "@/components/input"
import { useRouter } from "next/navigation"
import { TAGS_CHOOSE } from "@/constants/product.constants"
import Editor from "@/components/Editor"


const productFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    price: z.string().refine((val) => parseFloat(val) > 0, {
        message: "Price must be positive",
    }).default('0'),
    shortDescription: z.string().optional(),
    isActive: z.boolean().default(true),
    category: z.string().optional(),
    tag: z.string().optional(),
    photo: z.any().optional(),
    priceRange: z.string().optional(),
    offerPrice: z.string().refine((val) => parseFloat(val) > 0, {
        message: "Price must be positive",
    }).optional()
})

type ProductFormValues = z.infer<typeof productFormSchema>

export interface IMAGE_TYPE {
    id?: string;
    file: File;
    url: string;
}
export function ProductForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            isActive: true,
            price: '0',

        },
    })

    const [imagePreviewUrls, setImagePreviewUrls] = useState<IMAGE_TYPE[]>([])
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
    const router = useRouter()


    const { loading: product_loading, data: product_res } = useQuery(PRODUCT_QUERY, {
        variables: {
            id
        },
        skip: !id,
        onCompleted: async (data) => {
            const photo = await jsonToImages(data?.product?.photo).map((item: string) => ({
                id: randomId(),
                file: null,
                url: item
            }))
            const product = {
                ...data.product,
                category: data.product.category?.id || '',
                price: `${data.product.price}`,
                offerPrice: data.product.offerPrice || undefined,
                priceRange: data.product.priceRange || undefined,

                tag: data?.product?.tag || undefined,
                photo: undefined,
            };

            setImagePreviewUrls(photo)
            form.reset(product);
        },
        onError: (error) => {
            console.error(error);
            router.push('/product')
        }
    })

    const { data: categories_res, loading: categories_loading } = useQuery(CATEGORIES_QUERY)

    const categories: OPTION_TYPE[] = categories_res?.categories.edges.map((edge: { node: CATEGORY_TYPE }) => ({
        value: edge.node.id,
        label: edge.node.name,
    }))
    
    console.log({categories});
    

    const handleChangeFiles = (files: FileList) => {
        const newUrls = Array.from(files).map(file => ({
            id: randomId(),
            file: file,
            url: ""
        })
        );
        setImagePreviewUrls((preState) => [...preState, ...newUrls]);
    };


    async function onSubmit(data: ProductFormValues) {
        try {
            let uploadedFiles: string[] = [];
            const photo: File[] = data.photo ? Array.from(data.photo) : [];
            if (imagePreviewUrls.length > 5) {
                throw new Error("You can only upload a maximum of 5 images");
            }
            if (photo.length && !imagePreviewUrls.length) {
                // Case 1: Only new photo are present
                const renamedImages = photo.map(renamedFile)
                uploadedFiles = await uploadImagesToS3(renamedImages);
            } else if (!photo.length && imagePreviewUrls.length) {
                // Case 2: Only preview URLs are present
                uploadedFiles = imagePreviewUrls.map(item => item.url);
            } else if (photo.length && imagePreviewUrls.length) {
                // Case 3: Both new photo and preview URLs are present
                const uploadPromises = imagePreviewUrls.map(async (item) => {
                    if (item.url) return item.url; // Use existing URL
                    const url = await uploadImageToS3(renamedFile(item.file)); // Upload new file
                    return url;
                });
                uploadedFiles = await Promise.all(uploadPromises);
            }
            const preImages = await jsonToImages(product_res?.product?.photo)
            const deletedImage = [];
            for (let i = 0; i < preImages.length; i++) {
                const findImage = uploadedFiles.find((item) => item === preImages[i]);
                if (!findImage) deletedImage.push(preImages[i])
            }

            if (deletedImage.length) {
                const deletedPromises = deletedImage.map(async (item) => await deleteImageFromS3(item));
                await Promise.all(deletedPromises);
            }
           

            await createProduct({
                variables: {
                    ...data,
                    price: (parseFloat(data.price).toFixed(8)),
                    photo: JSON.stringify(uploadedFiles),
                    id: id || undefined
                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({
                isActive: true,
                name: "",
                price: undefined,
                shortDescription: "",
                category: "",
                tag: "",
                photo: undefined
            })
            setImagePreviewUrls([])
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


    if (product_loading || categories_loading) return <Loading />


    return (
        <Form {...form}>
          
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full  mx-auto"
            >
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {id ? 'Update Product' : 'Create Product'}
                        </CardTitle>
                        <CardDescription>
                            {id
                                ? 'Update product details'
                                : 'Add a new product to your inventory'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-2">
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">
                                                Active
                                            </FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
                                <TextField
                                    form={form}
                                    name="name"
                                    label="Product Name"
                                    placeholder="Enter product name"
                                />
                                <TextField
                                    form={form}
                                    name="price"
                                    label="Price"
                                    placeholder="Enter price"
                                    type="number"
                                />
                                <TextField
                                    form={form}
                                    name="priceRange"
                                    label="Price Range"
                                    placeholder="Enter price range"
                                />
                                <TextField
                                    form={form}
                                    name="offerPrice"
                                    label="Offer Price"
                                    placeholder="Enter offer Price"
                                    type="number"
                                />
                                <SwitchItem
                                    disabled={categories_loading}
                                    form={form}
                                    name="category"
                                    label="Category"
                                    options={categories}
                                    placeholder="Select category"
                                />
                                <SwitchItem
                                    form={form}
                                    name="tag"
                                    label="Tag"
                                    options={TAGS_CHOOSE}
                                    placeholder="Select kitchen"
                                />
                                <FormField
                                    control={form.control}
                                    name="photo"
                                    render={({ field: { onChange } }) => (
                                        <FormItem>
                                            <FormLabel>Upload Images</FormLabel>
                                            <FormControl>
                                                <FileInput
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files =
                                                            e.target.files;
                                                        if (files?.length) {
                                                            onChange(files);
                                                            handleChangeFiles(
                                                                files
                                                            );
                                                        }
                                                    }}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <ProductImages
                                                urls={imagePreviewUrls}
                                                setUrl={setImagePreviewUrls}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">
                                Short Description
                            </h3>
                            <Separator />
                            <div>
                                <Editor
                                    onChange={(value) => {
                                        form.setValue(
                                            'shortDescription',
                                            value
                                        );
                                    }}
                                    value={form.watch('shortDescription') ?? ''}
                                />
                            </div>
                        </div>
                        <Button type="submit" isLoading={create_loading}>
                            {id ? 'Update Product' : 'Create Product'}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}