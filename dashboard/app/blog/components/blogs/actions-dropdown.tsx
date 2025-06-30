import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { deleteImageFromS3 } from '@/lib/s3';
import { DELETE_BLOG_POST_MUTATION, GET_BLOG_POSTS } from '@/graphql';
import { BLOG_TYPE } from '@/graphql/blog/types';

interface ActionsDropdownProps {
    item: BLOG_TYPE;
}

export function ActionsDropdown({ item }: ActionsDropdownProps) {
    const { toast } = useToast();
    const [deleteBlog, { loading }] = useMutation(DELETE_BLOG_POST_MUTATION, {
        onCompleted: () => {
            toast({
                variant: 'default',
                description: 'Blog Delete successfully!',
            });
        },
        refetchQueries: [{ query: GET_BLOG_POSTS }],
        awaitRefetchQueries: true,
    });

    const handleDeleteBlog = async () => {
        console.log({ item });

        await deleteBlog({
            variables: {
                id: item.id,
            },
        });
        if (item?.coverImage) {
            await deleteImageFromS3(item.coverImage);
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    disabled={loading}
                    onClick={handleDeleteBlog}
                    className="text-red-600 cursor-pointer "
                >
                    Delete
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link className="w-full" href={`/product/${item.id}`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
