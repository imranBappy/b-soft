// frontend/src/app/blog/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOG_POSTS, GET_BLOG_CATEGORIES } from '@/graphql/blog/queries';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { BLOG_CATEGORY_TYPE, BLOG_TYPE } from '@/graphql/blog/types';

const AllBlog = () => {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load state

    // Debounce the search term with a 500ms delay
    const debouncedSearchTerm = useDebouncedValue(search, 500);

    const {
        data: categoriesData,
        loading: categoriesLoading,
        error: categoriesError,
    } = useQuery(GET_BLOG_CATEGORIES);

    const {
        data: blogPostsData,
        loading: blogPostsLoading,
        error: blogPostsError,
        fetchMore,
        networkStatus, // Use networkStatus to differentiate loading states
        refetch, // Add refetch to manually trigger query if needed
    } = useQuery(GET_BLOG_POSTS, {
        variables: {
            first: 10, // Fetch 10 posts initially
            category: selectedCategory || null,
            search: debouncedSearchTerm || null,
        },
        fetchPolicy: 'cache-and-network', // Use cache-and-network to show cached data while refetching
        notifyOnNetworkStatusChange: true, // Important for networkStatus to update
        onCompleted: () => {
            setIsInitialLoad(false); // Mark initial load as complete once data is fetched
        },
    });

    const blogPosts =
        blogPostsData?.allBlogPosts?.edges?.map(
            (edge: { node: BLOG_TYPE }) => edge.node
        ) || [];
    const pageInfo = blogPostsData?.allBlogPosts?.pageInfo;

    // Determine if a background refetch is happening (e.g., due to debounce or filter change)
    const isRefetching = networkStatus === 4; // NetworkStatus 4 means refetching

    // Effect to refetch data and reset pagination when filters or search terms change
    useEffect(() => {
        // Only refetch if not the very initial load
        if (!isInitialLoad) {
            refetch({
                first: 10, // Always reset to first page when filters change
                after: null, // Clear cursor
                category: selectedCategory || null,
                search: debouncedSearchTerm || null,
            });
        }
    }, [debouncedSearchTerm, selectedCategory, isInitialLoad, refetch]); // Depend on debounced term, category, and initial load state

    const handleLoadMore = () => {
        if (pageInfo?.hasNextPage) {
            fetchMore({
                variables: {
                    after: pageInfo.endCursor,
                    first: 10,
                    category: selectedCategory || null,
                    search: debouncedSearchTerm || null, // Use debounced term for load more as well
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    const newEdges = fetchMoreResult.allBlogPosts.edges;
                    return {
                        ...prev,
                        allBlogPosts: {
                            ...fetchMoreResult.allBlogPosts,
                            edges: [...prev.allBlogPosts.edges, ...newEdges],
                        },
                    };
                },
            });
        }
    };

    // --- Render Logic for Loading/Error States ---

    if (categoriesError) {
        return (
            <p className="text-center py-10 text-red-500">
                Error loading categories: {categoriesError.message}
            </p>
        );
    }

    if (blogPostsError) {
        return (
            <p className="text-center py-10 text-red-500">
                Error loading blog posts: {blogPostsError.message}
            </p>
        );
    }

    // Show a full-page loader only on initial data fetch
    if (isInitialLoad && blogPostsLoading) {
        return <p className="text-center py-10">Loading blog posts...</p>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10">Our Blog</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    type="text"
                    placeholder="Search blog posts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:flex-1"
                />
                {categoriesLoading ? (
                    <p>Loading categories...</p>
                ) : (
                    <Select
                        onValueChange={(value) =>
                            setSelectedCategory(value === 'all' ? '' : value)
                        }
                        value={selectedCategory || 'all'}
                    >
                        <SelectTrigger className="md:w-[200px]">
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categoriesData?.allBlogCategories?.edges?.map(
                                (category: { node: BLOG_CATEGORY_TYPE }) => (
                                    <SelectItem
                                        key={category.node.id}
                                        value={category.node.slug}
                                    >
                                        {category.node.name}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Show loading indicator for refetching (e.g., after debounce or filter change) */}
            {isRefetching && (
                <div className="text-center py-4">
                    <Loader2 className="mr-2 h-6 w-6 animate-spin inline-block" />{' '}
                    Loading results...
                </div>
            )}

            {blogPosts.length === 0 && !isRefetching ? ( // Only show "No posts" if not currently refetching
                <p className="text-center text-lg text-gray-600">
                    No blog posts found matching your criteria.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post: BLOG_TYPE) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {pageInfo?.hasNextPage && (
                <div className="text-center mt-10">
                    <Button
                        onClick={handleLoadMore}
                        disabled={blogPostsLoading}
                    >
                        {' '}
                        {/* Disable if loading more */}
                        {blogPostsLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AllBlog;
