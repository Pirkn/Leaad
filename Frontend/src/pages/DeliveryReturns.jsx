import React from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const DeliveryReturns = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Delivery & Returns Policy - Leaad",
    description:
      "Delivery terms, return policy, and refund information for Leaad AI-powered Reddit lead generation platform",
    url: "https://leaad.co/delivery-returns",
    mainEntity: {
      "@type": "Article",
      name: "Delivery & Returns Policy",
      author: {
        "@type": "Organization",
        name: "Leaad",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Delivery & Returns Policy - Leaad | Refund & Cancellation Terms"
        description="Learn about Leaad's delivery terms, return policy, refund conditions, and cancellation procedures for our AI-powered platform services."
        keywords="delivery policy, return policy, refund policy, cancellation terms, Leaad delivery, service terms"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Delivery & Returns Policy
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
                4. Refund Policy
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                4.1 Refund Policy
              </h3>
              <p className="text-gray-700 mb-4">
                Refunds are provided at our discretion based on individual
                circumstances and service usage.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                4.2 Refund Eligibility
              </h3>
              <p className="text-gray-700 mb-4">
                Refunds may be available for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Billing errors or duplicate charges</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                4.3 Non-Refundable Items
              </h3>
              <p className="text-gray-700 mb-4">
                The following are not eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Partial months or unused portions</li>
                <li>Add-on services or premium features</li>
                <li>Custom integrations or consulting services</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                4.4 Refund Process
              </h3>
              <p className="text-gray-700">
                Refund requests are processed within 5-7 business days. Refunds
                are issued to the original payment method used for the
                transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Service Interruptions
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.1 Planned Maintenance
              </h3>
              <p className="text-gray-700 mb-4">
                We schedule maintenance during low-usage hours and provide
                6-hour advance notice for any planned service interruptions.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.2 Unplanned Outages
              </h3>
              <p className="text-gray-700 mb-4">
                For unplanned service interruptions exceeding 4 hours, we may
                offer service credits or extend your subscription period at our
                discretion.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                5.3 Force Majeure
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
                6. Data and Account Management
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                6.1 Data Retention
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
                7. Customer Support
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                7.1 Support Channels
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
                7.2 Response Times
              </h3>
              <p className="text-gray-700 mb-4">
                We aim to respond to support requests within:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>General inquiries: 24 hours</li>
                <li>Technical issues: 4 hours</li>
                <li>Billing questions: 12 hours</li>
                <li>Urgent matters: 2 hours</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Dispute Resolution
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                8.1 Informal Resolution
              </h3>
              <p className="text-gray-700 mb-4">
                We encourage customers to contact us directly to resolve any
                issues before pursuing formal dispute resolution.
              </p>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                8.2 Formal Disputes
              </h3>
              <p className="text-gray-700">
                Any disputes not resolved informally may be submitted to binding
                arbitration in accordance with our Terms of Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Changes to Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify this policy at any time. Changes
                will be effective immediately upon posting on our website.
              </p>
              <p className="text-gray-700">
                Material changes will be communicated via email at least 30 days
                before implementation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                For questions about delivery, returns, or this policy, please
                contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Customer Support:</strong> support@leaad.co
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Legal Compliance
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
                to="/terms"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Terms of Service
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

export default DeliveryReturns;
