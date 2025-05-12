// components/ContactForm.tsx
'use client';

import { useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CONTACT_US_MUTATION } from '@/graphql/setting';

// Define form schema using Zod
const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    message: z.string().min(10, {
        message: 'Message must be at least 10 characters.',
    }),
});

export default function ContactForm() {
    const [submitStatus, setSubmitStatus] = useState<
        'success' | 'error' | null
    >(null);

    const [sendMassage, { loading }] = useMutation(CONTACT_US_MUTATION);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await sendMassage({
                variables: values,
            });
            setSubmitStatus('success');
            form.reset();
        } catch  {
            setSubmitStatus('error');
        } finally {
        }
    }

    return (
        <div className=" mx-auto  max-w-[800px] my-10 space-y-6">
            <h1 className="title">Contact Us</h1>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="your@email.com"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Your message here..."
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </Form>

            {submitStatus === 'success' && (
                <div className="text-green-600 text-center">
                    {`Message sent successfully! We'll get back to you soon.`}
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="text-red-600 text-center">
                    There was an error sending your message. Please try again.
                </div>
            )}
        </div>
    );
}
