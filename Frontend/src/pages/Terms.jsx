import React from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Terms = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service - Leaad",
    description:
      "Terms of service and user agreement for Leaad AI-powered Reddit lead generation platform",
    url: "https://leaad.co/terms",
    mainEntity: {
      "@type": "Article",
      name: "Terms of Service",
      author: {
        "@type": "Organization",
        name: "Leaad",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Terms of Service - Leaad | User Agreement & Legal Terms"
        description="Read Leaad's terms of service, user agreement, and legal terms for using our AI-powered Reddit lead generation platform."
        keywords="terms of service, user agreement, legal terms, Leaad terms, platform terms"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong>{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Leaad's AI-powered Reddit lead generation
                platform ("Service"), you accept and agree to be bound by the
                terms and provision of this agreement.
              </p>
              <p className="text-gray-700">
                If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                Leaad provides an AI-powered platform that helps businesses and
                individuals generate leads through Reddit by:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Identifying potential customers and leads</li>
                <li>Analyzing Reddit conversations and buying intent</li>
                <li>Providing templates and tools for engagement</li>
                <li>Offering educational resources and guides</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Accounts and Registration
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.1 Account Creation
              </h3>
              <p className="text-gray-700 mb-4">
                To access certain features of our Service, you must create an
                account. You agree to provide accurate, current, and complete
                information during registration.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.2 Account Security
              </h3>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.3 Account Termination
              </h3>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend your account at any
                time for violations of these terms or for any other reason at
                our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Acceptable Use Policy
              </h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Harass, abuse, or harm others</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
              </ul>
              <p className="text-gray-700">
                Violation of this policy may result in immediate account
                termination and legal action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Payment Terms
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.1 Subscription Plans
              </h3>
              <p className="text-gray-700 mb-4">
                We offer various subscription plans with different features and
                pricing. All prices are subject to change with 30 days' notice.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.2 Billing and Renewal
              </h3>
              <p className="text-gray-700 mb-4">
                Subscriptions automatically renew unless cancelled before the
                renewal date. You authorize us to charge your payment method for
                all fees.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.3 Refunds
              </h3>
              <p className="text-gray-700">
                Refunds are provided according to our refund policy. No refunds
                for partial months or unused portions of annual plans.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Intellectual Property Rights
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.1 Our Rights
              </h3>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and
                functionality are owned by Leaad and are protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.2 Your Content
              </h3>
              <p className="text-gray-700 mb-4">
                You retain ownership of content you create using our Service. By
                using our Service, you grant us a limited license to use, store,
                and display your content as necessary to provide the Service.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.3 Third-Party Content
              </h3>
              <p className="text-gray-700">
                Our Service may contain content from third parties. We are not
                responsible for third-party content and do not endorse or verify
                its accuracy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Privacy and Data Protection
              </h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy, which is
                incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700">
                By using our Service, you consent to the collection and use of
                information as outlined in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Disclaimers and Limitations
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                8.1 Service Availability
              </h3>
              <p className="text-gray-700 mb-4">
                We strive to provide reliable service but cannot guarantee
                uninterrupted access. The Service is provided "as is" without
                warranties of any kind.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                8.2 Lead Generation Results
              </h3>
              <p className="text-gray-700 mb-4">
                While our tools can help identify potential leads, we cannot
                guarantee specific results. Success depends on various factors
                including market conditions and user implementation.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                8.3 Limitation of Liability
              </h3>
              <p className="text-gray-700">
                In no event shall Leaad be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your
                use of the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Indemnification
              </h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless Leaad from any claims,
                damages, losses, or expenses arising from your use of the
                Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Termination
              </h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate this agreement at any time. Upon
                termination:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Your access to the Service will cease</li>
                <li>We may delete your account and data</li>
                <li>You remain liable for any outstanding payments</li>
                <li>Provisions that survive termination remain in effect</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the Service constitutes acceptance of the modified Terms.
              </p>
              <p className="text-gray-700">
                We will notify you of material changes via email or through the
                Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Severability
              </h2>
              <p className="text-gray-700">
                If any provision of these Terms is found to be unenforceable,
                the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Entire Agreement
              </h2>
              <p className="text-gray-700">
                These Terms constitute the entire agreement between you and
                Leaad regarding the Service and supersede all prior agreements
                and understandings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@leaad.co
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/privacy"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Privacy Policy
              </Link>
              <Link
                to="/delivery-returns"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Delivery & Returns
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
