'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

import { useMutation } from '@apollo/client';
import { USER_REGISTER } from '@/graphql/accounts';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import useAuth from '@/hooks/use-auth';
import Link from 'next/link';
import { TextField } from '@/components/input';
import PasswordField from '@/components/input/password-field';
import { isValidPhoneNumber } from '@/lib/utils';

const formSchema = z
    .object({
        name: z.string().min(2, {
            message: 'Name must be at least 5 characters.',
        }),
        email: z.string().email().toLowerCase().min(5, {
            message: 'Email must be valid',
        }),
        whatsApp: z.string().nonempty({
            message: 'WhatsApp number is required.',
        }),
        address: z.string().optional(),
        password: z.string().min(2, {
            message: 'password must be at least 5 characters.',
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .refine((data) => isValidPhoneNumber(data.whatsApp as string, 'BD'), {
        message: 'Invalid WhatsApp number ',
        path: ['whatsApp'],
    });

function RegisterForm() {
    const { toast } = useToast();
    const checkAuth = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const router = useRouter();
    const [userRegister, { loading }] = useMutation(USER_REGISTER, {
        onCompleted: async (res) => {
            const { success = false, message } = res.registerUser;
            if (!success) {
                toast({
                    variant: 'destructive',
                    description: message,
                });
                return;
            }

            toast({
                variant: 'default',
                description: message,
            });
            router.push('/login');
        },
        onError: (err) => {
            console.log(err);
            toast({
                variant: 'destructive',
                description: err.message,
            });
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const { email, password, name, whatsApp } = values;
        userRegister({
            variables: {
                name: name,
                email: email,
                password: password,
                whatsApp: whatsApp,
            },
        });
    }

    useEffect(() => {
        if (checkAuth?.isAuthenticated) {
            router.push('/');
        }
    }, [checkAuth?.isAuthenticated, router]);

    return (
        <Card className="w-96 md:w-[500px]">
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
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
                        />
                        <TextField
                            form={form}
                            name="whatsApp"
                            label="WhatsApp Number"
                            placeholder="e.g., +880170000000"
                        />
                        <TextField
                            form={form}
                            name="address"
                            label="Address (Optional)"
                            placeholder="Full address"
                        />
                        <PasswordField
                            form={form}
                            name="password"
                            label="Password"
                            placeholder="Password"
                        />

                        <PasswordField
                            form={form}
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm Password"
                        />
                        <Button disabled={loading} type="submit">
                            Register
                        </Button>
                    </form>
                </Form>

                <Button
                    variant={'link'}
                    className="w-full mt-5 flex items-end  justify-center "
                >
                    <Link href="/login">Already have a account? Log in</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default RegisterForm;
