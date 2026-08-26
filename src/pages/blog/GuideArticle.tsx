import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface GuideArticleData {
  title: string;
  metaTitle: string;
  description: string;
  path: string;
  datePublished: string;
  dateLabel: string;
  readTime: string;
  intro: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
  relatedLinks: { label: string; to: string }[];
}

const GuideArticle = ({ data }: { data: GuideArticleData }) => {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    image: "https://bigboysjr.com/social-preview.png",
    datePublished: data.datePublished,
    dateModified: data.datePublished,
    author: { "@type": "Organization", name: "Big Boys Junk Removal" },
    publisher: {
      "@type": "Organization",
      name: "Big Boys Junk Removal",
      logo: { "@type": "ImageObject", url: "https://bigboysjr.com/logo-128.png" },
    },
    mainEntityOfPage: `https://bigboysjr.com${data.path}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://bigboysjr.com/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://bigboysjr.com/blog" },
      { "@type": "ListItem", position: 3, name: data.title, item: `https://bigboysjr.com${data.path}` },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <Seo
        title={data.metaTitle}
        description={data.description}
        path={data.path}
        type="article"
        schemas={[articleSchema, breadcrumbSchema, faqSchema]}
      />
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24 prose prose-slate max-w-none">
        <Link to="/blog" className="inline-flex items-center text-sm text-primary font-medium mb-8 no-underline hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Guides
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground">Updated {data.dateLabel} • {data.readTime}</p>
        <p className="text-lg text-muted-foreground leading-relaxed">{data.intro}</p>

        {data.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-bold text-foreground mt-10">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph} className="text-muted-foreground leading-relaxed">{paragraph}</p>)}
            {section.bullets && (
              <ul className="text-muted-foreground space-y-1">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section>
          <h2 className="text-2xl font-bold text-foreground mt-10">Frequently Asked Questions</h2>
          <div className="not-prose space-y-3 mt-5">
            {data.faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="not-prose mt-10 rounded-2xl border border-border bg-muted/40 p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Big Boys Resources</h2>
          <div className="flex flex-wrap gap-3">
            {data.relatedLinks.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 not-prose">
          <Button asChild size="lg" className="h-14 px-10 text-lg rounded-xl font-semibold">
            <Link to="/book">Get an Upfront Price <ArrowRight className="w-5 h-5 ml-1" /></Link>
          </Button>
        </div>
      </article>
    </>
  );
};

export default GuideArticle;
