// dashboard/graphql/blog/mutations.ts
import { gql } from '@apollo/client';

// Blog Category Mutations
export const CREATE_BLOG_CATEGORY_MUTATION = gql`
    mutation CreateBlogCategory($name: String!, $description: String) {
        createBlogCategory(name: $name, description: $description) {
            blogCategory {
                id
                name
                slug
                description
            }
        }
    }
`;

export const UPDATE_BLOG_CATEGORY_MUTATION = gql`
    mutation UpdateBlogCategory($id: ID!, $name: String, $description: String) {
        updateBlogCategory(id: $id, name: $name, description: $description) {
            blogCategory {
                id
                name
                slug
                description
            }
        }
    }
`;

export const DELETE_BLOG_CATEGORY_MUTATION = gql`
    mutation DeleteBlogCategory($id: ID!) {
        deleteBlogCategory(id: $id) {
            success
        }
    }
`;

// Blog Post Mutations
export const CREATE_BLOG_POST_MUTATION = gql`
    mutation CreateBlogPost(
        $categoryId: ID
        $title: String!
        $coverImage: String
        $content: String!
        $youtubeVideoUrl: String
        $isPublished: Boolean
    ) {
        createBlogPost(
            categoryId: $categoryId
            title: $title
            coverImage: $coverImage
            content: $content
            youtubeVideoUrl: $youtubeVideoUrl
            isPublished: $isPublished
        ) {
            blogPost {
                id
                title
                slug
                coverImage
                content
                youtubeVideoUrl
                isPublished
                category {
                    id
                    name
                }
            }
        }
    }
`;

export const UPDATE_BLOG_POST_MUTATION = gql`
    mutation UpdateBlogPost(
        $id: ID!
        $categoryId: ID
        $title: String
        $coverImage: String
        $content: String
        $youtubeVideoUrl: String
        $isPublished: Boolean
    ) {
        updateBlogPost(
            id: $id
            categoryId: $categoryId
            title: $title
            coverImage: $coverImage
            content: $content
            youtubeVideoUrl: $youtubeVideoUrl
            isPublished: $isPublished
        ) {
            blogPost {
                id
                title
                slug
                coverImage
                content
                youtubeVideoUrl
                isPublished
                category {
                    id
                    name
                }
            }
        }
    }
`;

export const DELETE_BLOG_POST_MUTATION = gql`
    mutation DeleteBlogPost($id: ID!) {
        deleteBlogPost(id: $id) {
            success
        }
    }
`;

// Comment Mutations (for admin moderation)
export const DELETE_COMMENT_MUTATION = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            success
        }
    }
`;

export const REPLY_TO_COMMENT_MUTATION = gql`
    mutation ReplyToComment(
        $blogPostSlug: String!
        $text: String!
        $parentCommentId: ID!
    ) {
        createComment(
            blogPostSlug: $blogPostSlug
            text: $text
            parentCommentId: $parentCommentId
        ) {
            comment {
                id
                text
                createdAt
                user {
                    id
                    email
                }
                parentComment {
                    id
                }
            }
        }
    }
`;
