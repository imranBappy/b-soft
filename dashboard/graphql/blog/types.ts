export interface BLOG_TYPE {
    id: string;
    title: string;
    slug: string;
    coverImage?: string | null;
    content: string;
    youtubeVideoUrl?: string | null;
    viewsCount: number;
    isPublished: boolean;
    createdAt: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    } | null;
    author?: {
        id: string;
        email: string;
        firstName?: string | null;
        lastName?: string | null;
    } | null;
    likesCount: number;
    commentsCount: number;
}
export interface BLOG_CATEGORY_TYPE {
    id: string;
    name: string;
    description: string;
    photo: string;
    isActive: boolean;
    blogs?: BLOG_TYPE[];
    subcategories?: BLOG_CATEGORY_TYPE[];
}
