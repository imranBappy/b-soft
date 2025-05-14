"use client"
import { Button } from '@/components/ui/button';
import { PRODUCT_TYPE } from '@/graphql/product';
import { useToast } from '@/hooks/use-toast';
import { getThumblain, toFixed } from '@/lib/utils';
import useStore from '@/stores';
import { ShoppingBasket, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CartBuy = ({ product }: { product: PRODUCT_TYPE }) => {

    const addToCart = useStore((store) => store.addCart)
    const incrementItemQuantity = useStore((store) => store.incrementItemQuantity)
    const options = useStore((store) => store.options)
    const carts = useStore((store) => store.cart)
    const { toast } = useToast()
    const router = useRouter()

    const extraPrice = useStore((store) => store.options.filter(item => item.productId === product.id).reduce((total, curr) => total + Number(curr.option.extraPrice), 0))
    const mainPrice = product.price + extraPrice
    const showPrice = toFixed(product.offerPrice ? Number(toFixed(product.offerPrice)) + extraPrice : mainPrice)

    const handleCart = async (isBuy = false) => {
        const findAttribute = options.find((op) => op.productId === product.id)
        const finderAttribute = options.filter((op) => op.productId === product.id)

        const findCart = carts.find((item) => item.productId === product.id)
        if (findCart) {
            incrementItemQuantity(findCart.productId)
            if (isBuy) {
                router.push('/checkout');
            }
            return;
        }
        if (product?.attributes?.edges?.length && !findAttribute) {
            toast({ variant: "destructive", description: "Please select the variation." })
            return;
        }
        addToCart({
            productId: product?.id || '',
            quantity: 1,
            productName: product.name,
            productPrice: Number(showPrice),
            productImg: await getThumblain(product.photo),
            attributes: finderAttribute.map((op) => ({ attribute: op.id, option: String(op.option.id) }))
        })
        toast({ description: "Product added to cart!" })

        if (isBuy) {
            router.push('/checkout');
        }
    }


    return (
        <div className='  mt-5 flex gap-[0.5px]'>
            <Button onClick={() => handleCart(false)} className=' font-playfair rounded-none w-40 ' variant={'secondary'} > <ShoppingCart /> Add To Cart </Button>
            <Button onClick={() => handleCart(true)} className=' text-white bg-blue rounded-none font-playfair w-40' > <ShoppingBasket /> Buy Now</Button>
        </div>
    );
};

export default CartBuy;