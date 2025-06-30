'use client';
import { Card } from '@/components/ui/card';
import { ADMIN } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import React from 'react';
import Blogs from './components/blogs/blog-data-table';

const page = () => {
    return (
        <Card className="p-4  m-4">
            <Blogs />
        </Card>
    );
};

export default withProtection(page, [ADMIN]);
