import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SOFTWARE_TYPE, SOFTWARES_QUERY } from '@/graphql/product';
import createApolloClient from '@/lib/apolloClient';
import Link from 'next/link';
import React from 'react';

const LIMIT = process.env.NEXT_PUBLIC_PAGE_LIMIT || 10;

type SearchParams = Promise<{ page: string; }>;



export default async function Page(props: { searchParams: SearchParams }) {
    const params = await props.searchParams
    const page = Number(await params.page || 1);
    const offset = (page - 1) * Number(LIMIT);
    const client = createApolloClient()
    const res = await client.query({
        query: SOFTWARES_QUERY,
        variables: { offset, limit: LIMIT },
        fetchPolicy: "no-cache", // for SSR freshness
    });

    const softwares = res?.data?.softwares;




    return (
        <div className='container'>
            <div className=" p-5 my-10 rounded-lg border shadow-sm overflow-x-hidden hover:overflow-x-scroll">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Buy</TableHead>
                            <TableHead>Tutorial</TableHead>
                            <TableHead>Official</TableHead>
                            <TableHead>Download</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {softwares?.edges?.map((item: { node: SOFTWARE_TYPE }) => (
                            <TableRow key={item.node.id}>
                                <TableCell>{item.node.name}</TableCell>
                                <TableCell>
                                    <Link className="text-blue-600 hover:underline" href={item.node.buyLink} target="_blank">
                                        Buy
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link className="text-blue-600 hover:underline" href={item.node.tutorialLink} target="_blank">
                                        Tutorial
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link className="text-blue-600 hover:underline" href={item.node.officialSite} target="_blank">
                                        Site
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link className="text-blue-600 hover:underline" href={item.node.downloadLink} target="_blank">
                                        Download
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center pt-4">
                    <Button asChild disabled={page <= 1}>
                        <Link href={`?page=${page - 1}`}>Previous</Link>
                    </Button>
                    <span>Page {page}</span>
                    <Button asChild disabled={softwares.length < LIMIT}>
                        <Link href={`?page=${page + 1}`}>Next</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};
