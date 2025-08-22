import React from "react";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const RefundPolicy = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Refund Policy - Leaad",
    description:
      "Leaad's comprehensive refund policy, delivery terms, and cancellation policy for our Reddit lead generation platform.",
    url: "https://leaad.co/refund-policy",
    mainEntity: {
      "@type": "Article",
      name: "Refund Policy",
      author: {
        "@type": "Organization",
        name: "Leaad",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Refund Policy - Leaad | Money-Back Guarantee & Refund Terms"
        description="Learn about Leaad's refund policy, delivery terms, cancellation policy, and how to request a refund for our Reddit lead generation services."
        keywords="refund policy, money-back guarantee, refund terms, delivery policy, cancellation policy, Leaad refunds, customer satisfaction"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Refund Policy & Delivery Terms
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
                1. Service Delivery
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                1.1 Digital Service Nature
              </h3>
              <p className="text-gray-700 mb-4">
                Leaad provides digital services including AI-powered lead
                generation tools, analytics, and educational resources. These
                services are delivered electronically upon successful payment
                and account activation.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                1.2 Immediate Access
              </h3>
              <p className="text-gray-700 mb-4">
                Upon successful payment and account verification, you will
                receive immediate access to:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Platform dashboard and tools</li>
                <li>Lead generation templates and resources</li>
                <li>Analytics and reporting features</li>
                <li>Educational guides and tutorials</li>
                <li>Customer support access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Subscription Terms
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.1 Billing Cycles
              </h3>
              <p className="text-gray-700 mb-4">
                We offer monthly subscription plans. Billing occurs on the same
                date each month.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.2 Automatic Renewal
              </h3>
              <p className="text-gray-700 mb-4">
                Subscriptions automatically renew unless cancelled before the
                renewal date. You will receive email notifications 7 days and 1
                day before renewal.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.3 Service Continuity
              </h3>
              <p className="text-gray-700">
                Your service continues uninterrupted during the renewal process.
                If payment fails, you will have a 3-day grace period to update
                payment information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Cancellation Policy
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.1 Cancellation Rights
              </h3>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time through your
                account dashboard or by contacting customer support.
                Cancellation takes effect at the end of your current billing
                period.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.2 Cancellation Process
              </h3>
              <p className="text-gray-700 mb-4">To cancel your subscription:</p>
              <ol className="list-decimal pl-6 text-gray-700 mb-4">
                <li>Log into your account dashboard</li>
                <li>Navigate to Billing & Subscription</li>
                <li>Click "Cancel Subscription"</li>
                <li>Confirm cancellation</li>
                <li>Receive confirmation email</li>
              </ol>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                3.3 Immediate Cancellation
              </h3>
              <p className="text-gray-700">
                For immediate account deactivation, contact customer support.
                Note that immediate cancellation forfeits any remaining time in
                your current billing period.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Flexible Refund Policy
              </h2>
              <p className="text-gray-700 mb-4">
                At Leaad, we believe in customer satisfaction and fair business
                practices. Our refund policy is designed to be flexible and
                understanding of various situations that may arise.
              </p>
              <p className="text-gray-700">
                We offer refunds for wrong purchases, service issues, and cases
                where our service doesn't meet your expectations. Our goal is to
                ensure you have confidence in your investment with us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Eligibility for Refunds
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.1 Wrong Purchases
              </h3>
              <p className="text-gray-700 mb-4">
                We understand that mistakes happen. If you accidentally
                purchased the wrong plan or service, you must contact us within{" "}
                <strong>3 days of purchase</strong> to request a refund or plan
                switch. After this period, we cannot accommodate wrong purchase
                refunds.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.2 Service Issues
              </h3>
              <p className="text-gray-700 mb-4">
                If our service doesn't work as advertised or if you experience
                technical issues that prevent you from using the platform
                effectively, you must report these issues within{" "}
                <strong>3 days of purchase</strong>. We'll provide a refund or
                work to resolve the issues promptly. Issues reported after this
                period may not be eligible for refunds.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.3 Exclusions
              </h3>
              <p className="text-gray-700 mb-4">
                The following are generally not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Free plan users (no payment made)</li>
                <li>Enterprise custom plans with special terms</li>
                <li>Add-on services purchased separately</li>
                <li>Cases of abuse or violation of our terms of service</li>
                <li>Partial months or unused portions</li>
                <li>Custom integrations or consulting services</li>
                <li>Requests made more than 3 days after purchase</li>
                <li>
                  General dissatisfaction without specific technical issues
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. How to Request a Refund
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.1 Contact Methods
              </h3>
              <p className="text-gray-700 mb-4">
                To request a refund, please contact us through one of the
                following methods:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Email: support@leaad.co</li>
                <li>
                  Contact form:{" "}
                  <a href="/contact" className="text-blue-600 hover:underline">
                    leaad.co/contact
                  </a>
                </li>
                <li>Live chat: Available during business hours</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.2 Required Information
              </h3>
              <p className="text-gray-700 mb-4">
                Please include the following information in your refund request:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your account email address</li>
                <li>Subscription plan details</li>
                <li>Date of purchase</li>
                <li>
                  Reason for refund (optional but helpful for improvement)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Refund Processing
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mb-3">
                7.1 Processing Time
              </h3>
              <p className="text-gray-700 mb-4">
                Refunds are typically processed within 3-5 business days of
                approval. The time for the refund to appear in your account
                depends on your payment method and financial institution.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                7.2 Refund Method
              </h3>
              <p className="text-gray-700 mb-4">
                Refunds are issued to the original payment method used for the
                purchase. If that method is no longer available, we'll work with
                you to find an alternative refund method.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                7.3 Account Status
              </h3>
              <p className="text-gray-700 mb-4">
                Upon refund approval, your account will be downgraded to the
                free plan or cancelled entirely, depending on your preference.
                You can continue using the free plan features if you choose to
                keep your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Free Trial Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We offer a <strong>3-day free trial</strong> for our Premium
                plan. During the trial period, you can cancel at any time
                without being charged. If you don't cancel before the trial
                ends, your subscription will automatically begin and you'll be
                charged the monthly fee.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Cancel anytime before the deadline</strong> - we won't
                charge you if you cancel during the trial period. This gives you
                plenty of time to test our service and see if it's the right fit
                for your needs.
              </p>
              <p className="text-gray-700">
                Free trial users are not eligible for refunds since no payment
                was made. However, you can cancel anytime during the trial to
                avoid charges.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Service Interruptions
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                9.1 Planned Maintenance
              </h3>
              <p className="text-gray-700 mb-4">
                We schedule maintenance during low-usage hours and provide
                6-hour advance notice for any planned service interruptions.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                9.2 Unplanned Outages
              </h3>
              <p className="text-gray-700 mb-4">
                For unplanned service interruptions exceeding 4 hours, we may
                offer service credits or extend your subscription period at our
                discretion.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                9.3 Force Majeure
              </h3>
              <p className="text-gray-700">
                We are not liable for service interruptions caused by
                circumstances beyond our control, including but not limited to
                natural disasters, government actions, or third-party service
                failures.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Data and Account Management
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                10.1 Data Retention
              </h3>
              <p className="text-gray-700 mb-4">
                We retain your account data for business and legal purposes. If
                you wish to have your data deleted, please contact us at
                support@leaad.co and we will process your request within 30
                days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Customer Support
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                11.1 Support Channels
              </h3>
              <p className="text-gray-700 mb-4">
                We provide customer support through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Email: support@leaad.co</li>
                <li>Help center and documentation</li>
                <li>Educational guides and resources</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                11.2 Response Times
              </h3>
              <p className="text-gray-700 mb-4">
                We aim to respond to support requests within:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>General inquiries: 24 hours</li>
                <li>Technical issues: 4 hours</li>
                <li>Billing questions: 12 hours</li>
                <li>Urgent matters: 2 hours</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Dispute Resolution
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any concerns about our refund policy or if you
                believe you're entitled to a refund outside of our standard
                policy, please contact our customer support team. We're
                committed to resolving any issues fairly and promptly.
              </p>
              <p className="text-gray-700 mb-4">
                For unresolved disputes, we encourage customers to contact us
                directly before pursuing other resolution methods.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                12.1 Informal Resolution
              </h3>
              <p className="text-gray-700 mb-4">
                We encourage customers to contact us directly to resolve any
                issues before pursuing formal dispute resolution.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                12.2 Formal Disputes
              </h3>
              <p className="text-gray-700">
                Any disputes not resolved informally may be submitted to binding
                arbitration in accordance with our Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this policy or need to request a
                refund, please contact us:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@leaad.co
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Contact Form:</strong>{" "}
                  <a href="/contact" className="text-blue-600 hover:underline">
                    leaad.co/contact
                  </a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Response Time:</strong> Within 24 hours during
                  business days
                </p>
                <p className="text-gray-700">
                  <strong>Business Hours:</strong> Monday - Friday, 9:00 AM -
                  6:00 PM EST
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Policy Updates
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this policy from time to time. Any changes will be
                posted on this page with an updated "Last updated" date. We
                encourage you to review this policy periodically.
              </p>
              <p className="text-gray-700">
                For existing customers, material changes to this policy will be
                communicated via email at least 30 days before they take effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. Legal Compliance
              </h2>
              <p className="text-gray-700 mb-4">
                This policy complies with applicable consumer protection laws
                and regulations, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Distance selling regulations</li>
                <li>Consumer rights legislation</li>
                <li>Data protection requirements</li>
                <li>Electronic commerce directives</li>
              </ul>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Need Help?
              </h3>
              <p className="text-blue-800 mb-4">
                If you have any questions about our refund policy or need
                assistance with your account, our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
            </div>

            {/* Legal Navigation */}
            <div className="mt-12 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Other Legal Documents
              </h3>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/legal/terms"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/legal/privacy"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/legal"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  All Legal Documents
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
