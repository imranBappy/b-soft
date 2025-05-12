"use client"
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { DataTableContent } from "@/components/data-table"
import { columns } from './index'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SLIDER_TYPE, SLIDERS_QUERY } from "@/graphql/settings"

export const SlidersDataTable = () => {


    const { loading, data: res } = useQuery(SLIDERS_QUERY, {
        variables: {},
    }
    );



    const sliders: SLIDER_TYPE[] = res?.sliders?.edges?.map(({ node }: { node: SLIDER_TYPE }) => ({
        id: node.id,
        link: node.link,
        image: node.image,
    })) || [];



    const table = useReactTable({
        data: sliders,
        columns: columns as ColumnDef<SLIDER_TYPE>[],
        getCoreRowModel: getCoreRowModel(),
        manualPagination: false,

    })


    return (
        <div className="w-full">
            <div className="flex justify-end">
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/settings/sliders/add`}>
                        Add</Link>
                </Button>
            </div>

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={columns as ColumnDef<SLIDER_TYPE>[]}
            />

        </div>
    );
};

export default SlidersDataTable;