import SEOHead from "../components/SEOHead";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Guide() {
  const guides = [
    {
      title: "Reddit Lead Generation",
      description:
        "Playbook and tools to find buying intent and convert conversations into customers.",
      to: "/reddit-lead-generation",
    },
    {
      title: "B2B SaaS Reddit Guide",
      description:
        "A focused strategy for B2B teams: frameworks, positioning angles, and KPIs.",
      to: "/b2b-saas-reddit-lead-generation",
    },
    {
      title: "Startup Reddit Guide",
      description:
        "From zero to first users: earn trust, share progress, and convert without spam.",
      to: "/startup-reddit-lead-generation",
    },
    {
      title: "Best Subreddits for Lead Generation",
      description:
        "Curated communities across B2B, SaaS, and startups with real buying intent.",
      to: "/best-subreddits-for-lead-generation",
    },
    {
      title: "Reddit Buying Intent Signals",
      description:
        "Patterns, phrases, and examples to spot prospects in live discussions.",
      to: "/reddit-buying-intent-guide",
    },
    {
      title: "Reddit Reply Templates",
      description:
        "Authentic, value‑led replies that convert—adaptable by subreddit and tone.",
      to: "/reddit-reply-templates",
    },
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: guides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: `https://leaad.co${g.to}`,
    })),
  };

  return (
    <>
      <SEOHead
        title="Guide – Reddit Lead Generation Resources"
        description="All Leaad guides in one place: Reddit lead generation, B2B SaaS tactics, and startup playbooks."
        keywords="reddit lead generation guide, b2b saas reddit guide, startup reddit guide"
        url="https://leaad.co/guide"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Leaad Guides",
            url: "https://leaad.co/guide",
          },
          itemListSchema,
        ]}
      />
      <div className="min-h-screen bg-white">
        <Navigation />

        <section className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter mb-4">
              Guides
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Practical, no‑fluff playbooks for generating leads on Reddit
              without spam.
            </p>

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {guides.map((g) => (
                <Link
                  to={g.to}
                  key={g.to}
                  className="block border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-colors bg-white"
                >
                  <h3 className="font-semibold text-gray-900">{g.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{g.description}</p>
                  <span className="mt-4 inline-block text-gray-900 underline text-sm">
                    Read guide
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
