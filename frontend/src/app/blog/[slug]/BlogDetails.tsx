// frontend/src/app/blog/[slug]/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOG_POST_BY_SLUG } from '@/graphql/blog/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; //
import { format } from 'date-fns';
import Image from 'next/image'; //
import Link from 'next/link';
import useAuth from '@/hooks/use-auth';

// interface CommentProps {
//     comment: any;
//     onReply: (commentId: string) => void;
//     isLoggedIn: boolean;
// }

// const CommentItem: React.FC<CommentProps> = ({
//     comment,
//     onReply,
//     isLoggedIn,
// }) => {
//     return (
//         <div className="mb-4 p-4 border rounded-lg bg-gray-50">
//             <p className="text-sm text-gray-600 font-semibold">
//                 {comment.user?.name || comment.user?.email || 'Anonymous'}
//             </p>
//             <p className="text-xs text-gray-500 mb-2">
//                 {format(new Date(comment.createdAt), 'MMMM dd, yyyy HH:mm')}
//             </p>
//             <p className="text-gray-800">{comment.text}</p>
//             {isLoggedIn && (
//                 <Button
//                     variant="link"
//                     size="sm"
//                     onClick={() => onReply(comment.id)}
//                     className="px-0 mt-2"
//                 >
//                     Reply
//                 </Button>
//             )}
//             {comment.replies && comment.replies.length > 0 && (
//                 <div className="ml-6 mt-4 border-l-2 pl-4">
//                     {comment.replies.map((reply: any) => (
//                         <CommentItem
//                             key={reply.id}
//                             comment={reply}
//                             onReply={onReply}
//                             isLoggedIn={isLoggedIn}
//                         />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

interface BlogPostDetailPageProps {
    slug: string;
}

const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({ slug }) => {
    const checkAuth = useAuth();
    // const isLoggedIn = checkAuth?.isAuthenticated;
    const authLoading = checkAuth?.isLoading;
    // const { toast } = useToast(); //

    // const [commentText, setCommentText] = useState('');
    // const [replyToCommentId, setReplyToCommentId] = useState<string | null>(
    //     null
    // );

    const { data, loading, error } = useQuery(GET_BLOG_POST_BY_SLUG, {
        variables: { slug },
        fetchPolicy: 'cache-and-network',
    });

    // const [createComment, { loading: commentLoading }] = useMutation(
    //     CREATE_COMMENT_MUTATION,
    //     {
    //         onCompleted: () => {
    //             toast({
    //                 title: 'Comment added!',
    //                 description: 'Your comment has been posted.',
    //             }); //
    //             setCommentText('');
    //             setReplyToCommentId(null);
    //             refetch(); // Re-fetch comments to update UI
    //         },
    //         onError: (err) => {
    //             toast({
    //                 title: 'Error adding comment.', //
    //                 description: err.message,
    //                 variant: 'destructive',
    //             });
    //         },
    //     }
    // );

    // const [toggleLike, { loading: likeLoading }] = useMutation(
    //     TOGGLE_LIKE_MUTATION,
    //     {
    //         onCompleted: (data) => {
    //             toast({
    //                 title: data.toggleLike.liked ? 'Liked!' : 'Unliked.', //
    //                 description: data.toggleLike.liked
    //                     ? 'You liked this post.'
    //                     : 'You unliked this post.',
    //             });
    //         },
    //         onError: (err) => {
    //             toast({
    //                 title: 'Error liking post.', //
    //                 description: err.message,
    //                 variant: 'destructive',
    //             });
    //         },
    //         refetchQueries: [
    //             { query: GET_BLOG_POST_BY_SLUG, variables: { slug } },
    //         ], // Ensure likesCount updates
    //     }
    // );

    if (loading || authLoading)
        return <p className="text-center py-10">Loading post details...</p>;
    if (error)
        return (
            <p className="text-center py-10 text-red-500">
                Error: {error.message}
            </p>
        );
    if (!data?.blogPostBySlug)
        return <p className="text-center py-10">Blog post not found.</p>;

    const blogPost = data.blogPostBySlug;
    // const rootComments = blogPost.comments.filter(
    //     (comment: any) => !comment.parentComment
    // );

    // const handleCommentSubmit = async () => {
    //     if (!isLoggedIn) {
    //         toast({
    //             title: 'Please log in to comment.',
    //             variant: 'destructive',
    //         }); //
    //         return;
    //     }
    //     if (!commentText.trim()) {
    //         toast({
    //             title: 'Comment cannot be empty.',
    //             variant: 'destructive',
    //         }); //
    //         return;
    //     }
    //     await createComment({
    //         variables: {
    //             blogPostSlug: slug,
    //             text: commentText,
    //             parentCommentId: replyToCommentId,
    //         },
    //     });
    // };

    // const handleLikeToggle = async () => {
    //     if (!isLoggedIn) {
    //         toast({
    //             title: 'Please log in to like a post.',
    //             variant: 'destructive',
    //         }); //
    //         return;
    //     }
    //     await toggleLike({
    //         variables: { blogPostSlug: slug },
    //     });
    // };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Card className="shadow-lg">
                {' '}
                {/* */}
                {blogPost.coverImage && (
                    <div className="relative w-full h-72 mb-6">
                        <Image
                            src={blogPost.coverImage}
                            alt={blogPost.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                        />{' '}
                        {/* */}
                    </div>
                )}
                <CardHeader>
                    {' '}
                    {/* */}
                    <CardTitle className="text-3xl font-bold mb-2">
                        {blogPost.title}
                    </CardTitle>{' '}
                    {/* */}
                    <p className="text-sm text-gray-600">
                        {blogPost.author
                            ? `By ${blogPost.author.name || ''} ${
                                  blogPost.author.email
                              }`
                            : 'By Anonymous'}{' '}
                        on{' '}
                        {format(new Date(blogPost.createdAt), 'MMMM dd, yyyy')}
                        {blogPost.category && (
                            <span className="ml-2">
                                {' '}
                                | Category:{' '}
                                <Link
                                    href={`/blog?category=${blogPost.category.slug}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {blogPost.category.name}
                                </Link>
                            </span>
                        )}
                    </p>
                </CardHeader>
                <CardContent>
                    {' '}
                    {/* */}
                    {blogPost.youtubeVideoUrl && (
                        <div className="aspect-video w-full mb-6">
                            <iframe
                                className="w-full h-full rounded-lg"
                                src={`https://www.youtube.com/embed/${
                                    blogPost.youtubeVideoUrl
                                        .split('v=')[1]
                                        ?.split('&')[0]
                                }`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: blogPost.content }}
                    />
                </CardContent>
                {/* <CardFooter className="flex flex-col gap-4">
                    {' '}
                    <div className="flex items-center gap-4 text-sm text-gray-600 w-full justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />{' '}
                                {blogPost.likesCount} Likes
                            </span>
                            <span className="flex items-center">
                                <MessageCircle className="h-4 w-4 mr-1" />{' '}
                                {blogPost.commentsCount} Comments
                            </span>
                            <span>Views: {blogPost.viewsCount}</span>
                        </div>
                        {isLoggedIn && (
                            <Button
                                onClick={handleLikeToggle}
                                disabled={likeLoading}
                            >
                                {' '}
                                {likeLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                )}
                                {likeLoading
                                    ? 'Processing...'
                                    : 'Like / Unlike'}
                            </Button>
                        )}
                    </div>
                    <Card className="w-full mt-4">
                        {' '}
                        <CardHeader>
                            {' '}
                            <CardTitle className="text-lg">
                                Comments
                            </CardTitle>{' '}
                        </CardHeader>
                        <CardContent>
                            {' '}
                            {isLoggedIn ? (
                                <div className="mb-6">
                                    <h3 className="text-md font-semibold mb-2">
                                        Leave a Comment
                                    </h3>
                                    {replyToCommentId && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            Replying to comment ID:{' '}
                                            {replyToCommentId}{' '}
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() =>
                                                    setReplyToCommentId(null)
                                                }
                                            >
                                                Cancel Reply
                                            </Button>
                                        </p>
                                    )}
                                    <Textarea
                                        placeholder="Write your comment here..." 
                                        value={commentText}
                                        onChange={(e) =>
                                            setCommentText(e.target.value)
                                        }
                                        className="mb-2" 
                                    />
                                    <Button
                                        onClick={handleCommentSubmit}
                                        disabled={commentLoading}
                                    >
                                        {' '}
                                        {commentLoading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            'Submit Comment'
                                        )}
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    Please{' '}
                                    <Link
                                        href="/login"
                                        className="text-blue-600 hover:underline"
                                    >
                                        log in
                                    </Link>{' '}
                                    to leave a comment.
                                </p>
                            )}
                            {rootComments.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    No comments yet. Be the first to comment!
                                </p>
                            ) : (
                                <div>
                                    {rootComments.map((comment: any) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            onReply={setReplyToCommentId}
                                            isLoggedIn={isLoggedIn}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </CardFooter> */}
            </Card>
        </div>
    );
};

export default BlogPostDetailPage;
