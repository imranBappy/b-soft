"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useMutation, useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import uploadImageToS3, { deleteImageFromS3 } from "@/lib/s3"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Loading,
    Input,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
} from "@/components/ui"
import { TextField } from "@/components/input/text-field"
import Button from "@/components/button"
import { renamedFile } from "@/lib/utils"
import { SLIDER_MUTATION, SLIDER_QUERY, SLIDERS_QUERY } from "@/graphql/settings"

const productFormSchema = z.object({
    link: z.string().url().optional(),
    // image: z.instanceof(File),
    image: typeof window === 'undefined'
        ? z.any().optional()
        : z.instanceof(File).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>
export function SliderForm({ id }: { id?: string }) {
    const { toast } = useToast()
    const [createCategory, { loading: create_loading }] = useMutation(SLIDER_MUTATION, {
        refetchQueries: [{
            query: SLIDERS_QUERY
        }],
        awaitRefetchQueries: true
    })
    const router = useRouter()
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
    })
    const { loading: sliderLoading, data: sliderRes } = useQuery(SLIDER_QUERY, {
        variables: { id },
        skip: !id,
        onCompleted: (data) => {
            const slider = {
                link: data.link,
                image: undefined
            }
            setImagePreviewUrl(data.slider.image || "")
            form.reset(slider);
        },
        onError: (error) => {
            console.log({ error });

            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    })
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(imagePreviewUrl)
        }
    }, [imagePreviewUrl])

    async function onSubmit(data: ProductFormValues) {
        try {
            let uploadedFiles: string | undefined = undefined;

            if (data.image && sliderRes?.slider?.image) {
                // delete old image
                const deleted = await deleteImageFromS3(sliderRes?.slider.image)
                if (!deleted) throw new Error("Failed to delete image")
            }
            if (data.image) {
                uploadedFiles = await uploadImageToS3(renamedFile(data.image));
                if (!uploadedFiles) throw new Error("Failed to upload image")
            }

            await createCategory({
                variables: {
                    ...data,
                    image: uploadedFiles,
                    id: id || undefined,

                },
            })
            toast({
                title: "Success",
                description: "Product created successfully",
            })
            form.reset({
                link: "",
                image: undefined
            })

            setImagePreviewUrl("")
            router.push(`/settings/sliders/`)

        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred",
                variant: "destructive",
            })
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            form.setValue("image", e.target.files[0]);
        }
        if (e.target.files?.[0]) {
            setImagePreviewUrl(URL.createObjectURL(e.target.files?.[0]))
        }
    }




    if (sliderLoading) return <Loading />


    return (
        <Form {...form}>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-4xl mx-auto"
            >
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            {id ? 'Update ' : 'Create '}
                        </CardTitle>
                        <CardDescription>
                            {id
                                ? 'Update'
                                : 'Add a new category to your inventory'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>

                            </div>
                            <Separator />
                            <TextField
                                form={form}
                                name="link"
                                label="Link"
                                placeholder="Enter link"
                            />
                        </div>
                        <div className="space-y-4">
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field: { ...field } }) => (
                                        <FormItem>
                                            <FormLabel>Upload Images</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value=""
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        handleImageChange(e);
                                                    }}
                                                    className="flex items-center justify-center h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            {imagePreviewUrl && (
                                                <div className="grid grid-cols-4 gap-4 mt-4">
                                                    <div className="relative aspect-square">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            src={
                                                                imagePreviewUrl
                                                            }
                                                            alt={`Preview`}
                                                            className="object-cover w-full h-full rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button type="submit" isLoading={create_loading}>
                            {id ? 'Update ' : 'Create '}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
export default SliderForm