// dashboard/app/blog/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import {
    CREATE_BLOG_POST_MUTATION,
    UPDATE_BLOG_POST_MUTATION,
} from '@/graphql/blog/mutations'; // Ensure correct path
import {
    GET_BLOG_CATEGORIES_ADMIN,
    GET_BLOG_CATEGORY_BY_SLUG,
} from '@/graphql/blog/queries'; // Ensure correct path
import { useToast } from '@/hooks/use-toast';
import BlogPostForm from '../components/forms/blog-post-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod'; // Used for inferring form types
import uploadImageToS3 from '@/lib/s3';
import { renamedFile } from '@/lib/utils';
import { BLOG_CATEGORY_TYPE } from '@/graphql/blog/types';
import { Loading } from '@/components/ui';

// Infer the type from your form schema (from blog-post-form.tsx)
type BlogPostFormValues = z.infer<typeof BlogPostForm.arguments.formSchema>; // Adjust based on your z.object export

const AddBlog = ({ slug }: { slug?: string }) => {
    const router = useRouter();
    const { toast } = useToast();

    const [initialData, setInitialData] = useState<{
        id?: string;
        slug?: string;
        title: string;
        content: string;
        isPublished: boolean;
        categoryId?: string | null | undefined;
        coverImage?: string | File | null | undefined;
        youtubeVideoUrl?: string | null | undefined;
    }>({
        title: '',
        content: '',
        isPublished: true,
    });

    // Fetch categories for the combobox
    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
    } = useQuery(GET_BLOG_CATEGORIES_ADMIN);
    const categories =
        categoriesData?.allBlogCategories?.edges?.map(
            (edge: { node: BLOG_CATEGORY_TYPE }) => ({
                label: edge.node.name,
                value: edge.node.id,
            })
        ) || [];

    const [createBlogPost, { loading: isSubmitting }] = useMutation(
        CREATE_BLOG_POST_MUTATION,
        {
            onCompleted: () => {
                toast({ title: 'Blog post created successfully!' });
                router.push('/blog'); // Redirect to blog list page after creation
            },
            onError: (err) =>
                toast({
                    title: 'Error creating blog post',
                    description: err.message,
                    variant: 'destructive',
                }),
        }
    );
    const [updateBlogPost, { loading: isUpdating }] = useMutation(
        UPDATE_BLOG_POST_MUTATION,
        {
            onCompleted: () => {
                toast({ title: 'Blog post updated successfully!' });
                router.push('/blog'); // Redirect to blog list page after creation
            },
            onError: (err) =>
                toast({
                    title: 'Error creating blog post',
                    description: err.message,
                    variant: 'destructive',
                }),
        }
    );
    const { loading } = useQuery(GET_BLOG_CATEGORY_BY_SLUG, {
        variables: {
            slug: slug,
        },
        skip: !slug,
        onCompleted(data) {
            console.log(data.blogPostBySlug);
            setInitialData({
                ...data.blogPostBySlug,
                categoryId: data.blogPostBySlug?.category?.id,
            });
        },
    });

    const handleSubmit = async (values: BlogPostFormValues) => {
        let coverImageUrl = values.coverImage;
        console.log('clicked!');

        // If coverImage is a File object, upload it to S3
        // if (typeof File !== 'undefined') {
        //     return;
        // }
        if (coverImageUrl instanceof File) {
            const uploadResult = await uploadImageToS3(
                renamedFile(coverImageUrl)
            ); // Specify a folder for blog covers
            if (uploadResult) {
                coverImageUrl = uploadResult;
            } else {
                toast({
                    title: 'Failed to upload image',
                    description: 'Please try again.',
                    variant: 'destructive',
                });
                return;
            }
        } else if (coverImageUrl === '') {
            // If the user cleared an existing image (though less likely in 'add' mode, good for consistency)
            coverImageUrl = null;
        }

        if (initialData.id && slug) {
            await updateBlogPost({
                variables: {
                    id: initialData.id,
                    slug: initialData?.slug,
                    categoryId: values.categoryId,
                    title: values.title,
                    coverImage: coverImageUrl,
                    content: values.content,
                    youtubeVideoUrl: values.youtubeVideoUrl,
                    isPublished: values.isPublished,
                },
            });
            return;
        }
        await createBlogPost({
            variables: {
                id: initialData.id,
                slug: initialData?.slug,
                categoryId: values.categoryId,
                title: values.title,
                coverImage: coverImageUrl,
                content: values.content,
                youtubeVideoUrl: values.youtubeVideoUrl,
                isPublished: values.isPublished,
            },
        });
    };

    if (categoriesLoading || loading)
        return (
            <div>
                <Loading />
            </div>
        );
    if (categoriesError)
        return (
            <p className="text-red-500">
                Error loading categories: {categoriesError.message}
            </p>
        );

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Blog Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <Separator className="mb-4" />
                    <BlogPostForm
                        key={initialData.id || 'new'}
                        initialData={initialData}
                        categories={categories}
                        onSubmit={handleSubmit}
                        isLoading={isSubmitting || isUpdating}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default AddBlog;
