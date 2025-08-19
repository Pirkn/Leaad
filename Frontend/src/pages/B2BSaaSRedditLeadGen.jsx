import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function B2BSaaSRedditLeadGen() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Reddit work for B2B SaaS?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Technical buyers and founders use Reddit to evaluate tools. Leaad surfaces problem‑aware conversations and helps you contribute value‑first answers.",
        },
      },
      {
        "@type": "Question",
        name: "What KPIs should I track?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Conversation replies, profile clicks, traffic to educational assets, demo requests, and trial signups. Expect compounding results after 2–3 weeks.",
        },
      },
    ],
  };
  const checklist = [
    {
      title: "ICP and subreddits",
      text: "Write a one‑liner ICP. Map 5–8 subreddits where they ask for help (from our curated list).",
    },
    {
      title: "Angles and proof",
      text: "Pick 3 angles: save time, reduce risk, replace spreadsheets. Collect one metric or mini case study for each.",
    },
    {
      title: "Soft assets",
      text: "Publish a 2‑page ‘how‑to’ or checklist for each angle. Link those from replies instead of pricing pages.",
    },
  ];

  return (
    <>
      <SEOHead
        title="B2B SaaS Reddit Lead Generation – Practical Guide"
        description="A focused playbook for B2B SaaS teams to generate leads on Reddit without spam. Find intent, contribute expertise, and convert to demos and trials."
        keywords="b2b saas reddit lead generation, reddit b2b leads, saas lead gen reddit"
        url="https://leaad.co/b2b-saas-reddit-lead-generation"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "B2B SaaS Reddit Lead Generation",
            url: "https://leaad.co/b2b-saas-reddit-lead-generation",
          },
          faqSchema,
        ]}
      />
      <div className="min-h-screen bg-white">
        <Navigation />

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-6">
              B2B SaaS Reddit Lead Generation
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Capture real buying intent in technical and founder communities.
              Use this playbook to stand out with credible, helpful answers that
              earn replies and demos.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => (window.location.href = "/signup")}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Start free
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              What works for B2B on Reddit
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {[
                "Answer with frameworks, not features",
                "Back claims with screenshots and numbers",
                "Link to deep dives, not pricing pages",
                "Tailor tone to each subreddit",
              ].map((tip) => (
                <div
                  key={tip}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <p className="text-gray-700">{tip}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900">30‑minute setup</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-3">
                {checklist.map((c) => (
                  <div
                    key={c.title}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <p className="font-medium text-gray-900">{c.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{c.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-4">
                New to selecting arenas? Start with the{" "}
                <Link
                  to="/best-subreddits-for-lead-generation"
                  className="underline text-gray-900"
                >
                  subreddit list
                </Link>{" "}
                and learn to spot{" "}
                <Link
                  to="/reddit-buying-intent-guide"
                  className="underline text-gray-900"
                >
                  buying intent
                </Link>
                .
              </p>
            </div>
            <p className="mt-8 text-gray-600">
              Need the fundamentals first? Read the{" "}
              <Link
                to="/reddit-lead-generation"
                className="underline text-gray-900"
              >
                Reddit lead generation guide
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              Positioning angles that convert
            </h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm text-gray-700">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <b>Replace spreadsheet workflow</b>
                <p className="mt-2">Show a 3‑step before/after with a GIF.</p>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <b>Quantify time/cost saved</b>
                <p className="mt-2">
                  Use numbers from customer anecdotes or pilots.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
                <b>Integrates with stack</b>
                <p className="mt-2">
                  Call out native integrations and copy‑paste snippets.
                </p>
              </div>
            </div>
            <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900">Reply pattern</h3>
              <ol className="list-decimal ml-5 text-gray-700 text-sm mt-2 space-y-1">
                <li>Restate the problem in your words</li>
                <li>Give a 3‑step framework specific to their context</li>
                <li>Add one number or example</li>
                <li>Soft CTA to a short guide/checklist</li>
                <li>Optional disclosure, one line</li>
              </ol>
              <p className="text-gray-600 text-sm mt-3">
                Copy a structure from the{" "}
                <Link
                  to="/reddit-reply-templates"
                  className="underline text-gray-900"
                >
                  reply templates
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tighter">
              Turn threads into demos
            </h2>
            <p className="mt-2 text-gray-600">
              Use Leaad to find intent, craft replies, and route to trials.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => (window.location.href = "/signup")}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Try Leaad free
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
