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
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Terms of Service - Leaad | User Agreement & Legal Terms"
        description="Read Leaad's terms of service, user agreement, and legal terms for using our AI-powered Reddit lead generation platform."
        keywords="terms of service, user agreement, legal terms, Leaad terms, platform terms"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="p-8">
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
                2. Company Information
              </h2>
              <p className="text-gray-700 mb-4">
                Leaad is a digital platform and brand operated by ESİLAH AV
                MALZEMELERİ, providing AI-powered Reddit lead generation
                services. Our platform helps businesses and individuals generate
                leads through Reddit by:
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
                3. Description of Service
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
                4. User Accounts and Registration
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
                Refunds are provided according to our{" "}
                <a
                  href="/legal/refund-policy"
                  className="text-blue-600 hover:underline"
                >
                  refund policy
                </a>
                . No refunds for partial months or unused portions of annual
                plans.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3 mt-6">
                5.4 Cancellations
              </h3>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time from your account
                dashboard. Cancellation takes effect at the end of the current
                billing cycle and you will continue to have access until that
                date. We do not charge cancellation fees. If you need immediate
                deactivation, contact support; note that cancelling does not
                entitle you to a refund for the remaining period unless required
                by law.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.5 Price Changes
              </h3>
              <p className="text-gray-700 mb-4">
                We may update subscription fees from time to time. Any changes
                will be communicated with reasonable advance notice and will
                apply from the next renewal term. Your continued use of the
                Service after the effective date constitutes acceptance of the
                updated pricing.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.6 Managing Your Subscription
              </h3>
              <p className="text-gray-700 mb-4">
                You can view invoices, update your payment method, and manage
                renewals in your account settings. Where required by applicable
                law, we will send pre-renewal reminders.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.7 Payment Processing and Security
              </h3>
              <p className="text-gray-700 mb-4">
                Payments are processed by our payment partners and may include
                applicable taxes (e.g., VAT/GST) based on your location. We do
                not store full payment card details on our servers and use
                industry-standard security measures to protect your information.
                Receipts are issued electronically.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.8 Failed Payments
              </h3>
              <p className="text-gray-700">
                If a renewal payment fails, we may notify you and provide a
                short grace period to update your payment method. Access may be
                limited or suspended until payment is completed.
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

          <div className="mt-12 pt-8">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/legal/privacy"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Privacy Policy
              </Link>
              <Link
                to="/legal/refund-policy"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refund Policy
              </Link>
              <Link
                to="/legal"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                All Legal Documents
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Additional Terms merged and paraphrased from external policy */}
          <section className="mb-8 mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Cookies
            </h2>
            <p className="text-gray-700">
              We use cookies and similar technologies to operate the Service and
              improve your experience. By using the Service, you consent to our
              use of cookies as described in our Privacy Policy, where you can
              also find details about types of cookies and how to control them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. Website Content Use
            </h2>
            <p className="text-gray-700 mb-4">
              Unless otherwise stated, Leaad and/or its licensors own the
              intellectual property rights for materials on the Service. All
              rights are reserved. You may use the website for your personal,
              lawful use subject to these Terms. You must not:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Republish website material without permission</li>
              <li>Sell, rent, or sub‑license website material</li>
              <li>Reproduce, duplicate, or copy website material</li>
              <li>Redistribute website content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              17. Community Areas and User Comments
            </h2>
            <p className="text-gray-700 mb-4">
              Where the Service allows posting of opinions or other content,
              submissions reflect the views of the individual users and not of
              Leaad. We do not pre‑screen all submissions but reserve the right
              to monitor and remove content that is unlawful, infringing, or
              violates these Terms.
            </p>
            <p className="text-gray-700 mb-2">You confirm that:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>
                You have all necessary rights and permissions to post your
                submissions
              </li>
              <li>
                Your submissions do not violate intellectual property or privacy
                rights of others
              </li>
              <li>
                Your submissions are not defamatory, obscene, or otherwise
                unlawful
              </li>
              <li>
                You will not use submissions for unsolicited promotions or
                illegal activities
              </li>
            </ul>
            <p className="text-gray-700">
              By posting, you grant Leaad a non‑exclusive, worldwide license to
              use, reproduce, and adapt your submissions as needed to operate
              the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              18. Linking to Our Service
            </h2>
            <p className="text-gray-700 mb-4">
              You may link to public pages of the Service provided the link is
              not misleading, does not imply sponsorship or endorsement, and is
              consistent with the context of the linking site. Use of Leaad’s
              logos or brand requires prior written permission. We may request
              removal of links at any time at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              19. Framing
            </h2>
            <p className="text-gray-700">
              You may not frame or embed pages of the Service to alter their
              presentation without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              20. External Content and Link Removal
            </h2>
            <p className="text-gray-700 mb-4">
              We are not responsible for content appearing on third‑party
              websites that link to or from the Service. If you believe a link
              on our site is inappropriate, please contact us and we will
              consider your request, though we are not obligated to respond or
              remove such links.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              21. Accuracy of Information
            </h2>
            <p className="text-gray-700">
              We endeavor to keep information on the Service current, but do not
              warrant its completeness or accuracy. We do not guarantee the
              Service or its content will always be available or up to date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              22. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of the jurisdiction in which
              Leaad is established, without regard to conflict‑of‑laws rules.
              Mandatory consumer protections in your place of residence remain
              unaffected. Where permitted by law, disputes will be resolved
              through binding arbitration or the courts located in our principal
              place of business, and you waive any right to a jury trial or
              class action to the fullest extent permitted.
            </p>
            <p className="text-gray-700">
              Nothing in these Terms limits liability where such limitation is
              prohibited by law.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
