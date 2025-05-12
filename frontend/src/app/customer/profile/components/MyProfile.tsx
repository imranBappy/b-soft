'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useMutation, useQuery } from '@apollo/client';
import { ME_QUERY } from '@/graphql/accounts/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/input';
import { useEffect, useState } from 'react';
import { PROFILE_UPDATE_MUTATION } from '@/graphql/accounts';
import { useToast } from '@/hooks/use-toast';
import { getErrors, isValidPhoneNumber, renamedFile } from '@/lib/utils';
import uploadImageToS3, { deleteImageFromS3 } from '@/lib/s3';

const formSchema = z
    .object({
        email: z.string().email().toLowerCase().min(5, {
            message: 'Email must be valid',
        }),
        name: z.string().min(5, {
            message: 'name must be at least 5 characters.',
        }),
        phone: z
            .string()
            .min(11, {
                message: 'number must be at least 1 characters.',
            })
            .optional(),
        whatsApp: z.string().nonempty({
            message: 'WhatsApp number is required.',
        }),
        address: z.string().optional(),
        // photo: z.instanceof(File).optional(),
        photo: typeof window === 'undefined' ? z.any().optional() : z.instanceof(File).optional(),

    })
    .refine(
        (data) => isValidPhoneNumber(data.whatsApp as string, "BD"),
        {
            message: 'Invalid WhatsApp number!',
            path: ['whatsApp'],
        }
    )
    .refine((data) => isValidPhoneNumber(data.phone as string, "BD"), {
        message: 'Invalid phone number!',
        path: ['phone'],
    });

export default function MyAccount() {
    const [photoPreviewUrl, setImagePreviewUrl] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const { toast } = useToast();
    const { data, loading } = useQuery(ME_QUERY, {
        onCompleted: (data) => {
            const { name, email, phone, address, whatsApp } = data?.me;
            form.setValue('name', name || '');
            form.setValue('email', email || '');
            if (phone) form.setValue('phone', phone || '');
            if (address) form.setValue('address', address || '');
            if (whatsApp) form.setValue('whatsApp', whatsApp || '');
            if (data?.me?.photo) {
                setImagePreviewUrl(data?.me?.photo);
            }
        },
        fetchPolicy: 'network-only'
    });
    console.log(form.formState.errors);

    const [updateProfile, { loading: mutationLoading }] = useMutation(
        PROFILE_UPDATE_MUTATION,
        {
            onError: (err) => {
                toast({
                    title: 'Error',
                    variant: 'destructive',
                    description: err.message,
                });
                const errors: { errors?: { phone?: string } } = getErrors([
                    ...err.graphQLErrors,
                ]);

                if (errors?.errors?.phone) {
                    form.setError('phone', {
                        message: errors.errors?.phone,
                    });
                }
            },
            onCompleted: () => {
                toast({
                    title: 'Success',
                    description: 'Profile updated successfully',
                });
            },
        }
    );
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setValue('photo', e.target.files?.[0]);
        if (e.target.files?.[0]) {
            setImagePreviewUrl(URL.createObjectURL(e.target.files?.[0]));
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {

            let uploadedFiles: string | undefined = undefined;

            if (values.photo && data?.me?.photo) {
                // delete old image
                const deleted = await deleteImageFromS3(data?.me?.photo);
                if (!deleted) throw new Error('Failed to delete image');
            }
            if (values.photo) {
                uploadedFiles = await uploadImageToS3(
                    renamedFile(values.photo)
                );

                if (!uploadedFiles) throw new Error('Failed to upload image');
            }

            updateProfile({
                variables: {
                    ...values,
                    photo: uploadedFiles ? uploadedFiles : data?.me?.photo,
                },
            });
        } catch (error) {
            console.log(error);

            toast({
                title: 'Error',
                variant: 'destructive',
                description: (error as Error).message,
            });
        }
    }

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(photoPreviewUrl);
        };
    }, [photoPreviewUrl]);

    return (
        <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-full mx-auto mt-6 rounded-none ">
                    <CardHeader className="w-full flex flex-col items-center">
                        <label htmlFor="profile-photo">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage
                                    src={photoPreviewUrl}
                                    alt={data?.me?.name}
                                />
                                <AvatarFallback>
                                    {data?.me?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </label>
                        <input
                            onChange={handleImageChange}
                            id="profile-photo"
                            className=" hidden"
                            type="file"
                            accept="image/*"
                        />
                        {form.formState.errors.photo?.message && (
                            <p className="text-red-500 text-sm">
                                {String(form.formState.errors.photo?.message)}
                            </p>
                        )}
                        <CardTitle>My Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <TextField
                                form={form}
                                name="name"
                                label="Name"
                                placeholder="Name"
                            />
                            <TextField
                                form={form}
                                name="email"
                                label="Email"
                                placeholder="Email"
                                disabled={true}
                            />
                            <TextField
                                form={form}
                                name="whatsApp"
                                label="WhatsApp Number"
                                placeholder="e.g., +880170000000"
                                disabled={true}
                            />
                            <TextField
                                form={form}
                                name="phone"
                                label="Phone Number"
                                placeholder="Phone Number"
                            />

                            <TextField
                                form={form}
                                name="address"
                                label="Address ( Optional )"
                                placeholder="Adress"
                            />
                        </div>
                        <Button
                            disabled={loading || mutationLoading}
                            className="w-full mt-4"
                        >
                            Update Profile
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
