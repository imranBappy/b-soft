"use client"
import useStore from '@/stores';

const ProductAttributeOptionsMes = ({ attributeId }: { attributeId: string, }) => {
    const findOp = useStore((store) => store.options.find((op) => op.id === attributeId))
    if (!findOp?.option.message) {
        return null
    }
    return (
        <div className=' ring-1 p-2 mt-2 text-blue font-lato '>{findOp?.option.message}</div>
    );
};

export default ProductAttributeOptionsMes;