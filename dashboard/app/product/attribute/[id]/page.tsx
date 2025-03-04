import React from 'react';
import AttributeAndOptionForm from '../../components/forms/attribute-and-options-form';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <AttributeAndOptionForm attributeId={params.id} />
        </div>
    );
};

export default page;