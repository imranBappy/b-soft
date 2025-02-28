"use client"

import { useState } from "react"
import Image from "next/image"
import NoImage from '@/assets/no-image.jpg';

interface ImageGalleryProps {
    images: string[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Main image */}
            <div className="flex-grow">
                <Image
                    src={images[selectedImage] || "/placeholder.svg"}
                    alt={`Product image ${selectedImage + 1}`}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                />
            </div>

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 ${selectedImage === index ? "ring-2 ring-blue-500" : ""}`}
                    >
                        <Image
                            src={NoImage}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-20 h-20 object-cover rounded-md"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}

