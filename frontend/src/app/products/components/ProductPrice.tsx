"use client"
import { toFixed } from "@/lib/utils";
import useStore from "@/stores";

const ProductPrice = ({ price = 0, offerPrice = 0, productId='' }) => {
    const extraPrice = useStore((store) => store?.options?.filter(item => item.productId === productId).reduce((total, curr) => total + Number(curr.option.extraPrice), 0))
    const mainPrice = price + extraPrice
    const showPrice = toFixed(offerPrice ? Number(toFixed(offerPrice)) + extraPrice : mainPrice)

    return (
        <div className="flex gap-2 items-center">
            {offerPrice ? (
                <div className="  line-through dark:text-gray  text-gray-400  font-playfair font-semibold mt-3 text-3xl">
                    ৳120
                </div>
            ) : null}
            <div className=" text-blue font-playfair font-semibold mt-3 text-3xl">
                ৳{showPrice}
            </div>
        </div>
    );
};

export default ProductPrice;