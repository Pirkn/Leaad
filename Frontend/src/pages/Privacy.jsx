import React from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const Privacy = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy - Leaad",
    description:
      "Privacy policy and data protection information for Leaad AI-powered Reddit lead generation platform",
    url: "https://leaad.co/privacy",
    mainEntity: {
      "@type": "Article",
      name: "Privacy Policy",
      author: {
        "@type": "Organization",
        name: "Leaad",
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Privacy Policy - Leaad | Data Protection & Privacy"
        description="Learn about how Leaad collects, uses, and protects your personal information. Read our comprehensive privacy policy for data protection compliance."
        keywords="privacy policy, data protection, GDPR, personal data, Leaad privacy"
        structuredData={structuredData}
      />

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          {/* Company Information Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              Company Information
            </h2>
            <p className="text-blue-800 mb-2">
              <strong>Company Name:</strong> ESİLAH AV MALZEMELERİ
            </p>
            <p className="text-blue-800">
              Leaad is a digital platform and brand operated by ESİLAH AV
              MALZEMELERİ, providing AI-powered Reddit lead generation services
              to businesses and entrepreneurs worldwide.
            </p>
          </div>

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
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Leaad ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                AI-powered Reddit lead generation platform.
              </p>
              <p className="text-gray-700">
                By using our service, you agree to the collection and use of
                information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.1 Personal Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Name and email address</li>
                <li>Company information</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.2 Usage Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Platform usage data</li>
                <li>Feature interactions</li>
                <li>Performance metrics</li>
                <li>Error logs</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mb-3">
                2.3 Technical Information
              </h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Provide and maintain our services</li>
                <li>Send service-related communications</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Access and review your data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your
                experience, analyze usage, and provide personalized content.
              </p>
              <p className="text-gray-700">
                You can control cookie settings through your browser
                preferences, though disabling certain cookies may affect
                platform functionality.
              </p>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  7.1 Types of Cookies We Use
                </h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>
                    Essential cookies (session-based) needed for sign-in,
                    security, and core features
                  </li>
                  <li className="text-gray-700">
                    Cookies may be session (deleted when you close your browser)
                    or persistent (stored until they expire or you delete them).
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                Our platform may integrate with third-party services (e.g.,
                payment processors, analytics tools). These services have their
                own privacy policies, and we are not responsible for their
                practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Data Retention
              </h2>
              <p className="text-gray-700">
                We retain your personal information only as long as necessary to
                provide our services, comply with legal obligations, resolve
                disputes, and enforce agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data during such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our services are not intended for individuals under 18 years of
                age. We do not knowingly collect personal information from
                children under 18. If you believe a minor has provided us with
                information, please contact us so we can take appropriate
                action.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Changes to This Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date.
              </p>
              <p className="text-gray-700">
                Your continued use of our services after any changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                16. Delete Your Personal Information
              </h2>
              <p className="text-gray-700 mb-4">
                You can request deletion of your personal information. We may
                retain limited data where necessary to comply with legal
                obligations, enforce agreements, or resolve disputes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                17. Disclosures Required by Law
              </h2>
              <p className="text-gray-700 mb-4">
                We may disclose information when required to comply with
                applicable laws, lawful requests, or legal processes; to protect
                the rights, property, or safety of Leaad, our users, or the
                public; to prevent fraud or abuse; and in connection with a
                merger, acquisition, financing, or sale of assets where user
                information may be transferred as part of the transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                18. Links to Other Websites
              </h2>
              <p className="text-gray-700">
                Our services may include links to third‑party sites. We are not
                responsible for their content or privacy practices. We encourage
                you to review the privacy policies of those websites you visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> support@leaad.co
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Legal Basis for Processing (EU Users)
              </h2>
              <p className="text-gray-700 mb-4">
                For users in the European Union, our legal basis for processing
                personal information includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Contract performance</li>
                <li>Legitimate business interests</li>
                <li>Legal obligations</li>
                <li>Your consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                15. California Privacy Rights (CCPA)
              </h2>
              <p className="text-gray-700 mb-4">
                California residents have additional rights under the California
                Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising CCPA rights</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8">
            <div className="flex flex-wrap gap-4">
              <Link
                to="/legal/terms"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Terms of Service
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
