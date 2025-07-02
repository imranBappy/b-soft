// dashboard/app/blog/components/forms/blog-post-form.tsx
'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/input/combobox';
import { Switch } from '@/components/ui/switch';
import { ImageInput } from '@/components/ui/file-input2'; // Assuming this is your file input component
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { Loader2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast'; // Import useToast hook
// Import the Quill type if available in your project's @types/react-quill
import type { ReactQuillProps } from 'react-quill'; // Import ReactQuillProps type

// Dynamically import ReactQuill to prevent SSR issues, as it relies on browser APIs
// Specify ReactQuillProps for the dynamic import
const ReactQuill = dynamic<ReactQuillProps>(() => import('react-quill'), {
    ssr: false,
});

// Define the Zod schema for form validation
export const formSchema = z.object({
    categoryId: z
        .string()
        .optional()
        .nullable()
        .transform((e) => (e === '' ? null : e)),
    title: z
        .string()
        .min(5, { message: 'Title must be at least 5 characters.' }),
    coverImage: z
        .union([
            z.string().url('Invalid URL format').optional().nullable(),
            z.any(),
        ])
        .optional()
        .nullable(),
    content: z
        .string()
        .min(50, { message: 'Content must be at least 50 characters.' }),
    youtubeVideoUrl: z
        .string()
        .url('Invalid URL format')
        .optional()
        .or(z.literal(''))
        .nullable()
        .transform((e) => (e === '' ? null : e)),
    isPublished: z.boolean().default(true),
});

// Define the props for the BlogPostForm
interface BlogPostFormProps {
    initialData?: z.infer<typeof formSchema>;
    categories: { label: string; value: string }[];
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    isLoading?: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
    initialData,
    categories,
    onSubmit,
    isLoading,
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || null,
            title: initialData?.title || '',
            coverImage: initialData?.coverImage || null,
            content: initialData?.content || '',
            youtubeVideoUrl: initialData?.youtubeVideoUrl || null,
            isPublished: initialData?.isPublished ?? true,
        },
    });

    // const { toast } = useToast(); // Initialize useToast

    const currentCoverImage = form.watch('coverImage');
    // Correctly type the quillRef for ReactQuill component

    // Define Quill toolbar modules and formats
    const modules = {
        toolbar: {
            container: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ size: [] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [
                    { list: 'ordered' },
                    { list: 'bullet' },
                    { indent: '-1' },
                    { indent: '+1' },
                ],
                ['link', 'image', 'video'], // 'video' button for YouTube
                ['clean'],
            ],
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <Combobox
                            options={categories || []}
                            value={field.value || ''}
                            label="Category"
                            onChangeOptions={(value) => field.onChange(value)}
                        />
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter blog post title"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <FormControl>
                                <ImageInput
                                    onChange={(file) => {
                                        field.onChange(file);
                                    }}
                                    existingImage={
                                        typeof currentCoverImage === 'string'
                                            ? currentCoverImage
                                            : undefined
                                    }
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                {/* ReactQuill as a rich text editor */}
                                <ReactQuill
                                    theme="snow"
                                    value={field.value}
                                    onChange={field.onChange}
                                    modules={modules} // Apply custom modules
                                    formats={formats} // Apply custom formats
                                    className="bg-background text-foreground min-h-[200px]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Publish Post
                                </FormLabel>
                                <FormDescription>
                                    Make this blog post visible to the public.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset(initialData)}
                        disabled={isLoading}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Save Post'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default BlogPostForm;
