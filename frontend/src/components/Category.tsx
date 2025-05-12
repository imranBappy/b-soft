import React from 'react';
import { Button } from './ui/button';
import noImage from '@/assets/image.jpg'

import { CATEGORY_TYPE } from '@/graphql/product';
import Link from 'next/link';
import Image from './ui/image';

const Category = ({ data }: { data: CATEGORY_TYPE }) => {
    return (
        <Link
            href={`/shop?category=${data.id}`}
            className="group  h-fit basis-36 md:basis-48 flex items-center flex-col  gap-3 cursor-pointer shadow-none"
        >
            <Image
                src={data.image || noImage.src}
                className="  h-32  md:w-44  md:h-44  rounded-full w-32  object-cover"
                alt="Product Image"
                width={200}
                height={200}
            />
            <Button
                variant="link"
                className="text-blue font-playfair md:text-lg text-base  w-full group-hover:underline"
            >
                {data.name}
            </Button>
        </Link>
    );
};

export default Category;