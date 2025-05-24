'use client';
import React, { useState } from 'react';
import RangeFilter from '@/components/filters/RangeFilter';
import Filter from '@/components/filters/SearchFilter';
import { useQuery } from '@apollo/client';
import {
    CATEGORIES_QUERY,
    CATEGORY_TYPE,
    PRODUCT_TYPE,
    PRODUCTS_QUERY,
} from '@/graphql/product';
import Loading from '@/components/ui/loading';
import { OPTION_TYPE } from '@/components/input';
import useStore from '@/stores';
import { useSearchParams } from 'next/navigation';
import Product from '@/components/Product';
import ProductLoader from '@/components/ProductLoader';
import { Button } from '@/components/ui/button';
import { FilterIcon } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import SearchInput from '@/components/SearchInput';
import ProductsNotFound from './ProductsNotFound';

const Shop = () => {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');
    const [page, setPage] = useState(1);
    const limit = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT || '9');
    const [selectedCategory, setCategory] = useState<string[]>(
        category ? [category] : []
    );
    const [priceRange, setPriceRage] = useState(3000);
    const searchQuery = useStore((state) => state.query);
    const { data: productRes, loading: productLoading } = useQuery(
        PRODUCTS_QUERY,
        {
            variables: {
                first: limit,
                offset: (page - 1) * limit,

                category: selectedCategory.join(','),
                priceLte: priceRange,
                search: searchQuery,
                isActive: true,
            },
            nextFetchPolicy: 'no-cache',
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'network-only',
        }
    );
    const totalProduct = productRes?.products?.totalCount;
    const totalPages = Math.ceil(totalProduct / limit);


    const { loading, data: categoryRes } = useQuery(CATEGORIES_QUERY, {
        variables: { first: 100 },
    });
    const categories: OPTION_TYPE[] = categoryRes?.categories?.edges?.map(
        ({ node }: { node: CATEGORY_TYPE }) => ({
            value: `${node.id}`,
            label: node.name,
        })
    );
    const handleSelect = (id: string) => {
        setCategory((preState) => [
            ...preState.filter((item) => item != id),
            id,
        ]);
    };
    const handRemove = (id: string) => {
        setCategory((preState) => [...preState.filter((item) => item != id)]);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    }

    let content = productRes?.products?.edges?.map(
        (product: { node: PRODUCT_TYPE }) => (
            <Product key={product.node.id} data={product.node} />
        )
    );
    if (productLoading) {
        content = new Array(6).fill(1).map((_, i) => <ProductLoader key={i} />);
    }
    if (productRes?.products?.edges?.length === 0) {
        content = <ProductsNotFound />;
    }
    if (loading) return (
        <div className='  h-[300px] flex items-center justify-center'>
            <Loading />
        </div>
    );



    return (
        <div className="container">
            <Sheet>
                <div className='md:hidden  flex  items-center border mt-2'>
                    <SheetTrigger asChild className=''>
                        <Button
                            className="  border-none   rounded-sm font-playfair text-base"
                            variant={'outline'}
                        >
                            <FilterIcon size={22} />
                            Filter
                        </Button>
                    </SheetTrigger>
                    <SearchInput />
                </div>

                <SheetContent>
                    <div className="  w-full mt-10  flex  flex-col gap-5">
                        <RangeFilter
                            cardClassName="border-none w-full"
                            rangeState={[priceRange, setPriceRage]}
                            name="Price Range"
                        />
                        <Filter
                            cardClassName="border-none w-full"
                            selectedItems={selectedCategory}
                            onRemove={handRemove}
                            onSelect={handleSelect}
                            name="Category"
                            items={categories}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <div className="flex my-8 gap-5">
                <div className=" hidden w-96 md:flex flex-col gap-5">
                    <RangeFilter
                        rangeState={[priceRange, setPriceRage]}
                        name="Price Range"
                    />
                    <Filter
                        selectedItems={selectedCategory}
                        onRemove={handRemove}
                        onSelect={handleSelect}
                        name="Category"
                        items={categories}
                    />
                </div>

                <div className="w-full flex  gap-5 flex-col">
                    <div className="w-full flex  gap-5  md:justify-start  justify-evenly flex-wrap ">
                        {content}
                    </div>
                    <div
                        className=" flex justify-center w-full mt-5"
                        style={{ marginBottom: '100px' }}
                    >
                        {totalPages > 1 ? (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={() =>
                                                page > 1 &&
                                                handlePageChange(page - 1)
                                            }
                                        />
                                    </PaginationItem>

                                    {new Array(totalPages)
                                        .fill(1)
                                        .map((_, i) => {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                i + 1
                                                            )
                                                        }
                                                        isActive={
                                                            page === i + 1
                                                        }
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={() =>
                                                page < totalPages &&
                                                handlePageChange(page + 1)
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
