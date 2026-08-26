import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import Seo from "@/components/Seo";
import { SERVICE_LINKS } from "@/data/services";
import { Button } from "@/components/ui/button";

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
          {SERVICE_LINKS.map(({ icon: Icon, name, slug }) => (
            <Link key={slug} to={slug} className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{name}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Professional pickup with upfront pricing, careful removal from anywhere on the property, and a clean finish.
              </p>
              <span className="inline-flex items-center text-primary font-semibold">View service <ArrowRight className="w-4 h-4 ml-1" /></span>
            </Link>
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
