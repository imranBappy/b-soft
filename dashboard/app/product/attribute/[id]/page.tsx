import React from 'react';
import AttributeAndOptionForm from '../../components/forms/attribute-and-options-form';

const page = ({ params }: { params: { id: string } }) => {
    console.log(params);
    
    return (
        <div>
            <AttributeAndOptionForm  />
        </div>
    );
};

export default page;