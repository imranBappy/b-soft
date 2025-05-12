"use client"
// import { ChevronRight } from 'lucide-react';
// import { Button } from './ui/button';
// import Link from 'next/link';
import Category from './Category';
import { useQuery } from '@apollo/client';
import { CATEGORIES_QUERY, CATEGORY_TYPE } from '@/graphql/product';
import CategoryLoader from './CategoryLoader';

const Categories = ({ title = "All Products" }) => {
    const { loading, data, } = useQuery(CATEGORIES_QUERY, {
        variables: {
            first: 5,
            isActive: true
        }
    })
    let content = data?.categories?.edges?.map(
        (category: { node: CATEGORY_TYPE }) => (
            <Category key={category.node.id} data={category.node} />
        )
    );

    if (loading || !data?.categories?.edges.length) {
        content = new Array(5).fill(1).map((_, i) => <CategoryLoader key={i} />);
    }


    return (
        <div className="container mt-12">
            <div className="flex mb-8 justify-between items-center">
                <h3 className="title">{title}</h3>
                {/* <Button variant={'link'} className=' text-blue'>
                    <Link href={'/'} className='flex gap-2 items-center font-lato'>
                        <span>More Category</span> <ChevronRight size={18} />
                    </Link>
                </Button> */}
            </div>
            <div className="flex gap-2 flex-wrap  justify-evenly md:justify-start ">
                {content}
            </div>
        </div>
    );
};

export default Categories;