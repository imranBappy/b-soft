import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, Path } from 'react-hook-form';

export const TextField = <
    T extends Record<
        string,
        string | number | boolean | FileList | File | undefined
    >
>({
    form,
    name,
    label,
    placeholder,
    className = '',
    itemClassName = '',
    type = 'text',
    min,
    disabled = false,
    onChange,
    ...rest
}: {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    className?: string;
    itemClassName?: string;
    disabled?:boolean;
    type?: string;
    min?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    rest?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
    return (
        <FormField
            disabled={disabled}
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={itemClassName}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={(field.value as string) || ''}
                            placeholder={placeholder}
                            className={`h-11  ${className}`}
                            type={type}
                            min={min}
                            onChange={(e) => {
                                field.onChange(e);
                                if (onChange) onChange(e);
                            }}
                            {...rest}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default TextField;