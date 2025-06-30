import BlogPostDetailPage from './BlogDetails';

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return <BlogPostDetailPage slug={slug} />;
}
