import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function RedditBuyingIntentGuide() {
  const examples = [
    {
      label: "Tool requests",
      phrases: [
        "What do you use for…",
        "Any recommendations for…",
        "How do you manage …",
      ],
      action:
        "Share a short decision framework and a checklist. If relevant, disclose and link to a guide—never to pricing first.",
    },
    {
      label: "Migration intent",
      phrases: [
        "Alternatives to <vendor>",
        "Moving away from <vendor>",
        "Bad experience with <vendor>",
      ],
      action:
        "Provide a 3‑step migration outline, pitfalls, and a links list. Offer a template or script if you have one.",
    },
    {
      label: "Budget/timeline",
      phrases: [
        "Looking for a solution in <month>",
        "We have budget for …",
        "RFP / evaluation",
      ],
      action:
        "Ask clarifying questions publicly, then invite a DM only if they prompt it. Keep value in the thread.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I respond without sounding salesy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use ‘problem → framework → example → optional CTA’. Disclose affiliation briefly when relevant and keep links educational.",
        },
      },
      {
        "@type": "Question",
        name: "Should I DM prospects from threads?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only if they invite it or ask for details. Otherwise keep the conversation public and helpful. You’ll earn profile visits naturally.",
        },
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Find buying intent on Reddit",
    step: [
      {
        "@type": "HowToStep",
        name: "Search",
        text: "Use site:reddit.com with phrases like ‘looking for’, ‘recommend a’, ‘alternatives to’.",
      },
      {
        "@type": "HowToStep",
        name: "Qualify",
        text: "Scan for budget/timeline language and decision context. Save threads to a list.",
      },
      {
        "@type": "HowToStep",
        name: "Respond",
        text: "Answer with a concise framework and example. Link to a non‑sales guide.",
      },
      {
        "@type": "HowToStep",
        name: "Follow up",
        text: "Return with updates or outcomes; build credibility over time.",
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Reddit Buying Intent Signals – How to Spot and Act"
        description="A practical guide to spotting buying intent on Reddit: phrases, thread patterns, examples, and reply frameworks."
        keywords="reddit buying intent, lead signals reddit, find buyers on reddit"
        url="https://leaad.co/reddit-buying-intent-guide"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Reddit Buying Intent Guide",
            url: "https://leaad.co/reddit-buying-intent-guide",
          },
          howToSchema,
          faqSchema,
        ]}
      />
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-4">
              Reddit Buying Intent Signals
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Learn to identify signals that someone is actively evaluating or
              ready to switch. Pair this with our
              <Link
                to="/reddit-reply-templates"
                className="underline text-gray-900 ml-1"
              >
                reply templates
              </Link>{" "}
              to convert without spam.
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {examples.map((ex) => (
                <div
                  key={ex.label}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900">{ex.label}</h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    Sayings to watch for:
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-700 text-sm">
                    {ex.phrases.map((p) => (
                      <li key={p}>• {p}</li>
                    ))}
                  </ul>
                  <p className="text-gray-600 mt-3 text-sm">
                    Action: {ex.action}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tighter">
                Copy‑paste search queries
              </h2>
              <ul className="mt-3 grid md:grid-cols-2 gap-2 text-gray-700">
                {[
                  'site:reddit.com \\"looking for\\" <category>',
                  'site:reddit.com \\"recommend a\\" <tool>',
                  'site:reddit.com \\"alternatives to\\" <vendor>',
                  'site:reddit.com \\"migrate from\\" <vendor>',
                ].map((q) => (
                  <li key={q}>• {q}</li>
                ))}
              </ul>
              <p className="text-gray-600 mt-4">
                Next, choose subreddits from the{" "}
                <Link
                  to="/best-subreddits-for-lead-generation"
                  className="underline text-gray-900"
                >
                  curated list
                </Link>{" "}
                and use the{" "}
                <Link
                  to="/reddit-lead-generation"
                  className="underline text-gray-900"
                >
                  full lead gen playbook
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
