"use client"
import { useCallback, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { OPTION_TYPE } from "../input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

function SearchIcon() {
    return (
        <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}



function debounce(func: (...args: unknown[]) => void, wait: number) {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: unknown[]) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

interface FilterProps {
    cardClassName?: string;
    name: string;
    items: OPTION_TYPE[];
    selectedItems: string[];
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
}

const Filter = ({
    name = '',
    onSelect,
    onRemove,
    selectedItems,
    items,
    cardClassName,
}: FilterProps) => {
    const [search, setSearch] = useState('');
    const filteredItems = useMemo(
        () =>
            items.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search]
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearch = useCallback(
        debounce((value: unknown) => setSearch(value as string), 300),
        []
    );

    return (
        <Card className={`w-72  rounded ${cardClassName}`}>
            <CardHeader className="px-4 py-4 dark:bg-primary-foreground   bg-gray-light  text-primary-background">
                <CardTitle className=" font-playfair font-bold text-base">
                    {name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <div className="relative">
                    <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                        <SearchIcon />
                    </div>
                    <Input
                        onChange={(e) => debouncedSetSearch(e.target.value)}
                        id="search"
                        type="search"
                        placeholder="Search..."
                        className="w-full rounded   bg-background pl-8"
                    />
                </div>
                <ScrollArea className="h-72  w-full ">
                    <div className="p-4">
                        {filteredItems.map((item) => (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={
                                            !!selectedItems.includes(item.value)
                                        }
                                        name={item.value}
                                        onClick={() =>
                                            selectedItems.includes(item.value)
                                                ? onRemove(item.value)
                                                : onSelect(item.value)
                                        }
                                        id={item.value}
                                    />
                                    <label
                                        htmlFor={item.value}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {item.label}
                                    </label>
                                </div>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default Filter;