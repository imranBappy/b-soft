"use client"
import { Card } from '@/components/ui/card';
import { ADMIN } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import { SlidersDataTable } from '../components/data-table/slider';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <SlidersDataTable />
        </Card>
    );
};

export default withProtection(page, [ADMIN]);