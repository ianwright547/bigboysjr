import { motion } from "framer-motion";
import type { JobProject } from "@/data/jobPhotos";

interface RealJobGalleryProps {
  projects: JobProject[];
  eyebrow?: string;
  heading: string;
  description: string;
  className?: string;
}

const RealJobGallery = ({ projects, eyebrow = "Real Big Boys jobs", heading, description, className = "" }: RealJobGalleryProps) => (
  <section className={`bg-background py-16 sm:py-24 ${className}`}>
    <div className="max-w-6xl mx-auto px-4">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{eyebrow}</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{heading}</h2>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.article
            key={`${project.title}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="grid grid-cols-2">
              <figure className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img src={project.before} alt={project.beforeAlt} width={600} height={750} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <figcaption className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-xs font-bold text-background">Before</figcaption>
              </figure>
              <figure className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img src={project.after} alt={project.afterAlt} width={600} height={750} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <figcaption className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">After</figcaption>
              </figure>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default RealJobGallery;
