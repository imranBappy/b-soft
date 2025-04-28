'use client';
import Button from '@/components/button';
import { Card, CardContent, Loading } from '@/components/ui';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DELETE_DESCRIPTION,
    DESCRIPTION_TYPE,
    DESCRIPTIONS_QUERY,
} from '@/graphql/product';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const Page = () => {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const { toast } = useToast();

    const { data, loading, refetch } = useQuery(DESCRIPTIONS_QUERY, {
        variables: {
            product: searchParams.get('productId'),
        },
    });

    const [deleteDescription, { loading: deleteLoading }] = useMutation(
        DELETE_DESCRIPTION,
        {
            onCompleted: () => {
                toast({
                    description: 'Description Deleted!',
                });
                refetch();
            },
        }
    );

    if (loading) return <Loading />;

    return (
        <div className="p-5">
            <div className=" flex justify-end mb-2">
                <Button variant="outline">
                    <Link
                        href={`/product/descriptions/add?productId=${productId}`}
                    >
                        Add
                    </Link>
                </Button>
            </div>
            <Card className="py-2">
                <CardContent>
                    <Table>
                        <TableCaption>
                            A list of your product attribute.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">
                                    Label
                                </TableHead>
                                <TableHead>Tag</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.productDescriptions?.edges?.map(
                                ({ node }: { node: DESCRIPTION_TYPE }) => (
                                    <TableRow key={node.id}>
                                        <TableCell>{node.label}</TableCell>
                                        <TableCell>{node.tag}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/product/descriptions/add?descriptionId=${node.id}&productId=${productId}`}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                    >
                                                        Edit
                                                    </Button>
                                                </Link>

                                                <Button
                                                    isLoading={deleteLoading}
                                                    onClick={() =>
                                                        deleteDescription({
                                                            variables: {
                                                                id: node.id,
                                                            },
                                                        })
                                                    }
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
