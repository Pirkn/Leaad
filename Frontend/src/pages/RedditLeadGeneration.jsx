import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  CheckCircle,
  Link as LinkIcon,
  Zap,
  BarChart3,
  Users,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(1px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45 },
  },
};

export default function RedditLeadGeneration() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Reddit lead generation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Reddit lead generation is the practice of identifying and engaging users who show buying intent inside relevant subreddits, threads, and comments. Leaad analyzes discussions, intent signals, and engagement to surface prospects you can convert.",
        },
      },
      {
        "@type": "Question",
        name: "Is Reddit good for B2B leads?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Technical, founder, and niche communities make Reddit uniquely strong for B2B discovery. Our engine finds problem-aware conversations so you can join with value-first responses.",
        },
      },
      {
        "@type": "Question",
        name: "How fast can I see results?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most users see qualified opportunities within the first day. Expect compounding results over 1–2 weeks as you engage consistently using our templates and karma builder.",
        },
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Run Reddit lead generation",
    step: [
      {
        "@type": "HowToStep",
        name: "Pick subreddits",
        text: "Choose 5–8 communities from your ICP where advice requests are common.",
      },
      {
        "@type": "HowToStep",
        name: "Monitor intent",
        text: "Track phrases like ‘looking for’, ‘recommend a’, ‘alternatives to’.",
      },
      {
        "@type": "HowToStep",
        name: "Engage",
        text: "Reply with problem → framework → example → soft CTA. Disclose affiliation when relevant.",
      },
      {
        "@type": "HowToStep",
        name: "Follow up",
        text: "Return with outcomes, convert with a guide/checklist rather than hard sales pages.",
      },
    ],
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Reddit Lead Generation",
      url: "https://leaad.co/reddit-lead-generation",
      description:
        "A complete guide and toolkit for Reddit lead generation: find buying intent, engage authentically, and convert conversations into customers.",
    },
    howToSchema,
    faqSchema,
  ];

  return (
    <>
      <SEOHead
        title="Reddit Lead Generation – Find Buying Intent and Convert"
        description="Learn how to generate leads on Reddit the right way. Discover intent, engage with value, and convert with AI‑powered workflows."
        keywords="reddit lead generation, reddit marketing, b2b leads reddit, startup lead generation reddit"
        url="https://leaad.co/reddit-lead-generation"
        structuredData={structuredData}
      />
      <div className="min-h-screen bg-white">
        <Navigation />

        {/* Hero */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div variants={container} initial="hidden" animate="visible">
              <motion.p
                className="inline-flex items-center px-3 py-1 mb-4 bg-gray-100 text-gray-700 rounded-full text-sm"
                variants={item}
              >
                <Zap className="w-4 h-4 mr-2" /> Reddit Lead Generation
              </motion.p>
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tighter"
                variants={item}
              >
                Reddit Lead Generation: Playbook and Tools
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 max-w-3xl"
                variants={item}
              >
                Turn conversations into customers. Leaad finds high‑intent
                threads, helps you respond with credibility, and tracks
                outcomes.
              </motion.p>
              <motion.div className="mt-8 flex gap-3" variants={item}>
                <Button
                  onClick={() => (window.location.href = "/signup")}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  Try Leaad Free
                </Button>
                <Link
                  to="/b2b-saas-reddit-lead-generation"
                  className="inline-flex items-center text-gray-700 hover:text-gray-900"
                >
                  <LinkIcon className="w-4 h-4 mr-2" /> B2B SaaS guide
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Set up your workflow */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              Set up your workflow in 20 minutes
            </h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Choose your arenas",
                  text: "Pick 5–8 subreddits from the curated list. Read rules. Save weekly ‘Help/Question’ threads to a doc.",
                },
                {
                  title: "Define 3 positioning angles",
                  text: "Example: save time, replace spreadsheets, avoid risk. Each reply should support one angle with evidence.",
                },
                {
                  title: "Create a soft asset",
                  text: "Spin up a 1–2 page guide/checklist hosted on your site. Link this instead of pricing to keep replies helpful.",
                },
              ].map((b) => (
                <div
                  key={b.title}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900">{b.title}</h3>
                  <p className="text-gray-600 mt-2">{b.text}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-6">
              Not sure where to start? Use the{" "}
              <Link
                to="/best-subreddits-for-lead-generation"
                className="underline text-gray-900"
              >
                subreddit list
              </Link>
              , learn to spot{" "}
              <Link
                to="/reddit-buying-intent-guide"
                className="underline text-gray-900"
              >
                buying intent
              </Link>
              , and copy a reply from the{" "}
              <Link
                to="/reddit-reply-templates"
                className="underline text-gray-900"
              >
                templates
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Do's and Don'ts */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              Do's and Don'ts
            </h2>
            <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900">Do</h3>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li>• Answer fully before mentioning your product</li>
                  <li>• Disclose affiliation briefly when relevant</li>
                  <li>• Link to guides/checklists; avoid hard selling</li>
                  <li>• Return with updates and outcomes</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900">Don't</h3>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li>• Copy‑paste identical replies across threads</li>
                  <li>• Drop links without context</li>
                  <li>• Argue with moderators—follow rules</li>
                  <li>• DM unsolicited; keep value in‑thread</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              Metrics to track
            </h2>
            <ul className="mt-4 grid md:grid-cols-3 gap-3 text-gray-700 text-sm">
              <li>• Replies and upvotes per thread</li>
              <li>• Profile visits and clicks to soft asset</li>
              <li>• Email captures/trials from the asset</li>
              <li>• Time‑to‑first‑reply on high‑intent threads</li>
              <li>• Subreddit acceptance (removals should trend to 0)</li>
              <li>• Angle effectiveness (which framing gets responses)</li>
            </ul>
          </div>
        </section>

        {/* Why Reddit */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Communities with buying intent",
                  text: "Niche subreddits concentrate decision‑makers and practitioners. We detect phrases that indicate projects, budgets, and timelines.",
                },
                {
                  icon: MessageSquare,
                  title: "Authentic, not ads",
                  text: "Helpful answers outperform cold outreach. Our templates keep replies natural while communicating value.",
                },
                {
                  icon: BarChart3,
                  title: "Measurable outcomes",
                  text: "Track replies, clicks, and conversions. Learn which angles work and scale them across threads.",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <b.icon className="w-6 h-6 text-gray-900" />
                  <h3 className="mt-4 font-semibold text-gray-900">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Playbook */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              The 4‑step Reddit lead gen playbook
            </h2>
            <div className="mt-8 grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Find buying signals",
                  text: "We monitor phrases like ‘looking for’, ‘how do you choose’, ‘recommend a tool’, and surface the exact threads where people need you.",
                },
                {
                  title: "Earn credibility",
                  text: "Use Karma Builder to participate genuinely. Share experience first, mention your product only when clearly relevant.",
                },
                {
                  title: "Respond with value",
                  text: "Start with the problem, add a 3‑step outline, then a light CTA. Our templates adapt to the subreddit’s tone.",
                },
                {
                  title: "Convert off‑platform",
                  text: "Link to a guide, checklist, or case study—not a hard sell. Capture emails with a soft value exchange.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.title}</h3>
                      <p className="text-gray-600 mt-1">{s.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-gray-600">
              New to Reddit for B2B? Read our{" "}
              <Link
                to="/b2b-saas-reddit-lead-generation"
                className="text-gray-900 underline"
              >
                B2B SaaS guide
              </Link>{" "}
              or the
              <Link
                to="/startup-reddit-lead-generation"
                className="text-gray-900 underline ml-1"
              >
                Startup guide
              </Link>{" "}
              for industry‑specific tips.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tighter">
              Reddit vs other channels
            </h2>
            <div className="mt-6 grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900">Cold email</h3>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li>• Large volume but low intent</li>
                  <li>• Risk of spam filtering</li>
                  <li>• Works best with Reddit‑derived insights</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900">
                  LinkedIn outreach
                </h3>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li>• Profile credibility heavy</li>
                  <li>• Algorithm limits reach</li>
                  <li>• Strong when paired with Reddit proof</li>
                </ul>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900">
                  Reddit with Leaad
                </h3>
                <ul className="mt-3 space-y-2 text-gray-600">
                  <li>• Live intent from real discussions</li>
                  <li>• Value‑led engagement, not spam</li>
                  <li>• Compounding credibility via karma</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tighter">
              FAQs
            </h2>
            <div className="mt-6 space-y-6">
              {[
                {
                  q: "What subreddits should I target?",
                  a: "Focus on communities where your users seek advice. Look for weekly ‘Help’ or ‘Showcase’ threads and problem‑oriented posts rather than broad promo subs.",
                },
                {
                  q: "How do I avoid being flagged?",
                  a: "Add value first. Answer the question fully, disclose affiliation when relevant, and avoid repetitive links. Build karma steadily using our helper.",
                },
                {
                  q: "How do I measure success?",
                  a: "Track replies, profile visits, clicks to soft assets (guides/checklists), and downstream signups. Expect compounding effects week over week.",
                },
              ].map((f) => (
                <div key={f.q} className="border-b border-gray-200 pb-4">
                  <p className="font-medium text-gray-900">{f.q}</p>
                  <p className="text-gray-600 mt-1">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tighter">
              Start finding leads today
            </h2>
            <p className="mt-3 text-gray-600">
              Join relevant conversations with confidence—no spam, just value.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => (window.location.href = "/signup")}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Get started free
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
