// dashboard/graphql/blog/queries.ts
import { gql } from '@apollo/client';

export const GET_BLOG_CATEGORIES_ADMIN = gql`
    query GetBlogCategoriesAdmin($after: String, $first: Int, $search: String) {
        allBlogCategories(after: $after, first: $first, search: $search) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    name
                    slug
                    description
                    createdAt
                    updatedAt
                }
            }
        }
    }
`;

export const GET_BLOG_CATEGORY_BY_ID = gql`
    query GetBlogCategoryById($id: ID!) {
        blogCategoryById(id: $id) {
            id
            name
            slug
            description
            createdAt
            updatedAt
        }
    }
`;

export const GET_BLOG_POSTS_ADMIN = gql`
    query GetBlogPostsAdmin(
        $after: String
        $first: Int
        $category: String
        $search: String
        $isPublished: Boolean
    ) {
        allBlogPosts(
            after: $after
            first: $first
            category: $category
            search: $search
            isPublished: $isPublished
        ) {
            pageInfo {
                hasNextPage
                endCursor
            }
            edges {
                node {
                    id
                    title
                    slug
                    coverImage
                    content
                    youtubeVideoUrl
                    viewsCount
                    isPublished
                    createdAt
                    updatedAt
                    category {
                        id
                        name
                        slug
                    }
                    author {
                        id
                        email
                        name
                    }
                    likesCount
                    commentsCount
                }
            }
        }
    }
`;

export const GET_BLOG_POST_BY_ID = gql`
    query GetBlogPostById($id: ID!) {
        blogPostById(id: $id) {
            id
            title
            slug
            coverImage
            content
            youtubeVideoUrl
            viewsCount
            isPublished
            createdAt
            updatedAt
            category {
                id
                name
                slug
            }
            author {
                id
                email
                name
            }
            likesCount
            commentsCount
        }
    }
`;

export const GET_COMMENTS_ADMIN = gql`
    query GetCommentsAdmin($blogPostSlug: String, $search: String) {
        commentsByBlogPost(blogPostSlug: $blogPostSlug) {
            # You might need a separate query for all comments regardless of post
            id
            text
            createdAt
            user {
                id
                email
                name
            }
            blogPost {
                id
                title
                slug
            }
            parentComment {
                id
            }
            replies {
                id
                text
                createdAt
                user {
                    id
                    email
                }
            }
        }
    }
`;
