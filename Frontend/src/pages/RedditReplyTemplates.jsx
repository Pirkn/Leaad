import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function RedditReplyTemplates() {
  const templates = [
    {
      title: "Framework first (B2B)",
      useWhen: "The OP asks for recommendations or selection criteria.",
      body: "Quick framework that works well: (1) define must‑haves, (2) check integration depth, (3) validate migration path. If you want a 2‑page checklist we use with clients, I can share it. Disclosure: I build in this space—happy to point you to neutral resources too.",
    },
    {
      title: "Migration outline",
      useWhen: "They mention switching away from a vendor.",
      body: "We migrated a few teams recently. 3 things to watch: (1) export limits and data parity, (2) auth/SSO mapping, (3) downtime fallback. Here’s a barebones plan we used. If helpful, I can share a checklist. (Disclosure: I work on a tool in this category.)",
    },
    {
      title: "Startup tone (helpful + humble)",
      useWhen: "Smaller subreddits or founder communities.",
      body: "We’ve built X to solve Y after struggling with it ourselves. Happy to share what worked for us (and what didn’t). If it’s useful, here’s a short guide we wrote with steps and trade‑offs. No hard sell.",
    },
    {
      title: "Evidence‑led answer",
      useWhen: "Skeptical thread where proof matters.",
      body: "Sharing numbers since that’s most useful: after switching to <approach>, we cut <metric> by <value>% over <time>. The key wasn’t <tool>, it was <process change>. If you want, I can share the exact sheet we used to track this.",
    },
    {
      title: "Neutral alternatives (with disclosure)",
      useWhen:
        "Someone asks for vendor alternatives and you have a product in the space.",
      body: "A few solid options: <Alt A> (best for <use case>), <Alt B> (strong integrations), <Alt C> (budget). Disclosure: I work on <Your Tool>—good fit when <condition>. Happy to point to other choices if those fit better.",
    },
    {
      title: "Pricing objection",
      useWhen: "They say ‘too expensive’.",
      body: "Totally fair pushback. We see price make sense when (1) it replaces <legacy costs>, (2) hours saved per week > <threshold>, (3) team avoids <risk>. Here’s a quick ROI calc you can copy to sanity‑check it.",
    },
    {
      title: "Security/compliance angle",
      useWhen: "Concern about data handling or regulations.",
      body: "Key things to verify regardless of vendor: data residency, breach process, audit logs, SSO/SCIM, and least‑privilege roles. If you need a checklist for SOC2/GDPR mapping, I can share a blank copy.",
    },
    {
      title: "Integration troubleshooting",
      useWhen: "They’re stuck connecting tools.",
      body: "3 quick checks that fix 80% of cases: (1) scope/permissions mismatch, (2) webhook secret/URL drift, (3) pagination/limits not handled. If you share the error snippet I can suggest the exact fix.",
    },
    {
      title: "Quick diagnostic (no hard sell)",
      useWhen: "You want to help fast without pushing product.",
      body: "If you post one screenshot of <screen> and the log line around <error>, I can tell you whether it’s config, rate limits, or data shape. If it’s the latter, I’ll paste a small transform that usually fixes it.",
    },
    {
      title: "Open‑source vs hosted",
      useWhen: "They’re deciding between self‑host and SaaS.",
      body: "Rule of thumb we use: pick OSS when you need control/customization and have ops bandwidth; pick hosted when you need speed, SLAs, and fewer moving parts. Here’s a simple decision table you can copy.",
    },
    {
      title: "Case‑study mini reply",
      useWhen: "Anecdote would help the thread.",
      body: "We ran this for <company type>: starting point <metric>, bottleneck was <issue>. We changed <two levers> and hit <outcome> in <time>. Happy to share the exact steps if useful; we wrote them up as a short walkthrough.",
    },
    {
      title: "Community resources roundup",
      useWhen: "OP asks for ‘best resources’ or ‘where to learn’.",
      body: "Bookmark‑worthy links: <resource 1> (foundational), <resource 2> (advanced), <resource 3> (checklist). I also like <subreddit thread> updated weekly. If you want a printable version I can paste it.",
    },
    {
      title: "Feature request empathy",
      useWhen: "User asks for a feature you don’t have yet.",
      body: "Great idea—we’ve heard this from <count> teams. Two workarounds we’ve seen: <workaround 1>, <workaround 2>. We track requests publicly; if you want I’ll add your use case so you get notified when it ships.",
    },
    {
      title: "Results but no pitch",
      useWhen: "You want to share a win without sounding promotional.",
      body: "We recently helped a team move from <A> to <B>. The non‑obvious win was <insight>. If anyone is evaluating similar, I can share the migration checklist and the one pitfall that bit us.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do I need to disclose affiliation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When your product is relevant, a short disclosure builds trust and prevents removals. Keep it brief and value‑first.",
        },
      },
      {
        "@type": "Question",
        name: "Can I paste the same reply across threads?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Avoid repetitive replies; tailor to the question and subreddit tone. Reuse structure, not identical wording.",
        },
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Reddit Reply Templates for Lead Generation"
        description="Ready-to-adapt reply templates for Reddit that stay authentic and convert."
        keywords="reddit reply templates, reddit lead gen templates, reddit comment templates"
        url="https://leaad.co/reddit-reply-templates"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Reddit Reply Templates",
            url: "https://leaad.co/reddit-reply-templates",
          },
          faqSchema,
        ]}
      />
      <div className="min-h-screen bg-white">
        <Navigation />
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-4">
              Reddit Reply Templates
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Use these structures to answer helpfully and credibly. Pair with
              the{" "}
              <Link
                to="/reddit-buying-intent-guide"
                className="underline text-gray-900 ml-1"
              >
                intent guide
              </Link>{" "}
              and our{" "}
              <Link
                to="/best-subreddits-for-lead-generation"
                className="underline text-gray-900 ml-1"
              >
                subreddit list
              </Link>
              .
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {templates.map((t) => (
                <div
                  key={t.title}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900">{t.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Use when: {t.useWhen}
                  </p>
                  <p className="text-gray-700 text-sm mt-3 whitespace-pre-line">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}
