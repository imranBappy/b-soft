import { ColumnDef } from "@tanstack/react-table"

import Image from "@/components/ui/image";
import { SLIDER_TYPE } from "@/graphql/settings";

export const columns: ColumnDef<SLIDER_TYPE>[] = [
    {
        accessorKey: "image",
        header: "Name",
        cell: ({ row }) => (
            <Image
                src={row.getValue("image")}
                alt="Slider image"
                width={100}
                height={60}
                className="object-cover rounded h-14 "
            />
        ),
    },



    {
        accessorKey: "link",
        header: "Link",
        cell: ({ row }) => (
            <div >{row.getValue("link") || 'N/A'}</div>
        ),
    },

]


export default columns