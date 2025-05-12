import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, } from '@/components/ui/form';
import { UseFormReturn, Path } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

export const SwitchField = <T extends Record<string, string | number | boolean | FileList | File | undefined>>({
    form,
    name,
    label,
    className = '',
}: {
    form: UseFormReturn<T>
    name: Path<T>
    label: string

    className?: string,
    type?: string
}) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex gap-3 flex-col ">
                    <FormLabel className="text-sm font-normal ">
                        {label}
                    </FormLabel>
                    <FormControl className='flex items-center'>
                        <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                            className={`${className}`}
                        />
                    </FormControl>

                </FormItem>
            )}
        />
    );
};

export default SwitchField;