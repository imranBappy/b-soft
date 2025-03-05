"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
// import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { REVIEW_MUTATION, REVIEW_TYPE } from "@/graphql/product";
import moment from 'moment';
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
const ProductReview = ({ reviews, productId }: { reviews: { node: REVIEW_TYPE }[], productId: string }) => {
    const [currentPage,] = useState(1);
    const router  = useRouter();
    const reviewsPerPage = 3;
    const { toast } = useToast();
    const auth = useAuth()
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

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

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

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

            <div className="space-y-4">
                {currentReviews.map((review, index) => (
                    <Card key={index}>
                        <CardHeader >
                            <div className="w-full  flex justify-between">
                                <CardTitle >{review.node.user?.name}</CardTitle>
                                <p className=" font-playfair text-sm ">{moment(review.node.createdAt).fromNow()}</p>
                            </div>

                        </CardHeader>
                        <CardContent>
                            <p>{review.node.content}</p>
                            <div className="flex mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-5 w-5 ${i < review.node.rating ? "text-yellow-500" : "text-gray-300"}`} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>


            {/* <Pagination className="mt-4 flex justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination> */}

            <div className="mt-4 p-4 border rounded-xl space-y-4">
                <h3 className="text-xl font-semibold">Write a Review</h3>
                <Textarea
                    placeholder="Your Review"
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                />
                <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-6 w-6 cursor-pointer ${i < newReview.rating ? "text-yellow-500" : "text-gray-300"}`}
                            onClick={() => handleStarClick(i + 1)}
                        />
                    ))}
                </div>
                <Button disabled={loading} onClick={handleSubmit}>Submit Review</Button>
            </div>
        </div>
    );
};

export default ProductReview