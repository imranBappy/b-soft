import React from 'react';
import { Skeleton } from './ui/skeleton';

const CategoryLoader = () => {
    return (
        <div className="  basis-52 flex items-center flex-col gap-4 justify-center mb-4   ">
            <Skeleton className=" w-[175px] h-[175px] rounded-full" />
            <Skeleton className="h-5 w-[120px] rounded-none " />
        </div>
    );
};

export default CategoryLoader;