"use client"
import { Button } from '@/components/ui/button';
import { ATTRIBUTE_OPTION_TYPE, PRODUCT_TYPE } from '@/graphql/product';
import { toFixed } from '@/lib/utils';
import useStore from '@/stores';


const ProductAttributeOptions = ({ option, attributeId, product }: { product: PRODUCT_TYPE, attributeId: string, option: ATTRIBUTE_OPTION_TYPE }) => {
    const addProductOption = useStore((store) => store.addProductOption)
    const findAttribute = useStore((store) => store.options.find((op) => op.id === attributeId))
    const carts = useStore((store) => store.cart)
    const options = useStore((store) => store.options)

    const addToCart = useStore((store) => store.addCart)
    const removeCart = useStore((store) => store.removeCart)
    const findCart = carts.find((item) => item.productId === product.id)
    const handleOptionSelect = async () => {

        const newOption = { id: attributeId, option: option, productId: `${product.id}`, }

        if (findCart) {

            removeCart(findCart.productId)
            const updatedOption = [...options.filter((op => op.id !== attributeId)), newOption] // && op.id !== attributeId
            const updatedFilters = updatedOption.filter((op => op.productId === product.id))
            findCart.attributes = updatedFilters.map((item) => ({
                attribute: item.id,
                option: String(item.option.id),
            }));

            const extraPrice = updatedFilters.reduce((total, curr) => total + Number(curr.option.extraPrice), 0)
            const mainPrice = product.price + extraPrice
            const showPrice = toFixed(product.offerPrice ? Number(toFixed(product.offerPrice)) + extraPrice : mainPrice)
            findCart.productPrice = Number(showPrice);

            addToCart(findCart)
        }
        addProductOption(newOption)

    }
    const isActiveLocal = findAttribute?.productId === product.id && findAttribute?.id === attributeId && findAttribute.option.id === option.id
    const findAtt = findCart?.attributes?.find((item) => item.attribute === attributeId)
    const isActive = findCart?.productId === product.id && findAtt && findAtt.option === `${option.id}`

    return (
        <Button onClick={handleOptionSelect} className='rounded-none ' size={'sm'} variant={(isActiveLocal || isActive) ? 'default' : 'outline'}>{option.option}</Button>
    );
};

export default ProductAttributeOptions;