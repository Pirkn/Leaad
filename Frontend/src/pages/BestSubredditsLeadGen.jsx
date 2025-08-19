import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function BestSubredditsLeadGen() {
  const categories = [
    {
      name: "B2B / SaaS",
      subs: [
        {
          name: "r/SaaS",
          reason: "Founders and PMs evaluating tools and growth tactics.",
        },
        {
          name: "r/Entrepreneur",
          reason: "High‑volume problems, tool requests, and case studies.",
        },
        {
          name: "r/startups",
          reason: "Buying intent around early‑stage stacks and workflows.",
        },
        {
          name: "r/sales",
          reason: "Practitioner questions and tool comparisons.",
        },
      ],
    },
    {
      name: "Marketing / Growth",
      subs: [
        {
          name: "r/marketing",
          reason: "Strategy and channel questions with budget context.",
        },
        {
          name: "r/SEO",
          reason: "Tool selection, audits, and vendor comparisons.",
        },
        {
          name: "r/PPC",
          reason: "Hands‑on practitioners seeking fixes and frameworks.",
        },
        {
          name: "r/bigseo",
          reason: "Advanced discussions where numbers matter.",
        },
      ],
    },
    {
      name: "Product / UX / Data",
      subs: [
        {
          name: "r/productmanagement",
          reason: "Prioritization and tool chain decisions.",
        },
        {
          name: "r/userexperience",
          reason: "Research and testing workflows; template demand.",
        },
        {
          name: "r/datascience",
          reason: "Evaluation of pipelines, notebooks, and MLOps tools.",
        },
        {
          name: "r/analytics",
          reason: "Implementation questions and vendor switching.",
        },
      ],
    },
    {
      name: "Engineering / DevTools",
      subs: [
        { name: "r/devops", reason: "CI/CD, monitoring, and cost trade‑offs." },
        { name: "r/webdev", reason: "Framework debates and DX preferences." },
        {
          name: "r/selfhosted",
          reason: "Open‑source alternatives and migration intent.",
        },
        {
          name: "r/reactjs",
          reason: "Libraries, hosting, and performance issues.",
        },
      ],
    },
    {
      name: "Vertical / Niche",
      subs: [
        {
          name: "r/ecommerce",
          reason: "Stack selection, conversion issues, and integrations.",
        },
        {
          name: "r/legaladvice",
          reason:
            "Demand for compliant tools and services (give info not pitches).",
        },
        {
          name: "r/healthIT",
          reason: "HIPAA/PHI constraints create clear buying criteria.",
        },
        {
          name: "r/fintech",
          reason: "Risk, fraud, and reporting questions drive urgency.",
        },
      ],
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I avoid getting flagged when posting?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contribute helpful answers first, disclose affiliation when relevant, follow each subreddit’s rules, and avoid repetitive links. Share guides or checklists instead of pricing pages.",
        },
      },
      {
        "@type": "Question",
        name: "What makes a subreddit good for lead generation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "High signal of problems, repeat ‘which tool’ comparisons, and active moderation that keeps spam out. Look for weekly question threads and niche workflows.",
        },
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories
      .flatMap((c) => c.subs)
      .map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name })),
  };

  return (
    <>
      <SEOHead
        title="Best Subreddits for Lead Generation – Curated List"
        description="A practical list of subreddits where buyers ask for help. Grouped by B2B, marketing, product, devtools, and niche verticals."
        keywords="best subreddits for lead generation, reddit b2b leads, saas subreddits, startup subreddits"
        url="https://leaad.co/best-subreddits-for-lead-generation"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Best Subreddits for Lead Generation",
            url: "https://leaad.co/best-subreddits-for-lead-generation",
          },
          itemListSchema,
          faqSchema,
        ]}
      />
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-4">
              Best Subreddits for Lead Generation
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Use this list to find communities with real buying intent. Start
              by reading rules, contribute answers, and link to value‑first
              guides. Learn how to spot intent in our{" "}
              <Link
                to="/reddit-buying-intent-guide"
                className="underline text-gray-900"
              >
                intent guide
              </Link>{" "}
              and respond with{" "}
              <Link
                to="/reddit-reply-templates"
                className="underline text-gray-900"
              >
                proven templates
              </Link>
              .
            </p>
            <div className="mt-10 grid md:grid-cols-2 gap-8">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <ul className="mt-4 space-y-3">
                    {cat.subs.map((s) => (
                      <li key={s.name} className="text-gray-700">
                        <span className="font-medium text-gray-900">
                          {s.name}
                        </span>
                        <span className="text-gray-500"> — {s.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tighter">
                Search queries that surface buyers
              </h2>
              <p className="text-gray-600 mt-2">Use Reddit search like this:</p>
              <ul className="mt-4 grid md:grid-cols-2 gap-2 text-gray-700">
                {[
                  'site:reddit.com "looking for" <your tool category>',
                  'site:reddit.com "recommend a" <tool>',
                  'site:reddit.com "how do you choose" <tool>',
                  'site:reddit.com "alternatives to" <vendor>',
                  'site:reddit.com "migrate from" <vendor>',
                  'site:reddit.com "compare" <vendor 1> <vendor 2>',
                ].map((q) => (
                  <li key={q}>• {q}</li>
                ))}
              </ul>
              <p className="text-gray-600 mt-4">
                Next, read the{" "}
                <Link
                  to="/reddit-lead-generation"
                  className="underline text-gray-900"
                >
                  Reddit lead generation guide
                </Link>{" "}
                for a step‑by‑step workflow.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
