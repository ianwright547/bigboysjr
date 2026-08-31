import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Seo from "@/components/Seo";
import { getProjectsForPath } from "@/data/jobPhotos";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const POSTS = [
  {
    slug: "estate-cleanout-checklist-atlanta",
    title: "Estate Cleanout Checklist for Atlanta Families",
    excerpt: "A practical room-by-room plan for sorting, donating, documenting, and removing items during an Atlanta estate cleanout.",
    date: "August 18, 2026",
  },
  {
    slug: "how-to-prepare-for-junk-removal-pickup",
    title: "How to Prepare for a Junk Removal Pickup",
    excerpt: "Save time on pickup day with a clear preparation checklist covering access, sorting, estimates, safety, and items that require special handling.",
    date: "August 11, 2026",
  },
  {
    slug: "furniture-removal-atlanta-guide",
    title: "Furniture Removal in Atlanta: A Complete Guide",
    excerpt: "Learn how professional furniture removal works, what affects pricing, and how reusable pieces may be donated instead of discarded.",
    date: "August 4, 2026",
  },
  {
    slug: "appliance-removal-disposal-atlanta",
    title: "Appliance Removal and Disposal in Atlanta",
    excerpt: "What Atlanta homeowners should know before removing refrigerators, washers, dryers, ovens, and other bulky household appliances.",
    date: "July 28, 2026",
  },
  {
    slug: "how-much-does-junk-removal-cost-atlanta",
    title: "How Much Does Junk Removal Cost in Atlanta?",
    excerpt: "A complete breakdown of junk removal pricing in Atlanta by item, by load, and the factors that affect your final cost.",
    date: "April 10, 2026",
  },
  {
    slug: "same-day-junk-removal-vs-dumpster-rental",
    title: "Same-Day Junk Removal vs. Dumpster Rental: Which Is Better?",
    excerpt: "Comparing the cost, convenience, and speed of professional junk removal versus renting a dumpster for your project.",
    date: "April 5, 2026",
  },
  {
    slug: "what-items-can-be-recycled-or-removed",
    title: "What Items Can Be Recycled or Removed?",
    excerpt: "A guide to what junk removal companies in Atlanta can and cannot take, plus tips on recycling and donation.",
    date: "March 28, 2026",
  },
  {
    slug: "how-to-declutter-your-garage-fast",
    title: "How to Declutter Your Garage Fast",
    excerpt: "Step-by-step tips for clearing out your garage quickly, plus when to call a professional junk removal service.",
    date: "March 20, 2026",
  },
];

const Blog = () => (
  <>
    <Seo
      title="Junk Removal Tips and Guides | Big Boys Atlanta"
      description="Practical Atlanta junk removal guides covering pricing, decluttering, recycling, cleanouts, and choosing between pickup service and dumpsters."
      path="/blog"
    />
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <motion.h1 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="text-4xl sm:text-5xl font-bold text-foreground text-center mb-4"
      >
        Atlanta Junk Removal Tips and Guides
      </motion.h1>
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
      >
        Detailed, practical advice on pricing, decluttering, cleanouts, preparation, recycling, and choosing the right removal service for Atlanta-area properties.
      </motion.p>
      <div className="grid md:grid-cols-2 gap-6">
        {POSTS.map((post, i) => (
          <motion.article key={post.slug} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
            <Link
              to={`/blog/${post.slug}`}
              className="block overflow-hidden bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all group h-full"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <img src={getProjectsForPath(post.slug, 1)[0].before} alt={getProjectsForPath(post.slug, 1)[0].beforeAlt} width={720} height={405} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center text-sm font-semibold text-primary">Read the complete guide <ArrowRight className="w-4 h-4 ml-1" /></span>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-muted/40 p-6 sm:p-10">
        <div className="max-w-3xl">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Start with the right guide</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Plan a safer, faster junk removal project</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>Use the pricing guide when you are comparing item and load estimates. Read the pickup-preparation guide when access, stairs, parking, or building rules could affect the appointment. For larger family or property transitions, the estate-cleanout and garage-decluttering guides provide a room-by-room process.</p>
            <p>Each guide is written for Metro Atlanta conditions and links directly to the matching service and city pages. When you are ready, the online pricing flow lets you enter a ZIP code, choose items or load size, describe access details, and select an available pickup window.</p>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default Blog;
