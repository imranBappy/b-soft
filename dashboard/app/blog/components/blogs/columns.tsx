import { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';
import { ActionsDropdown } from './actions-dropdown';
import { PRODUCT_TYPE } from '@/graphql/product';

export const columns: ColumnDef<PRODUCT_TYPE>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('title')}</div>
        ),
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
    },

    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
            <div className="capitalize">{`${moment(
                row.getValue('createdAt')
            ).format('DD/MM/YYYY')} - ${moment(
                row.getValue('createdAt')
            ).fromNow()} `}</div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsDropdown item={row.original} />,
    },
];

export default columns;
