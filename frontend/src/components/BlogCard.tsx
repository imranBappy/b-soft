// frontend/src/components/BlogCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Define a default image URL for blog posts without a cover image
// Changed to a local static asset to avoid SVG issues with external services
const DEFAULT_COVER_IMAGE_URL = '/placeholder.jpg'; // Assuming you place a placeholder.png in frontend/public/images/

/**
 * Utility function to strip HTML tags from a string.
 * This is used to display plain text snippets from the rich text content.
 * @param htmlString The HTML string to strip tags from.
 * @returns The plain text content.
 */
function stripHtmlTags(htmlString: string): string {
    // Ensure this runs only in a browser environment where `window` and `DOMParser` exist.
    // For SSR, the initial render might not have the stripped content, but it will hydrate.
    if (typeof window === 'undefined' || !htmlString) {
        return htmlString || ''; // Return original or empty string for SSR or non-string inputs
    }
    try {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    } catch (e) {
        console.error('Error parsing HTML string:', e);
        return htmlString; // Fallback to original string if parsing fails
    }
}

// Define the TypeScript interface for the blog post data expected by this component
interface BlogCardProps {
    post: {
        id: string;
        title: string;
        slug: string;
        coverImage?: string | null;
        content: string;
        youtubeVideoUrl?: string | null;
        viewsCount: number;
        isPublished: boolean;
        createdAt: string;
        category?: {
            id: string;
            name: string;
            slug: string;
        } | null;
        author?: {
            id: string;
            email: string;
            firstName?: string | null;
            lastName?: string | null;
        } | null;
        likesCount: number;
        commentsCount: number;
    };
}

/**
 * BlogCard Component
 *
 * Displays a single blog post in a card format for listing pages.
 * It shows the cover image (with a fallback), title, a 3-line text snippet
 * from the content (HTML stripped), category, author, and engagement counts.
 */
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
    return (
        <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Use default cover image if post.coverImage is not available */}
            <div className="relative w-full h-48">
                <Image
                    src={post.coverImage || DEFAULT_COVER_IMAGE_URL}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    // onError={(e) => {
                    //     // Fallback for broken image URLs, this will now point to your local placeholder
                    //     const target = e.target as HTMLImageElement;
                    //     target.src = DEFAULT_COVER_IMAGE_URL;
                    // }}
                />
            </div>
            <CardHeader>
                <CardTitle className="text-xl font-semibold line-clamp-2">
                    {post.title}
                </CardTitle>
                {post.category && (
                    <CardDescription className="text-sm text-gray-500">
                        Category:{' '}
                        <Link
                            href={`/blog?category=${post.category.slug}`}
                            className="text-blue-600 hover:underline"
                        >
                            {post.category.name}
                        </Link>
                    </CardDescription>
                )}
                <CardDescription className="text-sm text-gray-500">
                    {post.author
                        ? `By ${post.author.firstName || ''} ${
                              post.author.lastName || post.author.email
                          }`
                        : 'By Anonymous'}{' '}
                    on {format(new Date(post.createdAt), 'MMMM dd,yyyy')}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                {/* Strip HTML tags and apply line-clamp for 3 lines of text */}
                <p className="text-gray-700 mb-4 line-clamp-3">
                    {stripHtmlTags(post.content)}
                </p>
                <div className="mt-auto">
                    <Link href={`/blog/${post.slug}`} passHref>
                        <Button variant="link" className="px-0">
                            Read More
                        </Button>
                    </Link>
                    {/* <Separator className="my-2" /> */}
                    {/* <div className="flex justify-between text-sm text-gray-600">
                        <span>Views: {post.viewsCount}</span>
                        <span>Likes: {post.likesCount}</span>
                        <span>Comments: {post.commentsCount}</span>
                    </div> */}
                </div>
            </CardContent>
        </Card>
    );
};

export default BlogCard;
