import React from 'react';
import { Skeleton } from './ui/skeleton';

const CategoryLoader = () => {
    return (
        <div className=" basis-48 flex items-center flex-col gap-3 justify-center  ">
            <div className="p-2  max-w-32  md:max-w-44  ">
                <Skeleton className=" w-[150px] h-[150px] rounded-full" />
            </div>
            <Skeleton className="h-6 w-[110px] rounded-sm" />
        </div>
    );
};

export default CategoryLoader;