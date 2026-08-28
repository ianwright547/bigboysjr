import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Phone, Star, ShieldCheck, Recycle, Home } from "lucide-react";
import Seo from "@/components/Seo";
import { SERVICE_LINKS } from "@/data/services";
import { Button } from "@/components/ui/button";
import RealJobGallery from "@/components/RealJobGallery";
import { JOB_PROJECTS } from "@/data/jobPhotos";

const Services = () => (
  <main className="pt-16">
    <Seo
      title="Junk Removal Services in Atlanta | Big Boys"
      description="Explore full-service junk removal, furniture and appliance hauling, cleanouts, yard waste, construction debris, and commercial removal across Metro Atlanta."
      path="/services"
      schemas={[{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Junk Removal Services in Atlanta",
        url: "https://bigboysjr.com/services",
      }]}
    />

    <section className="bg-foreground text-background py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Full-service hauling</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">Junk Removal Services in Atlanta</h1>
        <p className="text-lg text-background/75 max-w-2xl mx-auto">
          From one bulky item to a complete property cleanout, our insured crew handles the lifting, loading, hauling, and responsible disposal.
        </p>
      </div>
    </section>

    <section className="py-14 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICE_LINKS.map(({ icon: Icon, name, slug, description, image, imageAlt, imageFit }) => (
            <Link key={slug} to={slug} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-primary hover:shadow-md transition-all">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={image}
                  alt={imageAlt}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${imageFit === "contain" ? "object-contain p-8 bg-white" : "object-cover"}`}
                />
              </div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{name}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">{description} We lift from the agreed location, load the truck, and leave the pickup area tidy.</p>
                <span className="inline-flex items-center text-primary font-semibold">View service <ArrowRight className="w-4 h-4 ml-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <RealJobGallery
      projects={JOB_PROJECTS.slice(3, 6)}
      heading="What Full-Service Removal Looks Like"
      description="These real projects show the difference between simply hauling items away and finishing the job with a clear, usable space."
    />

    <section className="py-16 sm:py-20 bg-muted/40 border-y border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">One crew for nearly every project</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Residential, commercial, and property cleanout help</h2>
          <p className="text-muted-foreground leading-relaxed">Big Boys can handle a single heavy item, several rooms of furniture, renovation leftovers, or a complete turnover. The right service depends on the material, access, volume, and how quickly the space needs to be ready.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Home, title: "Homes and apartments", text: "Furniture, appliances, mattresses, garage clutter, moving leftovers, and room-by-room cleanouts with careful indoor removal." },
            { icon: ShieldCheck, title: "Rentals and businesses", text: "Office furniture, retail fixtures, tenant leftovers, storage areas, and recurring property-management needs with clear access planning." },
            { icon: Recycle, title: "Responsible routing", text: "Usable and recyclable material is separated whenever practical so fewer items go directly to the landfill." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="w-7 h-7 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Customer experiences</p>
          <h2 className="text-3xl sm:text-4xl font-bold">Why customers call Big Boys again</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Green", quote: "They were able to stop by the same day to safely remove an upright piano. Thank you so much for your promptness!" },
            { name: "yS Chang", quote: "Good communication, prompt service, and fair price. I cleaned out my entire basement for a future project!" },
            { name: "Meredith Wikstrom", quote: "They kept me updated, arrived early, and took care when moving my furniture out. I would use them again." },
          ].map((review) => (
            <blockquote key={review.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="w-4 h-4 fill-primary text-primary" />)}</div>
              <p className="text-foreground leading-relaxed mb-4">“{review.quote}”</p>
              <footer className="text-sm font-bold text-muted-foreground">{review.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>

    <section className="py-14 bg-muted/40 border-y border-border">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-2">Simple from start to finish</p>
          <h2 className="text-3xl font-bold mb-4">A crew, a truck, and one clear price</h2>
          <p className="text-muted-foreground leading-relaxed">
            Choose item pricing for a few known pieces or load-size pricing for a larger cleanout. Tell us about stairs, disassembly, access, and timing so the crew arrives prepared.
          </p>
        </div>
        <ul className="space-y-3">
          {["Online estimates by item or load size", "Pickup from garages, basements, offices, and yards", "Donation and recycling whenever practical", "Residential and commercial appointments"].map((item) => (
            <li key={item} className="flex items-start gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />{item}</li>
          ))}
        </ul>
      </div>
    </section>

    <section className="py-16 text-center">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3">Ready to clear the clutter</h2>
        <p className="text-muted-foreground mb-7">Build an estimate online or speak with the team about a larger property cleanout.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl"><Link to="/book">Get an instant quote <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl"><a href="tel:+14706606874"><Phone className="w-4 h-4 mr-2" />Call (470) 660-6874</a></Button>
        </div>
      </div>
    </section>
  </main>
);

export default Services;
