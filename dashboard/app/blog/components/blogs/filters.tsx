import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { X } from 'lucide-react';

import Combobox from '@/components/input/combobox';
import { useQuery } from '@apollo/client';
import { CATEGORIES_QUERY, CATEGORY_TYPE } from '@/graphql/product';

export interface FilterState {
    search: string;
    category: number | null | string;
}

interface FiltersProps {
    filters: FilterState;
    onFilterChange: <K extends keyof FilterState>(
        field: K
    ) => (value: FilterState[K]) => void;
}

export function TableFilters({ filters, onFilterChange }: FiltersProps) {
    const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
    const [category, setCategory] = useState('');

    const { data: categories_data, loading: categories_loading } = useQuery(
        CATEGORIES_QUERY,
        {
            variables: {
                offset: 0,
                isCategory: true,
            },
        }
    );

    const handleSearchChange = (value: string) => {
        setDebouncedSearch(value);
    };

    const handleChangeCategoryOption = (id: string) => {
        setCategory(id);
        onFilterChange('category')(id);
    };

    const handleClearFilters = () => {
        onFilterChange('search')('');
        onFilterChange('category')(null);

        setDebouncedSearch('');
        setCategory('');
    };

    const categories = categories_data?.categories?.edges?.map(
        (node: { node: CATEGORY_TYPE }) => ({
            value: node.node.id,
            label: node.node.name,
        })
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            onFilterChange('search')(debouncedSearch);
        }, 500);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    return (
        <>
            <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
                <div className="space-y-2">
                    <Input
                        placeholder="Search by name"
                        value={debouncedSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Combobox
                        options={categories || []}
                        value={category}
                        label="Category"
                        onChangeOptions={handleChangeCategoryOption}
                        isLoading={categories_loading}
                    />
                </div>

                <div
                    className="
                    flex-1
                    text-sm
                    text-muted-foreground
                    whitespace-nowrap
                    mr-2
                    flex
                    justify-end
                    items-end

                    "
                >
                    <Button
                        variant="outline"
                        onClick={handleClearFilters}
                        className="text-sm"
                    >
                        <X />
                        Reset
                    </Button>
                </div>
            </div>
        </>
    );
}

export default TableFilters;
