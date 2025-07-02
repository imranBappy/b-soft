import React from 'react';
import AddBlog from '../components/AddBlog';

const page = ({ params }: { params: { slug: string } }) => {
    return (
        <div>
            <AddBlog slug={params.slug} />
        </div>
    );
};

export default page;
