"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
// import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PRODUCT_REVIEW, REVIEW_MUTATION, REVIEW_TYPE } from "@/graphql/product";
import moment from 'moment';
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
const ProductReview = ({  productId }: { productId: string }) => {
      const [page, setPage] = useState(1);
      const limit = 6;
    const router  = useRouter();
    const { toast } = useToast();

    const auth = useAuth()
    const { data } = useQuery(PRODUCT_REVIEW, {
        variables: {
            product: productId,
            first: limit,
            offset: (page - 1) * limit,
        },
    });

    
    
    const reviews:{ node: REVIEW_TYPE }[] = data?.reviews?.edges;
    
    const [postReview, { loading }] = useMutation(REVIEW_MUTATION, {
        onCompleted() {
            toast({ title: "Review submitted successfully!" });
            router.refresh();
        },
        onError: (err) => {
            console.log(err.message);
            
            toast({ title: err.message, variant: "destructive" });
        },
        
    })

   

    const [newReview, setNewReview] = useState({ content: "", rating: 0 });

    const handleSubmit = async () => {
        // console.log(auth);
        
        if (!auth?.isAuthenticated) {
            toast({ title: "Please login to submit a review.", variant: "destructive" });
            return;
        }
        
        if (newReview.content.trim() && newReview.rating > 0) {
            await postReview({
                variables: { ...newReview, product: productId, user: '0' }
            })
            setNewReview({ content: "", rating: 0 });
        } else {
            toast({ title: "Please fill out all fields and select a rating.", variant: "destructive" });
        }
    };

    const handleStarClick = (rating: number) => {
        setNewReview({ ...newReview, rating });
    };
     const handlePageChange = (page: number) => {
         setPage(page);
     };
     const totalCount = data?.reviews?.totalCount;
     const totalPages = Math.ceil(totalCount / limit);

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

            <div className="space-y-4">
                {reviews?.map(({ node }) => (
                    <Card key={node.id}>
                        <CardHeader>
                            <div className="w-full  flex justify-between">
                                <CardTitle>{node.user?.name}</CardTitle>
                                <p className=" font-playfair text-sm ">
                                    {moment(node.createdAt).fromNow()}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{node.content}</p>
                            <div className="flex mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < node.rating
                                                ? 'text-yellow-500'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div
            >
                {totalPages > 1 ? (
                    <Pagination className="mt-5">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        page > 1 && handlePageChange(page - 1)
                                    }
                                />
                            </PaginationItem>

                            {new Array(totalPages).fill(1).map((_, i) => {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() =>
                                                handlePageChange(i + 1)
                                            }
                                            isActive={page === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        page < totalPages &&
                                        handlePageChange(page + 1)
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                ) : null}
            </div>

            <div className="mt-4 p-4 border rounded-xl space-y-4">
                <h3 className="text-xl font-semibold">Write a Review</h3>
                <Textarea
                    placeholder="Your Review"
                    value={newReview.content}
                    onChange={(e) =>
                        setNewReview({ ...newReview, content: e.target.value })
                    }
                />
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-6 w-6 cursor-pointer ${
                                i < newReview.rating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                            }`}
                            onClick={() => handleStarClick(i + 1)}
                        />
                    ))}
                </div>
                <Button disabled={loading} onClick={handleSubmit}>
                    Submit Review
                </Button>
            </div>
        </div>
    );
};

export default ProductReview