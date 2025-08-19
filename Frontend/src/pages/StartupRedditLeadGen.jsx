import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function StartupRedditLeadGen() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How should startups start on Reddit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start with problem‑solving posts and comments. Share learnings, show your work, and only link to assets that add value (guides, checklists).",
        },
      },
      {
        "@type": "Question",
        name: "Which metrics matter early?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Replies, saves, profile visits, and email captures from soft assets. Don’t optimize for karma alone—optimize for signal and relationships.",
        },
      },
    ],
  };
  const roadmap = [
    {
      title: "Week 1: Earn presence",
      text: "Comment daily in 2–3 threads with useful answers. No links for 3–4 days. Track objections you see repeatedly.",
    },
    {
      title: "Week 2: Soft assets",
      text: "Publish a 1–2 page checklist or mini guide that solves the common objection. Link that when truly relevant.",
    },
    {
      title: "Week 3: Systemize",
      text: "Create a quick list of search queries and subreddits to check each morning. Reuse our reply templates with edits.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Startup Reddit Lead Generation – From Zero to First Users"
        description="A tactical guide for startups to get first users from Reddit. Find intent, participate credibly, and convert via value‑led funnels."
        keywords="startup reddit lead generation, early users reddit, find first users reddit"
        url="https://leaad.co/startup-reddit-lead-generation"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Startup Reddit Lead Generation",
            url: "https://leaad.co/startup-reddit-lead-generation",
          },
          faqSchema,
        ]}
      />
      <div className="min-h-screen bg-white">
        <Navigation />

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-6">
              Startup Reddit Lead Generation
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Ship in public, learn in public, sell by helping. This guide shows
              how to earn attention and convert without burning your reputation.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => (window.location.href = "/signup")}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Get started free
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              First‑user tactics
            </h2>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li>
                • Weekly progress posts with a real lesson and a lightweight CTA
              </li>
              <li>• Answer troubleshooting threads in your problem space</li>
              <li>• Share a free template or checklist and capture emails</li>
              <li>• Collect objections and turn them into mini case studies</li>
            </ul>
            <p className="mt-8 text-gray-600">
              See the{" "}
              <Link
                to="/reddit-lead-generation"
                className="underline text-gray-900"
              >
                core Reddit lead gen guide
              </Link>{" "}
              for fundamentals.
            </p>
            <div className="mt-10 bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900">3‑week ramp plan</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-3">
                {roadmap.map((r) => (
                  <div
                    key={r.title}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <p className="font-medium text-gray-900">{r.title}</p>
                    <p className="text-gray-600 text-sm mt-1">{r.text}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-4">
                Need ready‑to‑use copy? See the{" "}
                <Link
                  to="/reddit-reply-templates"
                  className="underline text-gray-900"
                >
                  reply templates
                </Link>{" "}
                and the{" "}
                <Link
                  to="/best-subreddits-for-lead-generation"
                  className="underline text-gray-900"
                >
                  subreddit list
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tighter">
              Earn trust, then ask
            </h2>
            <p className="mt-2 text-gray-600">
              Leaad helps you find conversations and reply with context that
              converts.
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
