import Loading from '@/components/ui/loading';
import React from 'react';

const loading = () => {
    return (
        <div className="  md:h-[600px] h-[300px]  flex items-center justify-center">
            <Loading />
        </div>
    );
};

export default loading;