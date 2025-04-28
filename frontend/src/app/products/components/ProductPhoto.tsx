"use client"
import React, { useState, useEffect,  } from 'react';
import NoImage from '@/assets/no-image.jpg';
import Image from 'next/image';
import { jsonToImages } from '@/lib/utils';
import useStore from '@/stores';

type ProductPhotoProps = {
    photo: string;
    alt: string;
    productId: string;
};
const ProductPhoto = ({
    photo,
    alt,
    productId="",
}: ProductPhotoProps) => {


    const [selected, setSelected] = useState(0);
    const [allImages, setAllImages] = useState<string[]>([]);
    const selectdImage = allImages.length ? allImages[selected] : undefined;
    const selectedProduct = useStore((store) => store?.options?.find((item) => item?.productId === productId) );

    useEffect(() => {
        const fetchImages = async () => {
            const imagesArray = await jsonToImages(
                selectedProduct?.option.photo ? selectedProduct?.option.photo :photo
            );
            if (imagesArray?.length) {
                setSelected(0);
            }
            if (imagesArray?.length) {
                setAllImages(imagesArray);
            }
        };
        fetchImages();
    }, [photo, selectedProduct?.option.photo]);
  
    return (
        <div className="flex flex-col gap-3">
            <Image
                className="w-[500px]  rounded-sm "
                src={selectdImage || NoImage}
                width={500}
                height={500}
                alt={alt || 'Product Image'}
            />
            <div className="flex gap-2 ">
                {allImages?.length ? (
                    allImages.map((link, i) => (
                        <Image
                            onClick={() => setSelected(i)}
                            key={i}
                            className={`w-[65px] cursor-pointer rounded-sm  border ${
                                selected === i ? ' shadow' : ''
                            }`}
                            src={link}
                            width={500}
                            height={500}
                            alt={alt || 'Product Image'}
                        />
                    ))
                ) : (
                    <Image
                        className="w-[65px] cursor-pointer rounded-sm shadow border"
                        src={NoImage}
                        width={500}
                        height={500}
                        alt={alt || 'Product Image'}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductPhoto;