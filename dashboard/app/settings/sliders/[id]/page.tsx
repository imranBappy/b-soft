import React from 'react';
import { SliderForm } from '../../components';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <SliderForm id={params.id} />
        </div>
    );
};

export default page;