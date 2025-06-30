import React from 'react';
import CreateBlogPostPage from '../add/page';

const page = ({}: { params: { id: string } }) => {
    return (
        <div>
            <CreateBlogPostPage />
        </div>
    );
};

export default page;
