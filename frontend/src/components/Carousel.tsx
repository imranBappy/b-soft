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
import Link from "next/link"
import { SLIDER_TYPE, SLIDERS_QUERY } from "@/graphql/setting"
import { useQuery } from "@apollo/client"
import { Skeleton } from "./ui/skeleton"

function BannerCarousel() {

    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: false })
    )

    const { data: res, loading } = useQuery(SLIDERS_QUERY, {
        variables: {},
    }
    );
    

    const sliders: SLIDER_TYPE[] = res?.sliders?.edges?.map(({ node }: { node: SLIDER_TYPE }) => ({
        id: node.id,
        link: node.link,
        image: node.image,
    })) || [];

  if (loading) {
      return (
          <div className="container max-h-[500px] mt-3">
              <div className="p-3 rounded border">
                  <Skeleton className="w-full md:h-[475px] h-[130px] rounded" />
              </div>
          </div>
      );
  }

    return (
        <Carousel
            plugins={[plugin.current]}
            className="container max-h-[500px]  mt-3 "
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {
                    sliders.map((slider) => (<CarouselItem
                        key={slider.id}
                    >
                        <div className="p-3 rounded border">
                            <Link href={slider?.link || "#"}>
                                <Image
                                    className="rounded"
                                    src={slider.image}
                                    alt="Banner 1"
                                    width={1500}
                                    height={700}
                                />
                            </Link>
                        </div>
                    </CarouselItem>))
                }


            </CarouselContent>
            <div className="  hidden lg:block">
                <CarouselPrevious />
                <CarouselNext />
            </div>
        </Carousel>
    );
}
export default BannerCarousel