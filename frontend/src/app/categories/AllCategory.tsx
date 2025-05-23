'use client'
import Category from '@/components/Category';
import CategoryLoader from '@/components/CategoryLoader';
import { CATEGORIES_QUERY, CATEGORY_TYPE } from '@/graphql/product';
import { useQuery } from '@apollo/client';
const AllCategory = () => {
    const { loading, data, } = useQuery(CATEGORIES_QUERY, {
        variables: {
            isActive: true
        }
    })
    let content = data?.categories?.edges?.map(
        (category: { node: CATEGORY_TYPE }) => (
            <Category key={category.node.id} data={category.node} />
        )
    );

    if (loading || !data?.categories?.edges.length) {
        content = new Array(5).fill(1).map((_, i) => <CategoryLoader key={i} />);
    }
    return (
        <>

            <section className="relative py-24 px-6 text-center border-b border-neutral-800">
                <div className="max-w-4xl mx-auto">
                    {/* Yellow Line Accent */}
                    <div className="w-16 h-1 bg-[#FFC400] mx-auto mb-6 rounded-full"></div>

                    <h1 className="md:text-5xl text-4xl font-bold tracking-tight">
                        Explore Our Categories
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Curated content in one place — from cutting-edge technology to inspiring travel ideas. Find what sparks your mind.
                    </p>
                </div>

                {/* Optional glow or design accent */}
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 opacity-5 blur-2xl pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at 50% 20%, #FFC400 10%, transparent 60%)',
                    }}
                />
            </section>
            <section className="container mx-auto px-6 py-14">
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {content}
                </div>
            </section>
        </>
    );
};

export default AllCategory;