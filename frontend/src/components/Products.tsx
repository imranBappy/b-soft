"use client"

import Product from './Product';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { PRODUCT_TYPE, PRODUCTS_QUERY } from '@/graphql/product';
import ProductLoader from './ProductLoader';

const Products = ({ title = 'All Products', tag = '' }) => {
    const { loading, data } = useQuery(PRODUCTS_QUERY, {
        variables: {
            first: 8,
            tag: tag,
            isActive: true,
        },
    });

    let content = data?.products?.edges?.map(
        (product: { node: PRODUCT_TYPE }) => (
            <Product key={product.node.id} data={product.node} />
        )
    );
    if (loading || !data?.products?.edges.length) {
        content = new Array(4).fill(1).map((_, i) => <ProductLoader key={i} />);
    }
    return (
        <div className="container mt-10 ">
            <div className="flex mb-5 justify-between items-center">
                <h3 className="title">{title}</h3>
                <Button variant={'link'} className=" text-blue">
                    <Link
                        href={'/shop'}
                        className="flex gap-2 items-center font-lato"
                    >
                        <span>More Products</span> <ChevronRight size={18} />
                    </Link>
                </Button>
            </div>
            <div className="flex  gap-5  flex-wrap  justify-evenly md:justify-start">
                {content}
            </div>
        </div>
    );
};

export default Products;