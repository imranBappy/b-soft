// app/privacy-policy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - Bsoft',
    description: 'Bsoft Privacy Policy - How we handle your data',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                    <p className="text-muted-foreground">
                        Last updated: March 08, 2025
                    </p>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        1. Introduction
                    </h2>
                    <p>
                        {`
                        Welcome to Bsoft ("we", "our", "us"). We are committed
                        to protecting your privacy and personal information.
                        This Privacy Policy explains how we collect, use,
                        disclose, and safeguard your information when you visit
                        our website [bsoft.com] or purchase our software
                        products, including ChatGPT subscriptions, Windows
                        licenses, and other digital products.
                        `}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        2. Information We Collect
                    </h2>
                    <p>We may collect the following types of information:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Personal Information:</strong> Name, email
                            address, billing address, payment information when
                            you make a purchase.
                        </li>
                        <li>
                            <strong>Technical Data:</strong> IP address, browser
                            type, operating system, and usage data through
                            cookies and analytics tools.
                        </li>
                        <li>
                            <strong>Purchase Data:</strong> Details of products
                            purchased, including license keys and subscription
                            information.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        3. How We Use Your Information
                    </h2>
                    <p>We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            Process and fulfill your software purchases and
                            subscriptions
                        </li>
                        <li>
                            Provide license keys and product activation support
                        </li>
                        <li>Send order confirmations and renewal reminders</li>
                        <li>Improve our website and services</li>
                        <li>
                            Communicate with you about your purchases and
                            updates
                        </li>
                        <li>Comply with legal obligations</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        4. Sharing Your Information
                    </h2>
                    <p>We may share your information with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Payment processors to handle transactions</li>
                        <li>
                            Software vendors (e.g., Microsoft for Windows
                            licenses) to fulfill orders
                        </li>
                        <li>Legal authorities when required by law</li>
                        <li>
                            Service providers for analytics and customer support
                        </li>
                    </ul>
                    <p>
                        We do not sell your personal information to third
                        parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        5. Cookies and Tracking
                    </h2>
                    <p>
                        We use cookies and similar technologies to enhance your
                        browsing experience, analyze website traffic, and track
                        purchases. You can manage cookie preferences through
                        your browser settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        6. Data Security
                    </h2>
                    <p>
                        We implement industry-standard security measures to
                        protect your data, including encryption for payment
                        processing and secure storage of license information.
                        However, no method of transmission over the Internet is
                        100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        7. Your Rights
                    </h2>
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Access your personal information</li>
                        <li>Request correction of inaccurate data</li>
                        <li>
                            Request deletion of your data (subject to legal
                            obligations)
                        </li>
                        <li>Opt-out of marketing communications</li>
                    </ul>
                    <p>
                        To exercise these rights, contact us at
                        [privacy@bsoft.com].
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        8. Third-Party Services
                    </h2>
                    <p>
                        Our website may contain links to third-party sites
                        (e.g., Microsoft, OpenAI). We are not responsible for
                        their privacy practices. Please review their policies
                        separately.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        9. International Data Transfers
                    </h2>
                    <p>
                        Your information may be transferred to and processed in
                        countries other than your own, including for fulfilling
                        orders with international software vendors. We ensure
                        appropriate safeguards are in place.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        10. Changes to This Policy
                    </h2>
                    <p>
                        {`
                          We may update this Privacy Policy periodically. Changes
                        will be posted on this page with an updated "Last
                        updated" date.
                        `}
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">
                        11. Contact Us
                    </h2>
                    <p>
                        If you have questions about this Privacy Policy, contact
                        us at:
                        <br />
                        Email: privacy@b-soft.xyz
                        <br />
                        Address: Mirpur-7, Dhaka-1216
                    </p>
                </section>
            </div>
        </div>
    );
}
