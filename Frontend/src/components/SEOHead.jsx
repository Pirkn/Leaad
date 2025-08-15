import { Helmet } from "react-helmet-async";

const SEOHead = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  structuredData,
}) => {
  const defaultTitle =
    "Leaad - AI-Powered Reddit Lead Generation for SaaS & Startups";
  const defaultDescription =
    "Generate qualified leads from Reddit with AI. Find people actively seeking solutions like yours, get personalized comments, and convert Reddit discussions into customers.";
  const defaultKeywords =
    "reddit lead generation, SaaS marketing, startup marketing, AI lead generation, reddit marketing, B2B leads, product marketing, customer acquisition";
  const defaultImage = "/src/assets/logo.png";
  const defaultUrl = "https://leaad.co";

  const finalTitle = title ? `${title} | Leaad` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image || defaultImage;
  const finalUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
