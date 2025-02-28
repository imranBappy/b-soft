"use client"
import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import banner1 from '@/assets/banner1.png'
import banner2 from '@/assets/banner2.png'
import banner3 from '@/assets/banner3.png'
import Link from "next/link"

function BannerCarousel() {
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    )

    return (
        <Carousel
            plugins={[plugin.current]}
            className="container max-h-[500px]  mt-3 "
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                <CarouselItem>
                    <div className="p-3 rounded border">
                        <Link href={`/products/1`}>
                            <Image
                                className="rounded"
                                src={banner1}
                                alt="Banner 1"
                                width={1500}
                                height={700}
                            />
                        </Link>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="p-3 rounded border">
                        <Link href={`/products/1`}>
                            <Image
                                className="rounded"
                                src={banner2}
                                alt="Banner 1"
                                width={1700}
                                height={700}
                            />
                        </Link>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="p-3 rounded border">
                        <Link href={`/products/1`}>
                            <Image
                                className="rounded"
                                src={banner3}
                                alt="Banner 1"
                                width={1700}
                                height={700}
                            />
                        </Link>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <div className="  hidden lg:block">
                <CarouselPrevious />
                <CarouselNext />
            </div>
        </Carousel>
    );
}
export default BannerCarousel