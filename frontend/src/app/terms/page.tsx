// app/terms-and-conditions/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms and Conditions - Bsoft',
    description: 'Bsoft Terms and Conditions for software purchases',
};

export default function TermsAndConditionsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold">Terms and Conditions</h1>
                    <p className="text-muted-foreground">
                        Last updated: March 08, 2025
                    </p>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        1. Acceptance of Terms
                    </h2>
                    <p>
                        {`
                        By accessing or using the Bsoft website [bsoft.com]
                        ("Website") or purchasing our software products
                        ("Products"), including ChatGPT subscriptions, Windows
                        licenses, and other digital goods, you agree to be bound
                        by these Terms and Conditions ("Terms"). If you do not
                        agree, please do not use our Website or purchase our
                        Products.
                        `}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        2. Products and Services
                    </h2>
                    <p>
                        Bsoft offers digital software products and
                        subscriptions. All purchases are subject to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Product availability</li>
                        <li>Payment confirmation</li>
                        <li>
                            Compliance with third-party vendor terms (e.g.,
                            Microsoft, OpenAI)
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        3. Pricing and Payment
                    </h2>
                    <p>
                        All prices are listed in [USD] and are subject to change
                        without notice. Payment must be made in full at the time
                        of purchase through our accepted payment methods. You
                        are responsible for any applicable taxes or fees.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        4. License and Usage
                    </h2>
                    <p>
                        Upon purchase, you receive a non-exclusive,
                        non-transferable license to use the software product
                        according to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>These Terms</li>
                        <li>
                            The specific product’s End User License Agreement
                            (EULA) from the software vendor
                        </li>
                        <li>
                            License keys are for personal use only and may not
                            be resold or shared
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Delivery</h2>
                    <p>
                        Products are delivered electronically via email or
                        download link upon successful payment. Delivery times
                        may vary due to technical issues or third-party
                        processing. We are not responsible for delays outside
                        our control.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        6. Refunds and Returns
                    </h2>
                    <p>Due to the digital nature of our Products:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>All sales are final unless otherwise stated</li>
                        <li>
                            Refunds may be considered within 14 days of purchase
                            if the product is defective or unusable
                        </li>
                        <li>
                            Contact [support@b-soft.xyz] for refund requests
                        </li>
                    </ul>
                    <p>
                        Subscription renewals can be canceled before the renewal
                        date with no penalty.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        7. Intellectual Property
                    </h2>
                    <p>
                        All content on the Website, including text, graphics,
                        and software, is owned by Bsoft or our licensors and is
                        protected by copyright laws. You may not reproduce,
                        distribute, or modify this content without permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        8. Limitation of Liability
                    </h2>
                    <p>
                        To the maximum extent permitted by law, Bsoft shall not
                        be liable for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Indirect, incidental, or consequential damages</li>
                        <li>Loss of data, profits, or use from our Products</li>
                        <li>
                            Issues arising from third-party software vendors
                        </li>
                    </ul>
                    <p>
                        Our total liability shall not exceed the amount paid for
                        the Product.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        9. Termination
                    </h2>
                    <p>
                        We may terminate your access to our Website or Products
                        if you:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Violate these Terms</li>
                        <li>Engage in fraudulent activity</li>
                        <li>Misuse license keys or subscriptions</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        10. Governing Law
                    </h2>
                    <p>
                        These Terms are governed by the laws of [Your
                        Country/State]. Any disputes shall be resolved in the
                        courts of [Your Jurisdiction].
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        11. Changes to Terms
                    </h2>
                    <p>
                        {`
                         We may modify these Terms at any time. Updated Terms
                        will be posted on this page with a revised "Last
                        updated" date. Continued use of our Website or Products
                        constitutes acceptance of the modified Terms.
                        `}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        12. Contact Us
                    </h2>
                    <p>
                        For questions about these Terms, contact us at:
                        <br />
                        Email: support@b-soft.xyz
                        <br />
                        Address: Mirpur-7, Dhaka-1216
                    </p>
                </section>
            </div>
        </div>
    );
}
