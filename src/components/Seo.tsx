import { Helmet } from "react-helmet-async";

const SITE_URL = "https://bigboysjr.com";
const SITE_NAME = "Big Boys Junk Removal";
const SHARE_IMAGE = `${SITE_URL}/social-preview.png`;

export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  robots?: string;
  image?: string;
  imageAlt?: string;
  geoPlace?: string;
  schemas?: Record<string, unknown>[];
}

const absoluteUrl = (value: string) => value.startsWith("http") ? value: `${SITE_URL}${value.startsWith("/") ? value: `/${value}`}`;

/**
 * Central source of truth for route-level metadata. Defaults are deliberately
 * conservative so public pages get a complete share preview while private
 * routes can opt into noindex without duplicating tags across the app.
 */
const Seo = ({
  title,
  description,
  path = "/",
  type = "website",
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  image = SHARE_IMAGE,
  imageAlt = "Big Boys Junk Removal logo",
  geoPlace,
  schemas = [],
}: SeoProps) => {
  const canonical = absoluteUrl(path === "/" ? "/": path.replace(/\/$/, ""));
  const shareImage = absoluteUrl(image);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:image:secure_url" content={shareImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="630" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />
      <meta name="twitter:image:alt" content={imageAlt} />
      {geoPlace && <meta name="geo.region" content="US-GA" />}
      {geoPlace && <meta name="geo.placename" content={geoPlace} />}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
};

export default Seo;
