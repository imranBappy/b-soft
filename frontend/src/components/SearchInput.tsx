"use client"

import { useState, useEffect } from "react";
import useStore from "@/stores";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
 
const useDebounce = (value: string, delay: number = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchInput = () => {
    
    const addSearchQuery = useStore((store) => store.addSearchQuery);
    const value = useStore((store) => store.query);
    const [search, setSearch] = useState(value);
    const debouncedSearch = useDebounce(search);
    const path = usePathname()
    const router = useRouter();

    const handleSearchPage = () => {
        if (path === "/") {
            router.push("/shop");
        }
    }


    useEffect(() => {
        addSearchQuery(debouncedSearch);
    }, [debouncedSearch, addSearchQuery]);

    return (
        <div className="relative w-96">
            <Input
                onFocus={handleSearchPage}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="w-full pl-4 py-5 flex bottom-0 shadow-none outline-none rounded-full pr-12 border-gray-700 text-gray-300"
                type="text"
                placeholder="Search"
            />
            <Button
                variant={'ghost'}
                className="rounded-full hover:bg-gray hover:text-white py-5 absolute top-0 right-0 text-gray-300"
                type="submit"
            >
                <Search />
            </Button>
        </div>
    );
};

export default SearchInput;
