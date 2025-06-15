import type { Metadata, ResolvingMetadata } from 'next';
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
import { notFound } from 'next/navigation';
import fetchProductDetails from '@/apis/fetcheProductDetails';
import ProductPrice from '../components/ProductPrice';
import ProductAttributeOptions from '../components/ProductAttributeOptions';
import { ATTRIBUTE_OPTION_TYPE, PRODUCT_TYPE } from '@/graphql/product';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CartBuy from '../components/CartBuy';
import ProductPhoto from '../components/ProductPhoto';
import ProductFAQ from '../components/ProductFAQ';
import ProductReview from '../components/ProductReview';
import ProductAttributeOptionsRemove from '../components/ProductAttributeOptionsRemove';
import ProductAttributeOptionsMes from '../components/ProductAttributeOptionsMes';
import { getThumblain } from '@/lib/utils';

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug;
    console.log({ slug });

    const data = await fetchProductDetails(slug);
    const product = data?.data?.product;
    const previousImages = (await parent).openGraph?.images || [];
    return {
        title: `${product.name} - Buy Now at Bsoft`,
        description: `Get ${product.name} at the best price from Bsoft. Instant delivery and secure payment options available.`,
        openGraph: {
            title: `${product.name} - Available at Bsoft`,
            description: product.shortDescription,
            url: `${process.env.NEXT_PUBLIC_WEB_URL}/products/${product.id}`,
            images: [
                {
                    url: await getThumblain(product.photo),
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
                ...previousImages,
            ],
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const productSlug = (await params).slug;

    const data = await fetchProductDetails(productSlug);
    if (data?.errors) {
        notFound();
    }
    console.log({ data });

    const product: PRODUCT_TYPE = data?.data?.product;
    const attributes = product.attributes?.edges;
    const descriptions = product.descriptions?.edges;
    const faqs = product.faqs?.edges;

    return <></>;

    return (
        <div className="container px-5 mx-auto">
            <div className="mt-5 flex  gap-10 flex-wrap md:flex-nowrap">
                <div className="md:w-[500px] w-[350px] m-auto md:m-0">
                    <ProductPhoto
                        productId={product.id || ''}
                        photo={product.photo || ''}
                        alt={product.name || ''}
                    />
                </div>
                <div className="100%">
                    <h1 className="font-playfair font-semibold leading-7  md:text-2xl text-lg  ">
                        {product.name}
                    </h1>
                    {product?.priceRange ? (
                        <div className=" my-3  font-playfair font-semibold mt-3 text-3xl">
                            ৳{product.priceRange}
                        </div>
                    ) : (
                        <>
                            <br />
                        </>
                    )}

                    <div
                        className="text-gray-600! dark:text-gray-300! font-lato md:text-lg text-sm  md:mt-2 "
                        dangerouslySetInnerHTML={{
                            __html: product.shortDescription,
                        }}
                    />
                    <ProductPrice
                        productId={product.id}
                        price={product.price}
                        offerPrice={product?.offerPrice}
                    />
                    <div className=" flex flex-col gap-3 mt-3">
                        {attributes?.map((item) => (
                            <div key={item.node.id}>
                                <div>
                                    <h6 className="font-playfair font-semibold leading-7  text-lg">
                                        {item.node.name}
                                    </h6>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    {item.node?.attributeOptions?.edges?.map(
                                        (op: {
                                            node: ATTRIBUTE_OPTION_TYPE;
                                        }) => (
                                            <ProductAttributeOptions
                                                attributeId={item.node.id}
                                                option={op.node}
                                                key={op.node.id}
                                                product={product}
                                            />
                                        )
                                    )}
                                    <ProductAttributeOptionsRemove
                                        attributeId={item.node.id}
                                    />
                                </div>
                                <ProductAttributeOptionsMes
                                    attributeId={item.node.id}
                                />
                            </div>
                        ))}
                    </div>
                    <CartBuy product={product} />
                </div>
            </div>
            <div>
                <div>
                    <div className=" p-1 flex  md:gap-2 gap-1   mt-5 flex-wrap">
                        {descriptions?.map((item) => (
                            <Link
                                className="font-playfair font-semibold leading-7  "
                                href={`#${item.node?.tag}`}
                                key={item.node.id}
                            >
                                <Button
                                    className="px-0 underline rounded-sm font-playfair text-left text-white md:text-xl text-base  text-wrap  "
                                    variant={'link'}
                                >
                                    {item.node?.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                    {descriptions?.map((item, i) => (
                        <section
                            className="scroll-smooth"
                            id={`#${item.node?.tag}`}
                            key={item.node.id}
                        >
                            {i !== 0 ? (
                                <h6 className="font-playfair  font-semibold leading-7 mt-5  text-xl ">
                                    {item.node?.label}
                                </h6>
                            ) : (
                                ''
                            )}
                            <div
                                className=" overflow-x-hidden w-full text-gray-600  dark:text-gray-300 font-lato md:text-lg text-sm mt-5 "
                                dangerouslySetInnerHTML={{
                                    __html: item.node.description,
                                }}
                            ></div>
                        </section>
                    ))}
                </div>
            </div>
            <ProductReview productId={productSlug} />
            <ProductFAQ faqs={faqs || []} />
        </div>
    );
}
