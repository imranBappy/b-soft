'use client';
import { useState } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useQuery } from '@apollo/client';
import { DataTableContent, DataTablePagination } from '@/components/data-table';
import { columns, FilterState } from './index';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BLOG_TYPE } from '@/graphql/blog/types';
import { GET_BLOG_POSTS } from '@/graphql';

export const Blogs = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [filters] = useState<FilterState>({
        search: '',
        category: null,
    });
    const { toast } = useToast();

    const {
        loading,
        data: res,
        fetchMore,
    } = useQuery(GET_BLOG_POSTS, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const products: BLOG_TYPE[] =
        res?.allBlogPosts?.edges?.map(({ node }: { node: BLOG_TYPE }) => ({
            id: node.id,
            title: node.title?.split(' ').slice(0, 4).join(' '),
            slug: node.slug,
            createdAt: node.createdAt,
            category: node.category,
            coverImage: node.coverImage,
        })) || [];

    const table = useReactTable({
        data: products,
        columns: columns as ColumnDef<BLOG_TYPE>[],
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil(
            (res?.products?.totalCount || 0) / pagination.pageSize
        ),
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === 'function' ? updater(pagination) : updater;
            setPagination(newPagination);

            fetchMore({
                variables: {
                    offset: newPagination.pageIndex * newPagination.pageSize,
                    first: newPagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return fetchMoreResult;
                },
            });
        },
    });

    return (
        <div className="w-full">
            <div className="flex justify-end mb-5">
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/blog/add`}>Add</Link>
                </Button>
            </div>
            {/* Filters - Updated grid layout */}
            {/* <TableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            /> */}

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={columns as ColumnDef<BLOG_TYPE>[]}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.products?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default Blogs;
