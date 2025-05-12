// components/ProductForm.tsx
'use client';

import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import {
    ATTRIBUTE_OPTION_TYPE,
    ATTRIBUTE_QUERY,
    PRODUCT_ATTRIBUTE_AND_OPTION_MUTATIONI,
} from '@/graphql/product';
import { Loading } from '@/components/ui';
import { useState } from 'react';
import Image from 'next/image';
import { renamedFile, toFixed } from '@/lib/utils';
import uploadImageToS3, { deleteImageFromS3 } from '@/lib/s3';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

// Define the schema using Zod
const optionSchema = z.object({
    id: z.string().optional(),
    optionText: z.string().min(1, 'Option text is required'),
    message: z.string().optional(),
    extraPrice: z.number().min(0, 'Price is required'),
    photo: z
        .array(z.union([z.instanceof(File), z.string()]))
        .max(5, 'Maximum 5 photos allowed')
        .optional(),
    // photo:
    //     typeof window === 'undefined'
    //         ? z.any().optional()
    //         : z.array(z.union([z.instanceof(File), z.string()]))
    //               .max(5, 'Maximum 5 photos allowed')
    //               .optional(),
});

const formSchema = z.object({
    id: z.string().optional(),
    product: z.string().min(1, 'Please search and select a product'),
    attributeName: z.string().min(1, 'Attribute name is required'),
    options: z.array(optionSchema).min(1, 'At least one option is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AttributeAndOptionForm() {
    const [deletedPhotos, setDeletedPhoto] = useState<string[]>();
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const attributeId = searchParams.get('attributeId');
    const router = useRouter()

    const {toast} = useToast()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id:attributeId||"",
            product: productId || "",
            attributeName: '',
            options: [
                {
                    optionText: '',
                    message: '',
                    extraPrice: 0,
                    photo: [],
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'options',
    });

    const [createAttribute, { loading: createLoading }] = useMutation(
        PRODUCT_ATTRIBUTE_AND_OPTION_MUTATIONI,
        {
            onCompleted() {
                toast({
                    description:"Successfully created!"
                })
                router.push(`/product/attribute?productId=${productId}`);
            },
            onError:(err)=>{
                toast({
                    description: err.message,
                    variant:'destructive'
                });
            
            }
        }
    );

    // ATTRIBUTE_QUERY;
    const {loading: attributeLoading } = useQuery(
        ATTRIBUTE_QUERY,
        {
            variables: {
                id: attributeId,
            },
            skip: !attributeId,
            onCompleted: (res) => {
                const options = res?.attribute?.attributeOptions?.edges?.map(
                    ({ node }: { node: ATTRIBUTE_OPTION_TYPE }) => ({
                        id: node.id,
                        optionText: node.option,
                        message: node.message,
                        extraPrice: toFixed(node.extraPrice),
                        photo: node?.photo ? JSON.parse(node?.photo) : [],
                    })
                );
                const attributedefaultValues = {
                    id: res?.attribute?.id,
                    product: res?.attribute?.product?.id,
                    attributeName: res?.attribute?.name,
                    options: options,
                };
                console.log({ attributedefaultValues });
                
                form.reset(attributedefaultValues);
            },
        }
    );

    const handlePhotoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        optionIndex: number
    ) => {
        const files = e.target.files;
        if (files) {
            const currentPhotos =
                form.getValues(`options.${optionIndex}.photo`) || [];
            const newPhotos = Array.from(files);
            const totalPhotos = currentPhotos.length + newPhotos.length;
            if (totalPhotos > 5) {
                alert('Maximum 5 photos allowed');
                return;
            }
            const updatedPhotos = [...currentPhotos, ...newPhotos];
            form.setValue(`options.${optionIndex}.photo`, updatedPhotos, {
                shouldValidate: true,
            });
        }
    };

    const removePhoto = (optionIndex: number, photoIndex: number) => {
        const currentPhotos =
            form.getValues(`options.${optionIndex}.photo`) || [];

        const updatedPhotos = currentPhotos.filter(
            (_, idx) => idx !== photoIndex
        );

        const deletedPhoto = currentPhotos.find((_, idx) => idx === photoIndex);

        if (typeof deletedPhoto === 'string') {
            setDeletedPhoto(deletedPhoto ? [...deletedPhotos??[] , deletedPhoto] : []);
        }

        form.setValue(`options.${optionIndex}.photo`, updatedPhotos, {
            shouldValidate: true,
        });
    };


 
   

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log('Hello');
        
            const variables: {
                input: {
                    id?: string;
                    product: string;
                    name: string;
                    options: {
                        id?: string;
                        option: string;
                        message?: string;
                        extraPrice: number;
                        photo: string;
                    }[];
                };
            } = {
                input: {
                    id: data?.id,
                    product: productId || '',
                    name: data.attributeName,
                    options: [],
                },
            };
        const options = data.options.map( async (op) => {
            const uploadPromises = op?.photo?.map(async (item) => {
                   if (typeof item === 'string') return item; 
                   const url = await uploadImageToS3(renamedFile(item));
                   return url;
              });
            const uploadedFiles = await Promise.all(uploadPromises ?? []);
            return {
                id: op.id,
                option: op.optionText,
                message: op.message,
                extraPrice: op.extraPrice,
                photo: JSON.stringify(uploadedFiles),
            };
        });
        variables.input.options = await Promise.all(options);
        //  
        if (deletedPhotos?.length) {
            const deletedPromises = deletedPhotos.map(
                async (item) => await deleteImageFromS3(item)
            );
            await Promise.all(deletedPromises);
        }

        await createAttribute({
            variables: variables,
        });
    };

    
    console.log(form.formState.errors);
    


    if (attributeLoading) return <Loading />;

    return (
        <div className="m-5">
            <h1 className="my-3 text-lg">Product Attributes form</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-5">

                        {/* Attribute Name */}
                        <FormField
                            control={form.control}
                            name="attributeName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Attribute Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="w-full"
                                            placeholder="Enter attribute name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Options</h3>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="space-y-4 border p-4 rounded-md"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Option Text */}
                                    <FormField
                                        control={form.control}
                                        name={`options.${index}.optionText`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Option Text
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter option text"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Extra Price */}
                                    <FormField
                                        control={form.control}
                                        name={`options.${index}.extraPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Extra Price
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        step="0.1"
                                                        placeholder="Enter price"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target
                                                                    .valueAsNumber
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Message */}
                                    <FormField
                                        control={form.control}
                                        name={`options.${index}.message`}
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter message"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Photo Upload */}
                                    <FormItem className="col-span-2">
                                        <FormLabel>Photos (max 5)</FormLabel>
                                        <Input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) =>
                                                handlePhotoChange(e, index)
                                            }
                                        />
                                        {form.formState.errors.options?.[index]
                                            ?.photo && (
                                            <FormMessage>
                                                {
                                                    form.formState.errors
                                                        .options[index].photo
                                                        .message
                                                }
                                            </FormMessage>
                                        )}
                                    </FormItem>

                                    {/* Photo Previews */}
                                    <div className="flex gap-5">
                                        {form
                                            .watch(`options.${index}.photo`)
                                            ?.map((photo, photoIndex) => (
                                                <div
                                                    key={photoIndex}
                                                    className="relative"
                                                >
                                                    <Image
                                                        height={200}
                                                        width={200}
                                                        src={
                                                            typeof photo ===
                                                            'string'
                                                                ? photo
                                                                : URL.createObjectURL(
                                                                      photo
                                                                  )
                                                        }
                                                        alt={`Preview ${photoIndex}`}
                                                        className="h-24 w-24 object-contain"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-0 right-0"
                                                        onClick={() =>
                                                            removePhoto(
                                                                index,
                                                                photoIndex
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Delete Button */}
                                    <div className="flex items-end">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add New Option Button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                append({
                                    optionText: '',
                                    message: '',
                                    extraPrice: 0,
                                    photo: [],
                                })
                            }
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Option
                        </Button>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={createLoading}>
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
}
