"use client"
import { Button } from '@/components/ui/button';
import useStore from '@/stores';
import { X } from 'lucide-react';



const ProductAttributeOptionsRemove = ({ attributeId }: { attributeId: string, }) => {
    const remoteProductOption = useStore((store) => store.remoteProductOption)
    return (
        <Button onClick={() => remoteProductOption(attributeId)} size={'icon'} variant={'destructive'}> <X /> </Button>
    );
};

export default ProductAttributeOptionsRemove;