// frontend/src/graphql/blog/queries.ts
import { gql } from '@apollo/client';

export const GET_BLOG_CATEGORIES = gql`
    query GetBlogCategories {
        allBlogCategories {
            edges {
                node {
                    id
                    name
                    slug
                    description
                }
            }
        }
    }
`;

export const GET_BLOG_POSTS = gql`
    query GetBlogPosts(
        $after: String
        $first: Int
        $category: String
        $search: String
    ) {
        allBlogPosts(
            after: $after
            first: $first
            category: $category
            search: $search
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
                    content # You might truncate this for listing, or fetch less for previews
                    youtubeVideoUrl
                    viewsCount
                    isPublished
                    createdAt
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

export const GET_BLOG_POST_BY_SLUG = gql`
    query GetBlogPostBySlug($slug: String!) {
        blogPostBySlug(slug: $slug) {
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
            comments {
                id
                text
                createdAt
                user {
                    id
                    email
                    name
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
                        name
                    }
                    parentComment {
                        id
                    }
                }
            }
            # You might add a field to check if the current user has liked this post
            # hasLiked: graphene.Boolean() if you add it to the backend resolver
        }
    }
`;

export const CREATE_COMMENT_MUTATION = gql`
    mutation CreateComment(
        $blogPostSlug: String!
        $text: String!
        $parentCommentId: ID
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
                    name
                }
                parentComment {
                    id
                }
                replies {
                    # Re-fetch replies to update UI
                    id
                    text
                    createdAt
                    user {
                        id
                        email
                        name
                    }
                }
            }
        }
    }
`;

export const TOGGLE_LIKE_MUTATION = gql`
    mutation ToggleLike($blogPostSlug: String!) {
        toggleLike(blogPostSlug: $blogPostSlug) {
            blogPost {
                id
                likesCount
            }
            liked # true if liked, false if unliked
        }
    }
`;
