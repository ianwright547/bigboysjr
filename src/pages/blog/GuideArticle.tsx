import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { getProjectsForPath } from "@/data/jobPhotos";

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
  const project = getProjectsForPath(data.path, 1)[0];
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.description,
    image: `https://bigboysjr.com${project.before}`,
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

        <figure className="not-prose my-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="grid sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img src={project.before} alt={project.beforeAlt} width={720} height={540} loading="eager" decoding="async" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-xs font-bold text-background">Before</span>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img src={project.after} alt={project.afterAlt} width={720} height={540} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">After</span>
            </div>
          </div>
          <figcaption className="p-5 text-sm text-muted-foreground"><strong className="text-foreground">Real Big Boys project:</strong> {project.description}</figcaption>
        </figure>

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
          <h2 className="text-2xl font-bold text-foreground mt-10">Turn the Plan Into a Smooth Pickup</h2>
          <p className="text-muted-foreground leading-relaxed">Once you know what should go, the next step is matching the job to the right pricing method. Item pricing works best for a short, specific list. Load-size pricing is usually easier for mixed piles, several rooms, or projects where the exact count is difficult to estimate.</p>
          <p className="text-muted-foreground leading-relaxed">Before booking, note stairs, elevators, tight hallways, long carries, gates, parking limits, heavy material, and anything that may need disassembly. Those details help the crew bring the right equipment and reserve enough time.</p>
          <p className="text-muted-foreground leading-relaxed">On pickup day, separate valuables and documents, confirm the removal list with the crew, and keep pets or children away from the loading path. You do not need to drag heavy items outside unless you prefer a curbside pickup.</p>
        </section>

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
