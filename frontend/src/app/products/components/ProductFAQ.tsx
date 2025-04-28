import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQ_TYPE } from "@/graphql/product";

// FAQ Section Component
const ProductFAQ = ({ faqs }: { faqs: { node: FAQ_TYPE }[],}) => {
    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map(({node}, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{node.question}</CardTitle>
                        </CardHeader>
                        <CardContent>{node.answer}</CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProductFAQ